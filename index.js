const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const app = express();
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("database connected"))
  .catch((err) => console.log(`error ${err}`));

app.use(expressValidator());
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
const postRoutes = require("./routes/posts");
const authRoutes = require("./routes/auth");
const registerRoutes = require("./routes/register");
const userRoutes = require("./routes/users");

app.use("/", postRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", registerRoutes);
app.get("/", (req, res) => {
  fs.readFile("docs/apiDocs.json", (err, data) => {
    if (err) {
      res.status(400).json({ error: err });
    }
    const docs = JSON.parse(data);
    res.json(docs);
  });
});

app.get('/home', (req, res)=>{
    res.status(200).send({
        message: "You are on Homepage",
        info: {
            login: "Send verification code through /login . It contains two params i.e. phonenumber and channel(sms/call)",
            verify: "Verify the recieved code through /verify . It contains two params i.e. phonenumber and code"
        }
    })
})








const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN)

// /login
//     - phone number
//     - channel (sms/call)

// /verify
//     - phone number
//     - code


app.get('/home', (req, res)=>{
    res.status(200).send({
        message: "You are on Homepage",
        info: {
            login: "Send verification code through /login . It contains two params i.e. phonenumber and channel(sms/call)",
            verify: "Verify the recieved code through /verify . It contains two params i.e. phonenumber and code"
        }
    })
})


// Login Endpoint
app.get('/login', (req,res) => {
     if (req.body.phone) {
        client
        .verify
        .services(process.env.SERVICE_ID)
        .verifications
        .create({
            to: `+${req.body.phone}`,
            channel: req.query.channel==='call' ? 'call' : 'sms' 
        })
        .then(data => {
            res.status(200).send({
                message: "Verification is sent!!",
                phone: req.body.phone,
                data
            })
        }) 
     } else {
        res.status(400).send({
            message: "Wrong phone number :(",
            phone: req.body.phonenumber,
            data
        })
     }
})

// Verify Endpoint
app.get('/verify', (req, res) => {
    if (req.query.phone && (req.query.code).length === 6) {
        client
            .verify
            .services(process.env.SERVICE_ID)
            .verificationChecks
            .create({
                to: `+${req.query.phone}`,
                code: req.query.code
            })
            .then(data => {
              console.log(data)
                if (data.status === "approved") {
                    res.status(200).send({
                        message: "User is Verified!!",
                        data
                    })
                }
            })
    } else {
        res.status(400).send({
            message: "Wrong phone number or code :(",
            phone: req.query.phone,
            data
        })
    }
})




app.use((err, req, res) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "Unauthorized " });
  }
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`the  server is running on port ${port}`);
});
