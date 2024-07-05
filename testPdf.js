const axios = require('axios');
const fs = require('fs').promises;
const mammoth = require('mammoth');
const { PDFDocument } = require('pdf-lib');

(async () => {
    const url = 'https://plannerpal-secure-bucket.s3.eu-west-2.amazonaws.com/suitability-reports/M_r_s_%20_M_a_r_y_%20_W_i_l_l_i_a_m_s_%2C_M_r_%20_M_i_c_h_a_e_l_%20_W_i_l_l_i_a_m_s_2024-03-27_06-09-42.docx?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAZAWH5F44EFVB4JVF%2F20240327%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240327T101231Z&X-Amz-Expires=3600&X-Amz-Signature=6f11269702aff60b37fd8a2fb67702ddbececb66d7ab35ed199b1e23bbbd998d&X-Amz-SignedHeaders=host';

    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const docxBuffer = Buffer.from(response.data);
        
        // Convert DOCX buffer to HTML
        const { value: htmlString } = await mammoth.convertToHtml(docxBuffer );

        // Create PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        page.drawText(htmlString);

        // Save PDF to buffer
        const pdfBytes = await pdfDoc.save();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/pdf',
            },
            body: pdfBytes.toString('base64'),
            isBase64Encoded: true
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error converting Word document to PDF' })
        };
    }
})();
