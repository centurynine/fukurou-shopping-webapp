import React, { useState, useEffect } from "react";

function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      let url = `${process.env.REACT_APP_SERVER_DOMAIN}/api/admin/orders`;

      if (filterStatus !== "all") {
        url += `/filter?status=${filterStatus}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": sessionStorage.getItem("token"),
        },
      });

      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };
  const sortByDate = (a, b) => {
    if (sortOrder === "asc") {
      return new Date(a.dateUpdate) - new Date(b.dateUpdate);
    } else {
      return new Date(b.dateUpdate) - new Date(a.dateUpdate);
    }
  };
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  const handleFilterChange = (e) => {
    const newFilterStatus = e.target.value;
    setFilterStatus(newFilterStatus);
  };
 

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_DOMAIN}/api/updateorderstatus`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": sessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            email: sessionStorage.getItem("userEmail"),
            orderId: orderId,
            newStatus: newStatus,
          }),
        }
      );
  
      const data = await response.json();
      console.log(data);
        
      if (newStatus === "shipped") {
        const updatedOrders = orders.map((order) => {
          if (order._id === orderId) {
            const updatedProducts = order.product.map((product) => {
              console.log(product);
              updateProductQuantity(product.productid, product.qty);
              return product;
            });
            return { ...order, status: newStatus, product: updatedProducts };
          }
          return order;
        });
  
        setOrders(updatedOrders);
      } else {
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };
 
  const updateProductQuantity = async (productId, quantityToReduce) => {
   
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_DOMAIN}/api/editqtyproduct`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": sessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            email: sessionStorage.getItem("userEmail"),
            productId: productId,
            quantityToReduce: quantityToReduce,
          }),
        }
      );
  
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error updating product quantity", error);
    }
  };




  const handleTrackingChange = (orderId, trackingNumber) => {
    // Update the tracking number locally in the orders state
    const updatedOrders = orders.map((order) => {
      if (order._id === orderId) {
        return { ...order, tracking: trackingNumber };
      }
      return order;
    });

    setOrders(updatedOrders);
  };

  const updateOrderTracking = async (orderId, tracking) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_DOMAIN}/api/updateordertracking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": sessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            orderId: orderId,
            tracking: tracking,
          }),
        }
      );

      const data = await response.json();
      console.log(data);

      fetchOrders();
    } catch (error) {
      console.error("Error updating tracking number", error);
    }
  };
 
 return (
<div className="bg-gray-100 min-h-screen">
<div className="flex justify-center mt-4">
  <select
    value={filterStatus}
    onChange={handleFilterChange}
    className="px-4 py-2 border rounded-md"
  >
    <option value="all">ทั้งหมด</option>
    <option value="notpaid">ยังไม่จ่ายเงิน</option>
    <option value="waitingforcheck">รอการตรวจสอบจากทางร้าน</option>
    <option value="shipped">จัดส่งสินค้าแล้ว</option>
  </select>
</div>
<div className="container mx-auto p-6">
  <div className="flex justify-end">
    <button
      onClick={toggleSortOrder}
      className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
    >
      เรียงลำดับ: {sortOrder === "asc" ? "ใหม่ไปเก่า" : "เก่าไปใหม่"}
    </button>
  </div>
  <ul className="mt-4 space-y-4   flex flex-col md:flex-col">
    {orders.sort(sortByDate).map((order) => (
      <li
        key={order._id}
        className="bg-white p-4 rounded shadow-sm flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 items-center justify-between"
      >
              <div>
                <p className="text-lg font-semibold">Order ID: {order._id}</p>
                <p>สถานะ: {order.status}</p>
                <p>อีเมลล์: {order.email}</p>
                <p>ชื่อ: {order.realname}</p>
                <p>ที่อยู่: {order.address}</p>
                <p>จังหวัด: {order.province}</p>
                <p>อำเภอ: {order.district}</p>
                <p>ตำบล: {order.subdistrict}</p>
                <p>รหัสไปรษณีย์: {order.postalcode}</p>
                <p>เบอร์: {order.phone}</p>
                <p>วันที่สั่ง: {order.dateUpdate}</p>
                <p>สินค้า:</p>
                <ul>
                  {order.product.map((product) => (
                    <li key={product._id}>
                      <p>{product.name}</p>
                      <p>จำนวน: {product.qty}</p>
                      <p>ราคา: {product.price}</p>
                      <p>---------------------------------</p>
                    </li>
                  ))}
                </ul>
                <p>ค่าส่ง: {order.shippingcost}</p>
                <p>ราคารวมทั้งหมด: {order.total}</p>
              </div>
              {
                order.status !== "notpaid" && (
               
                    <div className="mt-4 w-80">{order.status !== "cancel" && (
                      
                                        <img src={`https://backend.fukuroutomo.com:8080/images/receipts/${order._id}.png` } alt={`ใบเสร็จ ${order._id}`} />
                    )
                    }

                    </div>
                )

              }
              <div className="flex flex-col space-x-2">
                <> <div className="flex-row p-4 space-x-2"> 
                {order.status !== "cancel" && (
                  <button
                    onClick={() => updateOrderStatus(order._id, "cancel")}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    ยกเลิกออเดอร์
                  </button>
                )}
                {order.status !== "notpaid" && (
                  <button
                    onClick={() => updateOrderStatus(order._id, "notpaid")}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    ยังไม่จ่ายเงิน
                  </button>
                )}
                {order.status !== "waitingforcheck" && (
                  <button
                    onClick={() => updateOrderStatus(order._id, "waitingforcheck")}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    รอการตรวจสอบจากทางร้าน
                  </button>
                )}
                {order.status !== "shipped" && (
                  <button
                    onClick={() => updateOrderStatus(order._id, "shipped")}
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    จัดส่งสินค้าแล้ว
                  </button>
                )}
          </div>
 
              </>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter Tracking Number"
                  value={order.tracking || ""}
                  onChange={(e) =>
                    handleTrackingChange(order._id, e.target.value)
                  }
                  className="px-2 py-1 border rounded"
                />
                <button
                  onClick={() =>
                    updateOrderTracking(order._id, order.tracking)
                  }
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Update Tracking
                </button>
 
              </div>

              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  
}

export default AdminOrderPage;
