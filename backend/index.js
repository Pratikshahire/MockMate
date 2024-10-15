const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const PdfReader = require("pdfreader").PdfReader;
const {InsertResume} = require("./Database/index.js")
const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

const parserRouter = require("./Models/ResumeParser");
const questionsRouter = require("./Models/QuestionGeneration");
const userRouter = require("./Database/UserRouter");

app.use("/model", parserRouter);
app.use("/gemini", questionsRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("Home Page");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'Resume/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);  
    }
    cb(null, uploadPath);  
  },
  filename: (req, file, cb) => {
    console.log("Inside filename function. Filename received:", file.originalname);
    cb(null, file.originalname);  
  },
});

const upload = multer({ storage });


function ReadResume(fname, username) {
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

app.post('/upload', upload.single('pdfFile'), (req, res) => {
 
  if (!req.file) {
    return res.status(400).send({ error: 'File is required' });
  }

  const email = req.body.email;
  const originalFileName = "Resume/" + req.file.originalname;
 
  ReadResume(originalFileName, email);
  res.send({ message: 'PDF uploaded and renamed successfully!', file: originalFileName });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App is running at PORT ${PORT}`);
});
