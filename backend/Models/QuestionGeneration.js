const express = require("express");
const router = express.Router();

const {getResumeData} = require("../Database/index.js")
const {Interview} = require("./InterviewSimulation.js");

const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { route } = require("./ResumeParser.js");
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });


const cleanResponse = (response) => {
  const jsonStart = response.indexOf('{');
  const jsonEnd = response.lastIndexOf('}');
  return  response.substring(jsonStart, jsonEnd + 1);
  
};

function jsonToString(data) {
  let result = [];

  function recursiveTraverse(data) {
      if (typeof data === 'object' && !Array.isArray(data)) {
          for (let key in data) {
              if (data.hasOwnProperty(key)) {
                  result.push(`${key}:`);  
                  recursiveTraverse(data[key]);  
              }
          }
      } else if (Array.isArray(data)) {
          data.forEach(item => {
              recursiveTraverse(item); 
          });
      } else {
          result.push(`${data}`);  
      }
  }

  recursiveTraverse(data);
  return result.join(', ');
}

async function seperateData(userData){
  const prompt = "Please parse the following resume into a JSON object with clearly defined sections. Each section should be a separate key in the JSON object. The keys should include: 'Work Experience', 'Technical Skills', 'Soft skills', 'Projects', and any other relevant sections. Make sure the response is in strict JSON format so that it can be parsed without errors.";
  const result = await model.generateContent(userData + " " + prompt);
  const response = await result.response;
  const text = response.text();
  
  const cleanedRes = cleanResponse(text);
  const parsedData = JSON.parse(cleanedRes);
  const resumeMap = new Map();

  Object.keys(parsedData).forEach(section => {
    const str = jsonToString(parsedData[section]);
    resumeMap.set(section, str);
  });

  return resumeMap;
} 

async function getQuestions(section, data, cnt){
  const prompt = data + `This is candidates ${section} related data, please provide ${cnt} questions for his/her interview , questions should be relavant to his/her data provided. Response should contain question number as key and question as value don't provide any other information. Don't consider personal information such as address, phone no, etc and education like schooling, etc while generating questions. Make sure the response is in strict JSON format so that it can be parsed without errors.`
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const cleanedRes = cleanResponse(text);
  const parsedData = JSON.parse(cleanedRes);
  
  let queList = []
  Object.keys(parsedData).forEach(section => {
    queList.push(parsedData[section]);
  });

  // console.log(section + " :- ");
  // console.log(queList);

  return queList;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

function mapToList(queMap){
  let sections = Array.from(queMap.keys());
  shuffleArray(sections);

  let val = 1;
  let secIds = [];

  let queArray = ["Please introduce yourself."];
  sections.forEach(sec => {
    queArray.push(...queMap.get(sec));
    const list = queMap.get(sec);
    secIds.push(val);
    val += list.length;
  });

  var obj = {
    quelst : queArray,
    secId : secIds
  }
  return obj;
}

router.post("/questions", async (req, res) => {
  console.log("API called");
  const username = req.body.email;
 
  const userdata = await getResumeData(username);
  
  const map = await seperateData(userdata.resume);
  const queMap = new Map();

  for (let [key, value] of map.entries()){
    const cnt = 3;
    if(value.length == 0 || value == "" || value == null) continue;

    const queList = await getQuestions(key, value, cnt);
    queMap.set(key, queList);
  }

  const obj = mapToList(queMap);
  const queList = obj.quelst;
  secIds = obj.secId;

  console.log(queList);
  Interview(queList, secIds);
  
  res.send("Question Generation model : User");
});


// routes for testing purpose 
router.get("/test", async (req, res) => {
  console.log("testing.....");

  

  res.send("Testing Completed");
});

// Testing routes compeletd 

module.exports = router;


/*

1. Deploy
2. Resume upload
3. Frontend Design 
4. Timer 
5. Solve Issue of multiple API Calls 
6. Registration / Login



*/