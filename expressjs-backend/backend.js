const express = require('express');
const app = express();
const cors = require('cors')
const port = 8000;
const dotenv = require("dotenv");
const https = require("https");
const fs = require("fs")
const jwt = require('jsonwebtoken');

const authRouter = require("./routes/oath");

const requestRouter = require("./routes/request");

app.use(cors());
app.use(express.json());
app.use("/oath", authRouter);
app.use("/request", requestRouter);


dotenv.config();
process.env.TOKEN_SECRET;


app.get('/users', async (req, res) => {
    const name = req.query["name"];
    const job = req.query["job"];

    try {
        const result = await userServices.getUsers(name, job);
        res.send({ users_list: result });
      } catch (error) {
        console.log(error);
        res.status(500).send("An error ocurred in the server.");
      }
})

app.post('/account/login', async (req, res) => {
    console.log(req.body)
    const user = await userServices.findUserByName(req.body.userId)
    console.log(user)
    if (user && (user.password == req.body.password)) {
        res.status(200).send({user: user})
    } else {
        res.status(400).end()
    }
})

app.post('/account/signup', async (req, res) => {
    console.log(req.body)
    const userId = req.body.userId
    const password = req.body.password
    const confirmedPassword = req.body.confirmedPassword
    
    if(!userId || !password || !confirmedPassword) {
        res.send({message: "Invalid input"})
    } else if (await userServices.findUserByName(userId)) {
        res.send({message: "User already exists"})
    } else if (password != confirmedPassword) {
        res.send({message: "Passwords do not match"})
    } else if (!isLongEnough(password) || !containsUppercase(password) || !containsNumber(password)) {
        res.send({message: "Password must be over 8 characters long, contain an uppercase letter and a number"})
    } else  {
        const user = {
            name: userId,
            password: password,
            token: generateAccessToken(userId),
        };
        const savedUser = await userServices.addUser(user);
        if (savedUser) res.status(201).send({user: savedUser});
        else res.status(500).end();
    }
})

https
  .createServer(
		// Provide the private and public key to the server by reading each
		// file's content with the readFileSync() method.
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app
  )
  .listen(port, () => {
    console.log(`Backend is runing at port ${port}`);
  });

function isLongEnough(myString) {
    return typeof myString === "string"  && myString.length > 8
}

function containsUppercase(str) {
    return /[A-Z]/.test(str);
}

function containsNumber(myString) {
    return /\d/.test(myString);
}

function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET);
  }