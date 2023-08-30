const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./auth");
const verifyToken = require("./auth");
const fs = require("fs");
const path = require("path");
const https = require("https");
const sharp = require('sharp');
const multer = require("multer");
const nodemailer = require('nodemailer');
const shopEmail = "shopfuku@gmail.com"
const shopEmailPass = "password"
const shopName = "FukurouShop"

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: shopEmail,
    pass: shopEmailPass,
  },
});

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
 

app.use("/images", express.static(__dirname + "/images"));
var https_options = {
  cert: fs.readFileSync("certificate.crt"),
  key: fs.readFileSync("private.key"),
  ca: fs.readFileSync('ca_bundle.crt')
};
const IMAGE_UPLOAD_PATH = path.join(__dirname, "images", "receipts");
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, IMAGE_UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split(".").pop();
    const filename = `${req.body.orderId}.${extension}`;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });



app.get("/api/admin/orders", verifyToken, async (req, res) => {
  try {
    const isAdmin = req.user.isAdmin;

    if (!isAdmin) {
      return res.status(403).json({ message: "Access forbidden" });
    }

    const orders = await userOrderModel.find();
    res.json({ message: "Successfully fetched orders", orders: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
});


app.get("/api/admin/orders/filter", verifyToken, async (req, res) => {
  try {
    const isAdmin = req.user.isAdmin;
    const filterStatus = req.query.status;

    if (!isAdmin) {
      return res.status(403).json({ message: "Access forbidden" });
    }

    const orders = await userOrderModel.find({ status: filterStatus });

    res.json({ message: "Successfully fetched orders", orders: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
});

// Route to upload receipt image
app.post("/api/uploadreceipt", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"]; // ประเภทไฟล์ที่รองรับ
    if (!allowedFileTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: "Unsupported file type" });
    }
    const orderId = req.body.orderId;
    const extension = req.file.originalname.split(".").pop();
    const pngImagePath = path.join(__dirname, "images", "receipts", `${orderId}.png`);
    await sharp(req.file.path).toFormat("png").toFile(pngImagePath);
    fs.unlinkSync(req.file.path);
    const imageUrl = `${process.env.SERVER_URL}/images/receipts/${orderId}.png`;
    await userOrderModel.updateOne({ _id: orderId }, { receiptImageUrl: imageUrl });
    res.json({ message: "Receipt uploaded and converted to PNG successfully", imageUrl: imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
});


app.post('/api/cancelproduct', verifyToken, async (req, res) => {
  const { email, orderId } = req.body;
  try {
    const cancelOrder = await userOrderModel.findOneAndUpdate(
      {
        _id: orderId,
        email: email,
      },
      { status: 'cancel' }
    );

    if (cancelOrder) {
      res.json({ message: 'Product cancelled successfully' });
    } else {
      res.status(404).json({ message: 'Order not found or not authorized' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

app.get("/api/receipts/:orderId", verifyToken, (req, res, next) => {
  const isAdmin = req.user.isAdmin;
  const orderId = req.params.orderId;
  if (isAdmin) {
    // Allow admin to access the image
    const imagePath = path.join(__dirname, "images/receipts", `${orderId}.png`);
    res.sendFile(imagePath);
  } else {
    userOrderModel.findOne({ _id: orderId, email: req.user.email })
      .then((order) => {
        if (order) {
          // Allow user who owns the order to access the image
          const imagePath = path.join(__dirname, "images/receipts", `${orderId}.png`);
          res.sendFile(imagePath);
        } else {
          res.status(403).send("Access forbidden");
        }
      })
      .catch((error) => {
        res.status(500).send("Internal Server Error");
      });
  }
});

app.post("/api/updateorderstatus", verifyToken, async (req, res) => {
  const orderId = req.body.orderId;
  const newStatus = req.body.newStatus;
  
  try {
    const updateOrder = await userOrderModel.updateOne({ _id: orderId }, { status: newStatus });

    if (updateOrder) {
      // Check if the new status is "shipped"
      if (newStatus === "shipped") {
        // Retrieve the order details
        const order = await userOrderModel.findById(orderId);

        // Send email notification
        transporter.sendMail({
          from: '"'+shopName+'" <'+shopEmail+'>',
          to: order.email,
          subject: shopName,
          text: `คำสั่งซื้อของคุณได้ถูกจัดส่งแล้ว \nรหัสออเดอร์: ${order._id}\n
          \n ชื่อผู้สั่ง: ${order.realname}
          \n หมายเลขพัสดุ: ${order.tracking}
          \n อีเมล: ${order.email}
          \n เบอร์โทร: ${order.phone}
          \n ที่อยู่: ${order.address} ${order.subdistrict} ${order.district} ${order.province} ${order.postalcode}
          \n วันที่สั่งซื้อ: ${order.dateUpdate}
          \n ค่าขนส่ง: ${order.shippingcost}
          \n ราคารวม: ${order.totalwithshipping}
          \n\n ขอบคุณที่ใช้บริการ ${shopName} 🦉`
        }).then(info => {
          console.log({ info });
        }).catch(console.error);
      }

      res.json({ message: "Order status updated successfully", order: updateOrder });
    } else {
      console.log("Order not found");
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("An error occurred while updating order status", error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
});


app.post("/api/updateordertracking", verifyToken, async (req, res) => {
  const orderId = req.body.orderId;
  const tracking = req.body.tracking;
  try {
    const updateOrder = await userOrderModel.updateOne({ _id: orderId }, { tracking: tracking });
    if (updateOrder) {
      res.json({ message: "Order status updated successfully", order: updateOrder });
    } else {
      console.log("Order not found");
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("An error occurred while updating order status", error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
});


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

      const token = jwt.sign(
        {
          user_id: user._id,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
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
      const token = jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: "2h" });

      // อัพเดต token ใน userModel
      user.token = token;
      await user.save();

      const dataSend = {
        _id: user._id,
        email: user.email,
        token: user.token,
        isAdmin: user.isAdmin,
      };
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

const productModel = mongoose.model("product", schemaProduct);
app.post("/addproduct", verifyToken, async (req, res) => {
  // Check admin from the database
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

      const base64Data = req.body.image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
      const imageExtension = req.body.image.match(/^data:image\/(png|jpeg|jpg);base64,/)[1];
      const imagePath = path.join(__dirname, "images", "products", `${id}.${imageExtension}`);

      fs.writeFileSync(imagePath, base64Data, "base64");

      // แปลงรูปภาพจาก JPEG หรือ JPG เป็น PNG โดยใช้ sharp
      const outputImagePath = path.join(__dirname, "images", "products", `${id}.png`);
      await sharp(imagePath).toFormat('png').toFile(outputImagePath);
      fs.unlinkSync(imagePath);
      res.send({ message: "successfully", imageUrl: outputImagePath });

    } else {
      res.send({ message: "notadmin" });
      return;
    }

    // Add image base64 to png save save in the database 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});


//update product to database api
// app.put("/editproduct", verifyToken, async (req, res) => {
app.put("/editproduct", verifyToken, express.json(), async (req, res) => {
  try {
    const email = req.body.email;
    const user = await userModel.findOne({ email });
    if (!user) {
      res.send({ message: "usernotfound" });
      return;
    }
    if (user.isAdmin !== true) {
      res.send({ message: "notadmin" });
      return;
    }
    const productId = req.body._id;
    const productModel = mongoose.model("product", schemaProduct);
    const existingProduct = await productModel.findById(productId);
    if (!existingProduct) {
      res.send({ message: "productnotfound" });
      return;
    }
    const updatedProductData = req.body;
    existingProduct.name = updatedProductData.name;
    existingProduct.detail = updatedProductData.detail;
    existingProduct.price = updatedProductData.price;
    existingProduct.priceSale = updatedProductData.priceSale;
    existingProduct.promotion = updatedProductData.promotion;
    existingProduct.quantity = updatedProductData.quantity;
    existingProduct.category = updatedProductData.category;
    existingProduct.dateUpdate = Date.now();

    // Save the updated product
    await existingProduct.save();

    // Handle image update if needed
    if (req.body.image) {
      // check if it's a valid image format
      if (!req.body.image.startsWith("data:image/")) {
        res.send({ message: "invalidimage" });
        return;
      }

      // Extract image extension (e.g., png, jpeg, jpg)
      const imageExtension = req.body.image.match(/^data:image\/(\w+);base64,/)[1];

      // Only continue if the image extension is supported (png or jpeg)
      if (imageExtension !== 'png' && imageExtension !== 'jpeg' && imageExtension !== 'jpg') {
        res.send({ message: "unsupportedimage" });
        return;
      }

      const base64Data = req.body.image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
      const imageFileName = productId + "." + imageExtension;
      const imagePath = path.join("images/products/", imageFileName);

      // Delete the old image if it exists
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      // Save the new image
      fs.writeFileSync(imagePath, base64Data, "base64");
    }

    res.send({ message: "successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.put("/api/editqtyproduct", verifyToken, express.json(), async (req, res) => {
  try {
 
    const email = req.body.email;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.send({ message: "usernotfound" });
    }

    if (user.isAdmin !== true) {
      return res.send({ message: "notadmin" });
    }

    const productId = req.body.productId; // รหัสสินค้าที่จะแก้ไขจำนวน
    const quantityToReduce = req.body.quantityToReduce; // จำนวนใหม่ของสินค้า

    const product = await productModel.findById(productId);

    if (!product) {
      return res.send({ message: "productnotfound" });
    }

    if (quantityToReduce > product.quantity) {
      return res.send({ message: "insufficientquantity" });
    }
 
    product.quantity -= quantityToReduce;
    await product.save();

    res.send({ message: "successfully" });
  } catch (err) {
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
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/api/getuseraddress', verifyToken, async (req, res) => {
  try {
    const email = req.user.email;
    const user = await userAddressModel.findOne({ email: email });
    if (!user) {
      return res.send({ message: 'useraddressnotfound' });
    }
    res.json({ message: 'successfully', data: user });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});




const schemaUserAddress = mongoose.Schema({
  email: String,
  realname: String,
  address: String,
  district: String,
  subdistrict: String,
  province: String,
  postalcode: String,
  phone: String,
  dateUpdate: {
    type: Date,
    default: Date.now,
  },
});
const userAddressModel = mongoose.model("useraddress", schemaUserAddress);
//user setting address
app.post("/settingaddress", verifyToken, async (req, res,) => {
  //check admin from database
  try {
    const email = req.body.email;
    const user = await userModel.findOne({ email });
    if (!user) {
      res.send({ message: "usernotfound" });
      return;
    }
    const addressFind = await userAddressModel.findOne({ email });
    if (addressFind) {
      // edit address in db
      res.send({ message: "addressalreadyexists" });
      addressFind.realname = req.body.realname;
      addressFind.address = req.body.address;
      addressFind.district = req.body.district;
      addressFind.province = req.body.province;
      addressFind.subdistrict = req.body.subdistrict;
      addressFind.postalcode = req.body.postalcode;
      addressFind.phone = req.body.phone;
      addressFind.dateUpdate = Date.now();
      await addressFind.save();
      return;
    } else {
      const userAddress = await userAddressModel.create({
        email: email,
        realname: req.body.realname,
        address: req.body.address,
        district: req.body.district,
        province: req.body.province,
        subdistrict: req.body.subdistrict,
        postalcode: req.body.postalcode,
        phone: req.body.phone,
      });
      res.send({ message: "successfully" });

    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

const schemaUserOrder = mongoose.Schema({
  email: String,
  realname: String,
  address: String,
  district: String,
  subdistrict: String,
  province: String,
  postalcode: String,
  phone: String,
  product: Array,
  total: Number,
  shippingcost: Number,
  totalwithshipping: Number,
  tracking: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "notpaid",
  },
  dateUpdate: {
    type: Date,
    default: Date.now,
  },
});
const userOrderModel = mongoose.model("userorders", schemaUserOrder);
app.post("/order", verifyToken, async (req, res,) => {
 
  try {
    const email = req.body.email;
    const user = await userModel.findOne({ email });
    if (!user) {
      res.send({ message: "usernotfound" });
      return;
    }
    const userOrder = await userOrderModel.create({
      email: email,
      realname: req.body.realname,
      address: req.body.address,
      district: req.body.district,
      province: req.body.province,
      subdistrict: req.body.subdistrict,
      postalcode: req.body.postalcode,
      phone: req.body.phone,
      product: req.body.product,
      total: req.body.total,
      shippingcost: req.body.shippingCost,
      totalwithshipping: req.body.totalWithShipping,
    });
    res.send({ message: "successfully" });

    const adminEmails = "admin@gmail.com";
    const userEmail = email;
  const orderLink = `https://url.com/adminorder`;
    transporter.sendMail({
      from: '"'+shopName+'" <'+shopEmail+'>',// sender address
      to: adminEmails, // list of receivers
      subject: shopName + " มีออเดอร์เข้ามาเพิ่ม ✔", // Subject line
      text: `มีออเดอร์เข้ามาใหม่ที่ต้องตรวจสอบ\nรหัสออเดอร์: ${userOrder._id}\n${orderLink}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #333;">มีออเดอร์เข้ามาใหม่ที่ต้องตรวจสอบ</h2>
          <p>รหัสออเดอร์: <strong>${userOrder._id}</strong></p>
          <p>ชื่อผู้สั่ง: <strong>${userOrder.realname}</strong></p>
          <p>อีเมล: <strong>${userOrder.email}</strong></p>
          <p>เบอร์โทร: <strong>${userOrder.phone}</strong></p>
          <p>ที่อยู่: <strong>${userOrder.address} ${userOrder.subdistrict} ${userOrder.district} ${userOrder.province} ${userOrder.postalcode}</strong></p>
          <p>ราคาของออเดอร์: <strong>${userOrder.total}</strong></p>
          <p>คลิกที่ลิงก์ด้านล่างเพื่อดูรายละเอียดออเดอร์:</p>
          <a href="${orderLink}" style="display: inline-block; margin-top: 10px; background-color: #333; color: white; padding: 10px 20px; text-decoration: none;">ดูรายละเอียด</a>
        </div>
      `,// html body
    }).then(info => {
      console.log({info});
    }).catch(console.error);
    transporter.sendMail({
      from: '"'+shopName+'" <'+shopEmail+'>',// sender address
      to: userEmail, // list of receivers
      subject: shopName, // Subject line
      text: `คุณได้สั่งซื้อสินค้า \nรหัสออเดอร์: ${userOrder._id}\n
      \n ชื่อผู้สั่ง: ${userOrder.realname}
      \n อีเมล: ${userOrder.email}
      \n เบอร์โทร: ${userOrder.phone}
      \n ที่อยู่: ${userOrder.address} ${userOrder.subdistrict} ${userOrder.district} ${userOrder.province} ${userOrder.postalcode}
      \n วันที่สั่งซื้อ: ${userOrder.dateUpdate}
      \n ค่าขนส่ง: ${userOrder.shippingcost}
      \n ราคารวม: ${userOrder.totalwithshipping}
      \n\n กรุณาชำระเงินภายใน 24 ชม. นับจากเวลาที่สั่งซื้อ
      \n ขอบคุณที่ใช้บริการ ${shopName} 🦉`
    }).then(info => {
      console.log({info});
    }).catch(console.error);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

//get user order
app.post("/api/getuserorder", verifyToken, async (req, res) => {
 
  const email = req.body.email;
  try {
    const data = await userOrderModel.find({ email: email });
    res.json({ data: data, message: "successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});


// Function to update order status to "cancel" if needed
const updateOrderStatus = async () => {
  try {
    console.log("Updating order statuses");
    const orders = await userOrderModel.find({ status: "notpaid" });

    orders.forEach(async (order) => {
      const currentTime = new Date();
      const orderDate = order.dateUpdate;
      const timeDifferenceInMs = currentTime - orderDate;
      const timeDifferenceInHours = Math.floor(timeDifferenceInMs / (1000 * 60 * 60));

      if (timeDifferenceInHours > 24) {
        console.log("Updating order "+ order._id +" status to cancel");
        await userOrderModel.updateOne({ _id: order._id }, { status: "cancel" });

     try { 
     transporter.sendMail({
      from: '"'+shopName+'" <'+shopEmail+'>',
      to: order.email, // list of receivers
      subject: shopName, // Subject line
      text: `คำสั่งซื้อของคุณได้ถูกยกเลิกแล้ว \nรหัสออเดอร์: ${order._id}\n
      \n ชื่อผู้สั่ง: ${order.realname}
      \n อีเมล: ${order.email}
      \n เบอร์โทร: ${order.phone}
      \n ที่อยู่: ${order.address} ${order.subdistrict} ${order.district} ${order.province} ${order.postalcode}
      \n วันที่สั่งซื้อ: ${order.dateUpdate}
      \n ค่าขนส่ง: ${order.shippingcost}
      \n ราคารวม: ${order.totalwithshipping}
      \n\n คุณไม่ได้ชำระเงินภายใน 24 ชม. นับจากเวลาที่สั่งซื้อ
      \n ขอบคุณที่ใช้บริการ ${shopName} 🦉`
    }).then(info => {
      console.log({info});
    }).catch(console.error);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
 
      }
    });

    console.log("Order statuses updated successfully");
  } catch (error) {
    console.error("An error occurred while updating order statuses", error);
  }
};

setInterval(updateOrderStatus, 1800000); // 3600000 milliseconds = 1 hour


const httpsServer = https.createServer(https_options, app);

httpsServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});