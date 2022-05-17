const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
var jwt = require("jsonwebtoken");
const { header } = require("express/lib/response");
const { decode } = require("jsonwebtoken");

//midilware

app.use(cors());
app.use(express.json());

function verifyToken (req,res,next){

  const authHeader=(req.headers.authorization)
  if(!authHeader){
   return res.status(401).send({message:"unauthorized"})
  }
  const token = authHeader.split(' ')[1];

  jwt.verify(token,process.env.ACCES_TOKEN,(error,decoded)=>{

    if(error){

      return res.status(403).send({message :"forbidden"})
    }  

    req.decoded=decoded;
    next()
  });

  console.log("insiode header",authHeader)


}

app.post("/login", (req, res) => {
  const query = req.body;
  console.log(query);
  if (query.email === "user@gmail.com" && query.password === "123456") {
    const accesToken = jwt.sign(
      { email: query.email },
      process.env.ACCES_TOKEN,
      { expiresIn: "12h" }
    );

    res.send({
      sucess: true,
      accesToken: accesToken,
    });
  } else {
    res.send({ sucess: false });
  }
});

app.get("/orders", verifyToken,(req,res)=>{
  // console.log(req.headers.authorization)

  res.send([{id:1,item:"sunglass"},{id:2,item:"monglass"}])
})

app.get("/", (req, res) => {
  res.send("Hello SWT sERVER-SIDE");
});

app.listen(port, () => {
  console.log("Hi listen jwt server");
});
