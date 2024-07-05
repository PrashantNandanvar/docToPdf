const AWS = require("aws-sdk");
const mammoth = require("mammoth");
const fs = require("fs");
const pdf = require("html-pdf");

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_SECRET_KEY,
  secretAccessKey: process.env.AWS_ACCESS_KEY,
}); // Replace 'your-region' with your AWS region
const s3 = new AWS.S3();

// const bucketName = 'plannerpal-secure-bucket';
// const key = 'suitability-reports/"_M_r_ _J_o_h_n_ _S_m_i_t_h_"_2024-03-26_14-08-31.docx'; // Replace with the key of your DOCX file in the S3 bucket
// Function to download file from S3
function downloadFileFromS3(bucketName, key) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    s3.getObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Body);
      }
    });
  });
}

// Function to convert DOCX to HTML
function convertDocxToHtml(docxData) {
  return mammoth.convertToHtml(docxData);
}

// Function to convert HTML to PDF
function convertHtmlToPdf(htmlContent, pdfFilePath) {
  return new Promise((resolve, reject) => {
    pdf.create(htmlContent).toFile(pdfFilePath, (error, res) => {
      if (error) {
        reject(error);
      } else {
        resolve(res);
      }
    });
  });
}

// Main function
async function main() {
  const bucketName = "plannerpal-secure-bucket";
  const key =
    'suitability-reports/"_M_r_ _J_o_h_n_ _S_m_i_t_h_"_2024-03-26_14-08-31.docx'; // Replace with the key of your DOCX file in the S3 bucket
  const pdfFilePath = "output.pdf"; // Path to the output PDF file

  try {
    // Download DOCX file from S3
    const docxData = await downloadFileFromS3(bucketName, key);

    // Convert DOCX to HTML
    const htmlResult = await convertDocxToHtml(docxData);
    let htmlContent = htmlResult.value;

    // Replace image URLs with base64-encoded images
    const images = htmlResult.messages.filter(
      (message) => message.type === "image"
    );
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imageData = await downloadFileFromS3(bucketName, image.url);
      const base64Image = imageData.toString("base64");
      htmlContent = htmlContent.replace(
        image.url,
        `data:${image.contentType};base64,${base64Image}`
      );
    }

    // Convert HTML to PDF
    await convertHtmlToPdf(htmlContent, pdfFilePath);

    console.log("PDF created successfully.");
  } catch (error) {
    console.error("Error:", error);
  }
}
// Call main function
main();
