import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import payment from "../assets/payment.jpg";

function Order() {
  const navigate = useNavigate();
  const email = sessionStorage.getItem("userEmail");
  const [orders, setOrders] = useState([]);
  const [randomParam, setRandomParam] = useState(Math.random()); // State เก็บค่าสุ่มสำหรับการรีเรนเดอร์รูปภาพ
  const [receiptImageTimestamp, setReceiptImageTimestamp] = useState(
    Date.now()
  );
  useEffect(() => {
    fetchOrder();

    document.title = "Fukurou Tomo - Order";
    const customerEmail = sessionStorage.getItem("userEmail");
    if (
      !customerEmail ||
      customerEmail === "undefined" ||
      customerEmail === "null"
    ) {
      navigate("/login");
      toast.error("กรุณาเข้าสู่ระบบ");
    } else {
    }
  }, [navigate]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_DOMAIN}/api/getuserorder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": sessionStorage.getItem("token"),
          },
          body: JSON.stringify({ email: email }),
        }
      );

      const data = await response.json();

      if (data.message === "successfully") {
        setOrders(data.data);
      } else {
      }
    } catch (error) {}
  };

  // Function to handle file upload
  // Inside the handleFileUpload function
  const handleFileUpload = async (orderId, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("orderId", orderId);

      const response = await fetch(
        `${process.env.REACT_APP_SERVER_DOMAIN}/api/uploadreceipt`,
        {
          method: "POST",
          headers: {
            "x-access-token": sessionStorage.getItem("token"),
          },
          body: formData,
        }
      );

      const data = await response.json();
      try {
        await fetch(
          `${process.env.REACT_APP_SERVER_DOMAIN}/api/updateorderstatus`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": sessionStorage.getItem("token"),
            },
            body: JSON.stringify({
              orderId: orderId,
              newStatus: "waitingforcheck",
            }),
          }
        );
        if (response.ok) {
          const updatedOrders = orders.map((order) =>
            order._id === orderId
              ? { ...order, status: "waitingforcheck" }
              : order
          );
          setOrders(updatedOrders);
        } else {
        }
      } catch (error) {}
    } catch (error) {}
    setReceiptImageTimestamp(Date.now());
  };

  const handleCancelProduct = async (email, orderId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_DOMAIN}/api/cancelproduct`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": sessionStorage.getItem("token"),
          },
          body: JSON.stringify({ email, orderId }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        window.location.reload();
      } else {
      }
    } catch (error) {}
  };
  const handlePrintReceipt = (order) => {
    const { customerEmail, total, shippingCost, product, totalWithShipping } =
      order;

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
      `<span>อีเมลสั่งซื้อ:</span><span>${order.email}</span>`
    );
    printWindow.document.write("</div>");
    printWindow.document.write('<div class="item">');
    printWindow.document.write(
      `<span>ยอดรวมสินค้า:</span><span>${order.total} บาท</span>`
    );
    printWindow.document.write("</div>");
    printWindow.document.write('<div class="item">');
    printWindow.document.write(
      `<span>ค่าจัดส่ง:</span><span>${order.shippingcost} บาท</span>`
    );
    printWindow.document.write("</div>");
    printWindow.document.write('<div class="item">');
    printWindow.document.write(
      `<span>ที่อยู่จัดส่ง: ${order.realname} ${order.phone}${" "}
      ${order.address} จ.${order.subdistrict} อ.${order.district} ต.
      ${order.province} ${order.postalcode}</span>`
    );
    printWindow.document.write("</div>");
    printWindow.document.write('<div class="item">');
    printWindow.document.write("<span>รายการสินค้าที่สั่ง:</span>");
    printWindow.document.write("</div>");
    printWindow.document.write('<ul class="product-list">');
    product.forEach((productItem) => {
      if (productItem.promotion === true) {
        printWindow.document.write(
          `<li class="product-item">- ${productItem.name} (จำนวน: ${productItem.qty}, ราคา: ${productItem.priceSale})</li>`
        );
      } else {
        printWindow.document.write(
          `<li class="product-item">- ${productItem.name} (จำนวน: ${productItem.qty}, ราคา: ${productItem.price})</li>`
        );
      }
    });
    printWindow.document.write("</ul>");
    printWindow.document.write("</div>");
    printWindow.document.write('<div class="receipt-total">');
    printWindow.document.write(
      `<span>ยอดรวมทั้งหมด:</span><span>${order.totalwithshipping} บาท</span>`
    );
    printWindow.document.write("</div>");
    printWindow.document.write("</div>");
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <div className="flex flex-col items-center p-4 ">
        <>
          <img
            src={payment}
            alt="Logo"
            className="h-96 rounded-3xl object-cover hover:scale-150 mt-2 hover:mt-32 hover:mb-32 transition duration-300 transform"
          />
          <div className="flex flex-col items-center p-4 ">
            <h1 className="text-2xl font-semibold text-gray-700 ">
              คำสั่งซื้อของฉัน
            </h1>
          </div>
        </>
        {orders
          .sort((a, b) => new Date(b.dateUpdate) - new Date(a.dateUpdate))
          .map((order, index) => (
            <div className="flex flex-col ml-20" key={index}>
              <div
                className="mt-6 rounded-xl pt-6 bg-white ml-40 mr-40 p-3 w-auto"
                key={order.productid}
              >
                <div className="flex items-center space-x-4 ">
                  <div className="flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-xl  text-gray-700">
                      รหัสคำสั่งซื้อ: {order._id}
                    </p>
                    <p className="text-base text-gray-500">
                      วันเวลาที่สั่ง:{" "}
                      {new Date(order.dateUpdate).toLocaleString()}
                    </p>
                    {order.status === "notpaid" ? (
                      <p className="text-base text-gray-500">
                        สถานะคำสั่งซื้อ:{" "}
                        <span className="text-red-500">รอการชำระเงิน</span>
                      </p>
                    ) : (
                      <></>
                    )}

                    {order.status === "waitingforcheck" ? (
                      <p className="text-base text-gray-500">
                        สถานะคำสั่งซื้อ:{" "}
                        <span className="text-orange-500">รอตรวจสอบ</span>
                      </p>
                    ) : (
                      <></>
                    )}
                    {order.status === "shipped" ? (
                      <p className="text-base text-gray-500">
                        สถานะคำสั่งซื้อ:{" "}
                        <span className="text-green-500">จัดส่งแล้ว</span>
                      </p>
                    ) : (
                      <></>
                    )}

                    {order.status === "cancel" ? (
                      <p className="text-base text-gray-500">
                        สถานะคำสั่งซื้อ:{" "}
                        <span className="text-red-500">ยกเลิกคำสั่งซื้อ</span>
                      </p>
                    ) : (
                      <></>
                    )}
                    <p className="text-base text-gray-500">
                      หมายเลขพัสดุ:{" "}
                      <span className="text-base text-green-500">
                        {order.tracking}
                      </span>
                    </p>
                    <p className="text-base text-gray-500">
                      ชื่อผู้สั่ง: {order.realname}
                    </p>
                    <p className="text-base text-gray-500 ">
                      ที่อยู่จัดส่ง: {order.realname} {order.phone}{" "}
                      {order.address} จ.{order.subdistrict} อ.{order.district}{" "}
                      ต.
                      {order.province} {order.postalcode}
                    </p>
                    <div className="mt-4"></div>
                    <ul className="mt-4 space-y-2">
                      {order.product.map((product, index) => (
                        <li className="flex items-center space-x-4" key={index}>
                          <Link to={`/menu/${product.productid}`}>
                            <img
                              src={`https://backend.fukuroutomo.com:8080/images/products/${product.productid}.png`}
                              alt="Logo"
                              className="h-20 w-20 rounded-full object-cover"
                            />
                          </Link>
                          <div>
                            <p className="text-base font-semibold text-gray-800">
                              สินค้า: {product.name}
                            </p>
                            <p className="text-base text-gray-500">
                              จำนวน: {product.qty}
                            </p>
                            {product.promotion === true ? (
                              <p className="text-base text-gray-500 ">
                                ราคา: ฿{product.priceSale}
                              </p>
                            ) : (
                              <p className="text-base text-gray-500 ">
                                ราคา: ฿{product.price}
                              </p>
                            )}

                            <div className=""></div>
                          </div>
                        </li>
                      ))}
                      <div className="py-1"></div>
                      <p className="text-base text-gray-500 ">
                        ค่าขนส่ง: ฿{order.shippingcost}
                      </p>
                      <p className="text-xl text-gray-500 ">
                        ราคาสุทธิ: ฿{order.totalwithshipping}
                      </p>
                      <p className="text-md text-gray-500 ">
                        อัพโหลดใบเสร็จโอนเงิน
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload(order._id, e.target.files[0])
                        }
                        className="
    border rounded p-2 cursor-pointer bg-gray-100 text-gray-800
    hover:bg-gray-200 focus:outline-none focus:ring focus:ring-blue-300
    shadow-sm"
                      />

                      <div className="mt-4 w-60">
                        <img
                          src={`https://backend.fukuroutomo.com:8080/images/receipts/${order._id}.png?timestamp=${receiptImageTimestamp}`}
                          alt="ใบเสร็จ"
                          className="max-w-full"
                          headers={{
                            "x-access-token": sessionStorage.getItem("token"),
                            orderId: order._id,
                          }}
                        />
                      </div>

                      {order.status !== "cancel" && (
                        <>
                          <button
                            className=" btn-color-peach text-white p-2 rounded-md my-2"
                            onClick={() => handlePrintReceipt(order)}
                          >
                            พิมพ์ใบเสร็จ
                          </button>
                        </>
                      )}

                      {order.status === "notpaid" ? (
                        <>
                          <p className="text-base text-gray-500 ">
                            กรุณาชำระเงินภายใน 24 ชั่วโมง
                          </p>

                          <button
                            className="btn-color-peach text-white p-2 rounded-md my-2"
                            onClick={() => {
                              const email = sessionStorage.getItem("userEmail");
                              handleCancelProduct(email, order._id);
                            }}
                          >
                            ยกเลิกออเดอร์
                          </button>
                        </>
                      ) : (
                        <></>
                      )}
                      {order.status === "waitingforcheck" ? (
                        <p className="text-base text-gray-500 ">
                          กรุณารอการตรวจสอบจากทางร้าน
                        </p>
                      ) : (
                        <></>
                      )}
                      {order.status === "cancel" ? (
                        <p className="text-base text-gray-500 ">
                          คำสั่งซื้อนี้ถูกยกเลิก
                        </p>
                      ) : (
                        <></>
                      )}
                      <div className="py-1"></div>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default Order;
