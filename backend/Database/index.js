const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function InsertResume(username, data) {
  await prisma.user.update({
    where: {
      email: username,
    },
    data: {
      parsedResume: data,
    },
  });

  console.log("User resume data updated");
}

async function getResumeData(username) {
  const res = await prisma.user.findFirst({
    select: {
      parsedResume: true,
    },
    where: {
      email: username,
    },
  });

  return res;
}

async function SignUp(data) {
  try {
    const res = await prisma.user.create({
      data : {
        email : data.email,
        name : data.name,
        interviewCount : 0,
        password : data.password
      }
    });

    return "User created";
  } catch (err) {
    console.log(err);
    return "Error";
  }
}

async function Login(data) {
  try{
    const res = await prisma.user.findFirstOrThrow({
      where : {
        email : data.email,
        password : data.password
      }
    });

    return "User found";
  }catch(err){
    return "User Not Found";
  }
}

async function getUser(data) {
  try{
    const res = await prisma.user.findFirst({
      where : {
          email : data.email
      },
      select : {
        name : true,
        email : true,
        interviewCount : true,
        reportIds : true
      }
    });

    let final = []

    if(res == null){
      return "User Not Found";
    }else{
      const reportId = res.reportIds;
      
      const reports = await Promise.all(
        reportId.map(async (reId) => {
          const result = await prisma.report.findFirst({
            where: {
              id: reId
            },
            select: {
              totalQ: true,
              QAnswered: true,
              accuracy: true,
              feedback: true,
              finalReport: true
            }
          });
      
          return result;  
        })
      );
      
      final.push(res.email)
      final.push(res.name)
      final.push(res.interviewCount)
      final.push(reports)
    }

    return final;
  }catch(err){
    console.log(err);
    return null;
  }
}

module.exports = {
  InsertResume,
  getResumeData,
  SignUp, 
  Login,
  getUser
};
