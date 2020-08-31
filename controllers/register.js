const Register = require("../model/register");
const jwt = require("jsonwebtoken");
const { response } = require("express");
var messagebird = require('messagebird')(process.env.MESSAGEBIRD_API_KEY);
exports.register = async (req, res, next) => {
  const userExists = await Register.findOne({ email: req.body.email });
  if (userExists) {
    return res.status(403).json({
      error: "email is already taken Login!",
    });
  }
    const user = new Register(req.body);
    user
      .save()
      .then(() => {
        res.json({
          message: "User added successfully!",
          user,
        });
      })
      .catch((error) => {
        res.json({
          error,
        });
      });
};


exports.login=(req, res)=> {
  const { email, phone } = req.body;


Register.findOne({ phone }, (err, user) => {
  console.log(user)
    if (err || !user) {
      return res.status(401).json({
        message: "user with that phone number doesnt exist",
      });
    }

    messagebird.verify.create(phone, {
        originator : 'Code',
        template : 'Your verification code is %token.'
    },function(err,response){
      if(err){
        console.log(err)
      }else{
        console.log(response)
      }
       })  

    // if (user) {
    //         const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    //       res.cookie("t", token, { expire: new Date() + 9999 });
    //       const { _id, username  ,phone} = user;
    //       return res.json({ token, user: { _id, email, username,phone } });
            
    
    // }else{
    //   res.status(500).json({message:"something went wrong"})
    // }
  });
}
    