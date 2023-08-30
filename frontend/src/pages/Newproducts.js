import React, { useEffect, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useNavigate } from "react-router";
import { ImagetoBase64 } from "../utility/ImagetoBase64";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

function Newproducts() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: sessionStorage.getItem("userEmail"),
    name: "",
    detail: "",
    price: "",
    quantity: "",
    category: "",
    image: "",
  });

  useEffect(() => {
    if (!sessionStorage.getItem("userEmail") || sessionStorage.getItem("isAdmin") === "false") {
      navigate("/login");
    }
  }, []);

  const handleOnChange = (e) => {
    const updatedData = { ...data, [e.target.id]: e.target.value };
    setData(updatedData);
  };

  const uploadImage = async (e) => {
    const imageData = await ImagetoBase64(e.target.files[0]);

    setData((prevData) => {
      return {
        ...prevData,
        image: imageData,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, detail, price, quantity, category, image } = data;
    if (!name || !detail || !price || !quantity || !category || !image) {
      toast.error("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    toast.loading("กำลังเพิ่มสินค้า...");

    const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/addproduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": sessionStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    toast.remove();

    if (responseData.message === "successfully") {
      toast.success("เพิ่มสินค้าสำเร็จ");
      setTimeout(() => {
        setData({
          name: "",
          detail: "",
          price: "",
          quantity: "",
          category: "",
          image: "",
        });
      }, 1000);
    } else if (responseData.message === "notadmin") {
      toast.error("คุณไม่ใช่ผู้ดูแลระบบ");
    } else if (responseData.message === "usernotfound") {
      toast.error("ไม่พบผู้ใช้งาน");
    } else {
      toast.error("เพิ่มสินค้าไม่สำเร็จ");
    }
  };

  return (
    <div className="p-2">
      <form
        onSubmit={handleSubmit}
        className="m-auto max-w-md my-4 shadow-md bg-white flex flex-col p-2 rounded-xl"
      >
        <label htmlFor="name">ชื่อสินค้า</label>
        <input
          value={data.name}
          onChange={handleOnChange}
          type={"text"}
          id="name"
          name="name"
          className="border-2  p-2 rounded-md my-2 focus:outline-none focus:border-peach"
          placeholder="ใส่ชื่อสินค้า"
          required
        />
        <label htmlFor="name">รายละเอียดสินค้า</label>
        <textarea
          value={data.detail}
          onChange={handleOnChange}
          type={"text"}
          id="detail"
          name="detail"
          className="border-2  p-2 rounded-md my-2 focus:outline-none focus:border-peach"
          placeholder="รายละเอียดสินค้า"
          required
        />
        <label htmlFor="name">ราคาสินค้า</label>
        <input
          value={data.price}
          onChange={handleOnChange}
          type={"number"}
          id="price"
          name="price"
          className="border-2  p-2 rounded-md my-2 focus:outline-none focus:border-peach"
          placeholder="ราคาสินค้า"
          required
        />
        <label htmlFor="name">จำนวนสินค้า</label>
        <input
          value={data.quantity}
          onChange={handleOnChange}
          type={"number"}
          id="quantity"
          name="quantity"
          className="border-2 p-2 rounded-md my-2 focus:outline-none focus:border-peach"
          placeholder="จำนวนสินค้า"
          required
        />
        <select
          onChange={handleOnChange}
          id="category"
          name="category"
          className="border-2  p-2 rounded-md my-2 focus:outline-none focus:border-peach"
        >
          <option value="other">เลือกหมวดหมู่</option>
          <option value="เครื่องเขียน">เครื่องเขียน</option>
          <option value="ของใช้">ของใช้</option>
          <option value="ของตกแต่ง">ของตกแต่ง</option>
          <option value="ขนม">ขนม</option>
        </select>
        <label htmlFor="image" className="cursor-pointer">
          รูปสินค้า
          <div className="py-2"></div>
          <div className="h-40 w-full bg-slate-300 rounded flex items-center justify-center">
            {data.image ? (
              <>
                <img src={data.image} className="h-full "></img>
              </>
            ) : (
              <>
                <span className="text-8xl">
                  <AiOutlineCloudUpload />
                </span>
              </>
            )}

            <input
              type={"file"}
              id="image"
              onChange={uploadImage}
              accept="image/*"
              className="hidden"
            ></input>
          </div>
        </label>
        <button className="w-full btn-color-peach text-white p-2 rounded-md my-2">
          เพิ่มสินค้า
        </button>
      </form>
    </div>
  );
}

export default Newproducts;
