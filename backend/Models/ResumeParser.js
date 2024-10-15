const fs = require("fs");
const PdfReader = require("pdfreader").PdfReader;
const express = require("express");
const {InsertResume} = require("../Database/index.js")
const router = express.Router();

function ReadResume(username) {
  const fname = username + ".pdf";
  fs.readFile(fname, async (err, pdfBuffer) => {
    if (err) {
      console.error("Error reading PDF:", err);
      return;
    }

    let fullText = "";
    let data = "";

    const parsePdf = () => {
      return new Promise((resolve, reject) => {
        new PdfReader().parseBuffer(pdfBuffer, (err, item) => {
          if (err) {
            reject(err);
          } else if (!item) {
            console.warn("End of buffer");

            const sentences = fullText.match(/[^.!?]+[.!?]+/g) || [];
            sentences.forEach((sentence) => {
              let temp = sentence.trim();
              data += temp + " ";
            });

            resolve(data);
          } else if (item.text) {
            fullText += item.text.replace(/\s+/g, " ");
          }
        });
      });
    };

    try {
      data = await parsePdf(); 
      InsertResume(username, data);
      console.log("Resume data inserted to DB");
    } catch (error) {
      console.error("Error during PDF parsing:", error);
    }
  });
}

router.get("/parser", (req, res) => {
  ReadResume();
  res.send("Parser Page");
});

module.exports = router;
