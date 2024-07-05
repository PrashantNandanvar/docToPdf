const fs = require('fs').promises;
const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);

const docToPdf = async (req, res) => {
    try {
      const pdfFilePath = '/Users/ztlab57/Desktop/msteambot/__M_r_ _J_o_h_n_ _S_m_i_t_h___2024-03-26_14-08-31.pdf';
      const docxFilePath = '/Users/ztlab57/Desktop/msteambot/__M_r_ _J_o_h_n_ _S_m_i_t_h___2024-03-26_14-08-31 (2).docx';
  
      // Read file
      const docxBuf = await fs.readFile(docxFilePath);
      console.log('docDone');
      // Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
      let pdfBuf = await libre.convertAsync(docxBuf, '.pdf', undefined);
      console.log(pdfBuf)  
      // Here in done you have pdf file which you can save or transfer in another stream
      await fs.writeFile(pdfFilePath, pdfBuf);
  
      console.log('DOCX file converted to PDF successfully.');
    //   return res.status(200).json({
    //     message: 'DOCX file converted to PDF successfully.',
    //     pdfFilePath: pdfFilePath,
    //   });
    } catch (error) {
      console.error('Error converting DOCX to PDF:', error);
    }
  };

  docToPdf()