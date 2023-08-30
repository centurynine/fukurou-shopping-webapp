import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import CartProduct from "../components/CartProduct";
import { Link, useNavigate } from "react-router-dom";
import { deleteAllProducts } from "../redux/productSlice";
function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const productCartItem = useSelector((state) => state.product.cartItem);
  const [customerEmail, setCustomerEmail] = useState("");
  const product = productCartItem.map((item) => ({
    name: item.name,
    qty: item.qty,
    price: item.price,
    priceSale: item.priceSale,
    promotion: item.promotion,
    productid: item._id,
  }));

  useEffect(() => {
 
      document.title = 'Fukurou Tomo - Cart';
 
    const customerEmail = sessionStorage.getItem("userEmail");
    if (
      !customerEmail ||
      customerEmail === "undefined" ||
      customerEmail === "null"
    ) {
      navigate("/login");
      toast.error("กรุณาเข้าสู่ระบบ");
    } else {
      setCustomerEmail(customerEmail);
      fetchUserAddress();
    }
  }, [navigate]);

  const [showReceipt, setShowReceipt] = useState(false);
  const total = productCartItem.reduce((sum, item) => sum + item.total, 0);
  let shippingCost = 35;
  if (total < 200) {
    shippingCost = 50;
  } else if (total >= 200 && total < 500) {
    shippingCost = 35;
  } else if (total >= 500) {
    shippingCost = 0;
  }

  const [data, setData] = useState({
    email: sessionStorage.getItem("userEmail"),
    realname: "",
    phone: "",
    address: "",
    province: "",
    district: "",
    subdistrict: "",
    postalcode: "",
  });

  const fetchUserAddress = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_DOMAIN}/api/getuseraddress`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": sessionStorage.getItem("token"),
          },
        }
      );
      const fetchRes = await response.json();
      if (fetchRes.message === "successfully") {
        setData(fetchRes.data); // อัพเดตข้อมูลใน state
      } else if (fetchRes.message === "useraddressnotfound") {
        toast.error("ไม่พบข้อมูลที่อยู่ กรุณาบันทึกที่อยู่ใหม่");
      } else {
        toast.error("เกิดข้อผิดพลาด");
      }
    } catch (error) {
      toast.error("กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
    }
  };

  const handlePayment = async () => {
    if (total === 0 || total === null || total < 0) {
      toast.error("ไม่พบสินค้าในตะกร้า");
      return;
    }

    if (
      data.realname === "" ||
      data.phone === "" ||
      data.address === "" ||
      data.province === "" ||
      data.district === "" ||
      data.subdistrict === "" ||
      data.postalcode === ""
    ) {
      toast.error("ไม่พบข้อมูลที่อยู่ กรุณาบันทึกที่อยู่ใหม่");
      navigate("/setting");
      return;
    }
    const addOrder = await fetch(
      `${process.env.REACT_APP_SERVER_DOMAIN}/order`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-access-token": sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          email: customerEmail,
          product,
          total,
          shippingCost,
          totalWithShipping,
          realname: data.realname,
          phone: data.phone,
          address: data.address,
          province: data.province,
          district: data.district,
          subdistrict: data.subdistrict,
          postalcode: data.postalcode,
        }),
      }
    );
    const addOrderRes = await addOrder.json();
    if (addOrderRes.message === "successfully") {
      toast.success("สั่งซื้อสินค้าแล้ว")
      setTimeout(() => {
        dispatch(deleteAllProducts())
        navigate("/order");
      }, 1000);
 
  };
  }


  const totalWithShipping = total + shippingCost;

 

  const handlePrintReceipt = (order) => {
    const { customerEmail, total, shippingCost, product, totalWithShipping } = order;

    const printWindow = window.open("", "_blank");
    printWindow.document.write("<html><head>");
    printWindow.document.write(
      '<link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap" rel="stylesheet">'
    );
    printWindow.document.write("<title>ใบเสร็จชำระเงิน</title>");
    printWindow.document.write("<style>");
    printWindow.document.write("body {");
    printWindow.document.write("font-family: kanit, sans-serif;");
    printWindow.document.write("background-color: #f5f5f5;");
    printWindow.document.write("margin: 0;");
    printWindow.document.write("padding: 0;");
    printWindow.document.write("display: flex;");
    printWindow.document.write("flex-direction: column;");
    printWindow.document.write("justify-content: center;");
    printWindow.document.write("align-items: center;");
    printWindow.document.write("min-height: 100vh;");
    printWindow.document.write("}");
    printWindow.document.write(".logo {"); // เพิ่ม
    printWindow.document.write("width: 200px;"); // เพิ่ม
    printWindow.document.write("margin-top: 10px;"); // เพิ่ม
    printWindow.document.write("}");
    printWindow.document.write(".receipt {");
    printWindow.document.write("background-color: white;");
    printWindow.document.write("border-radius: 8px;");
    printWindow.document.write("box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);");
    printWindow.document.write("width: 300px;");
    printWindow.document.write("padding: 20px;");
    printWindow.document.write("}");
    printWindow.document.write(".receipt-header {");
    printWindow.document.write("text-align: center;");
    printWindow.document.write("margin-bottom: 20px;");
    printWindow.document.write("}");
    printWindow.document.write(".receipt-details {");
    printWindow.document.write("margin-bottom: 20px;");
    printWindow.document.write("}");
    printWindow.document.write(".item {");
    printWindow.document.write("display: flex;");
    printWindow.document.write("justify-content: space-between;");
    printWindow.document.write("margin-bottom: 5px;");
    printWindow.document.write("}");
    printWindow.document.write(".receipt-total {");
    printWindow.document.write("display: flex;");
    printWindow.document.write("justify-content: space-between;");
    printWindow.document.write("border-top: 1px solid #ccc;");
    printWindow.document.write("padding-top: 10px;");
    printWindow.document.write("font-weight: bold;");
    printWindow.document.write("}");
    printWindow.document.write(".product-list {");
    printWindow.document.write("list-style: none;");
    printWindow.document.write("padding: 0;");
    printWindow.document.write("}");
    printWindow.document.write(".product-item {");
    printWindow.document.write("margin-bottom: 5px;");
    printWindow.document.write("font-size: 14px;");
    printWindow.document.write("}");
    printWindow.document.write("</style>");
    printWindow.document.write("</head><body>");
    printWindow.document.write('<div class="receipt">');
    printWindow.document.write('<div class="receipt-header">');
    printWindow.document.write(
      '<img class="logo" src="https://fukuroutomo.com/static/media/fukuroutomo.1c6ca8b3d760c432b6c2.png" alt="Logo">'
    );
    printWindow.document.write("<h2>ใบเสร็จชำระเงิน</h2>");
    printWindow.document.write("</div>");
    printWindow.document.write('<div class="receipt-details">');
    printWindow.document.write('<div class="item">');
    printWindow.document.write(
      `<span>อีเมลสั่งซื้อ:</span><span>${customerEmail}</span>`
    );
    printWindow.document.write("</div>");
    printWindow.document.write('<div class="item">');
    printWindow.document.write(
      `<span>ยอดรวมสินค้า:</span><span>${total} บาท</span>`
    );
    printWindow.document.write("</div>");
    printWindow.document.write('<div class="item">');
    printWindow.document.write(
      `<span>ค่าจัดส่ง:</span><span>${shippingCost} บาท</span>`
    );
    printWindow.document.write("</div>");
    printWindow.document.write('<div class="item">');
    printWindow.document.write("<span>รายการสินค้าที่สั่ง:</span>");
    printWindow.document.write("</div>");
    printWindow.document.write('<ul class="product-list">');
    product.forEach((productItem) => {
      printWindow.document.write(
        `<li class="product-item">- ${productItem.name} (จำนวน: ${productItem.qty}, ราคา: ${productItem.price})</li>`
      );
    });
    printWindow.document.write("</ul>");
    printWindow.document.write("</div>");
    printWindow.document.write('<div class="receipt-total">');
    printWindow.document.write(
      `<span>ยอดรวมทั้งหมด:</span><span>${totalWithShipping} บาท</span>`
    );
    printWindow.document.write("</div>");
    printWindow.document.write("</div>");
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };
  return (
    <div className="p-2 md:p-4 mx-2 sm:mx-8 md:mx-20">
      <h1 className="text-3xl font-bold text-slate-600 mb-4">ตะกร้าสินค้า</h1>
      <div className="border-t border-gray-300 mt-4 pt-4">
        {productCartItem.map((item) => (
          <CartProduct
            key={item._id}
            _id={item._id}
            name={item.name}
            price={item.price}
            category={item.category}
            quantity={item.quantity}
            priceSale={item.priceSale}
            qty={item.qty}
            total={item.total}
            promotion={item.promotion}
          />
        ))}
      </div>
      <div className="px-4 md:px-10 mt-8 text-gray-700">
        <div className="flex items-center">
          <span className="text-xl font-semibold">ยอดรวมราคาสินค้า:</span>{" "}
          <span className="ml-2 text-3xl font-bold text-color-lightblue">
            {total} บาท
          </span>
        </div>
        <div className="text-sm text-gray-500 mt-2">
          รวมค่าจัดส่ง ฿{shippingCost}
        </div>
        {data.realname === "" ||
        data.phone === "" ||
        data.address === "" ||
        data.province === "" ||
        data.district === "" ||
        data.subdistrict === "" ||
        data.postalcode === "" ? (
          <div className="mt-4">
            <Link
              to={"/setting"}
              className="btn-color-lightblue text-white py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
            >
              เพิ่มที่อยู่จัดส่ง
            </Link>
          </div>
        ) : (
          <div className="text-base text-gray-500 mt-2">
            ที่อยู่จัดส่ง : {data.realname} {data.phone} {data.address} {data.subdistrict} {data.district} {data.province} {data.postalcode}
          </div>
        )}
  
        <div className="flex items-center">
          <span className="text-xl font-semibold py-4">ยอดรวมราคาสุทธิ:</span>{" "}
          <span className="ml-2 text-3xl font-bold text-color-lightblue">
            {totalWithShipping} บาท
          </span>
        </div>
        <div className="py-4"></div>
        <Link
          className="mt-4 btn-color-lightblue text-white py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
          onClick={handlePayment}
        >
          ดำเนินการชำระเงิน
        </Link>
      <div className="py-4"></div>
      </div>
    </div>
  );
  
}

export default Cart;
