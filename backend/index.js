const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./auth");
const verifyToken = require("./auth");
const fs = require("fs");
const https = require("https");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/images", express.static(__dirname + "/images"));
var https_options  = {
  cert: fs.readFileSync("certificate.crt"),
  key: fs.readFileSync("private.key"),
  ca: fs.readFileSync('ca_bundle.crt')
};

const PORT = process.env.PORT || process.env.API_PORT;
//mongo
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

//schema
const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
  isAdmin: {
    type: Boolean,
    default: false,
    },
  token: String,
});

const userModel = mongoose.model("user", userSchema);
//api register
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.send({ message: "inputrequried" });
      return;
    }
    const result = await userModel.findOne({ email: email });
    if (result) {
      res.send({ message: "emailalreadyexists" });
    } else {
      encryptedPassword = await bcrypt.hash(password, 10);

      //create user
      const user = await userModel.create({
        email: email,
        password: encryptedPassword,
        isAdmin: false,
      });
      console.log(user);

      const token = jwt.sign(
        {
          user_id: user._id,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "1h",
        }
      );
      //save user token
      user.token = token;
      res.send({ message: "successfully", data: user });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

//api login

app.post("/login", async (req, res) => {
    try {
      console.log(req.body);
      const { email, password } = req.body;
      if (!email || !password) {
        res.send({ message: "inputrequried" });
        return;
      }
  
      const user = await userModel.findOne({ email });
      if (user && (await bcrypt.compare(password, user.password))) {
        const payload = {
          user_id: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
        };
        const token = jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: "1h" });
        
        // update token in userModel
        user.token = token;
        await user.save();
  
        const dataSend = { 
          _id: user._id,
          email: user.email,
          token: user.token,
        };
        console.log(payload);
        res.send({ message: "Loginsuccessfully", data: dataSend });
      } else {
 
        res.send({ message: "Usernotfound" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred" });
    }
  });
  

//product add
const schemaProduct = mongoose.Schema({
  name: String,
  detail: String,
  price: Number,
  priceSale: {
    type: Number,
    default: 0,
  },
  promotion: {
    type: Boolean,
    default: false,
  },
  quantity: Number,
  category: String,
  dateUpdate: {
    type: Date,
    default: Date.now,
  },
});

//save product to database api
app.post("/addproduct" , verifyToken ,async (req, res,) => {
   
  //check admin from database
  try {
  const email = req.body.email;
  const user = await userModel.findOne({ email });
  if (!user) {
    res.send({ message: "usernotfound" });
    return;
  }
   
 if (user.isAdmin === true) {
  const productModel = mongoose.model("product", schemaProduct);
  const data = productModel(req.body);
  const save = await data.save();
  const id = save._id;
  const base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
  fs.writeFileSync("images/products/" + id + ".png", base64Data, "base64");
  res.send({ message: "successfully" });
  
    } else {
        res.send({ message: "notadmin" });
        return;
    }
    
  // add image base64 to png save save in database 
}catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
    }
    });

//get product from database api
app.get("/getproduct", async (req, res) => {
  const productModel = mongoose.model("product", schemaProduct);
  const data = await productModel.find();
  res.send(JSON.stringify(data));
});
 
app.post('/welcome', auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});

app.get('/api/getuserdata', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const user = await userModel.findById(userId);
    res.json(user);
    console.log(user);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});


const httpsServer = https.createServer(https_options, app);

httpsServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});