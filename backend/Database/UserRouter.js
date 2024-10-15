const express = require("express");
const router = express.Router();
const {SignUp, Login, getUser} = require("./index.js")

router.post("/signup", async (req, res) => {
    const data = req.body.userdata;
   
    const result = await SignUp(data);
    if(result == "Error"){
        res.status(400).send("Error");
    }else{
        res.status(200).send("User created");
    }
});

router.post("/login", async (req, res) => {
    const data = req.body.userdata;
    
    const result = await Login(data);
    if(result == "User found"){
        res.status(200).send(result);
    }else{
        res.status(400).send("User Not found");
    }
});

router.post("/getUser", async (req, res) => {
    const data = req.body.userdata;

    const result = await getUser(data);
    res.send(result);
});




module.exports = router;