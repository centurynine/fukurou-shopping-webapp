import React, { useState, useEffect } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useParams } from "react-router";
import { ImagetoBase64 } from "../utility/ImagetoBase64";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";

function EditProduct() {
  let imageUrlBases64 = null;
  const { id } = useParams();
  const productData = useSelector((state) => state.product.productList);
  const [imageBase64, setImageBase64] = useState("");

  const productDisplay = productData.filter((item) => item._id === id)[0];

  const imageUrl = `${process.env.REACT_APP_SERVER_DOMAIN}/images/products/${productDisplay._id}.png`;
  // สร้างฟังก์ชันเพื่อโหลดไฟล์รูปภาพและแปลงเป็น Base64
  async function convertImageToBase64(imageUrl) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      return null;
    }
  }

  // เรียกใช้ฟังก์ชันและแปลงรูปภาพเป็น Base64

  convertImageToBase64(imageUrl).then((base64Data) => {
    if (base64Data) {
      setImageBase64(base64Data);
    } else {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
  });
  const [data, setData] = useState({
    _id : productDisplay?._id || "",
    email: sessionStorage.getItem("userEmail"),
    name: productDisplay?.name || "",
    detail: productDisplay?.detail || "",
    price: productDisplay?.price || "",
    quantity: productDisplay?.quantity || "",
    category: productDisplay?.category || "",
    image: imageUrlBases64 || "",
    promotion: productDisplay?.promotion || false,
    priceSale: productDisplay?.priceSale || 0,

  });

  useEffect(() => {
    // Update form data whenever productDisplay changes
    setData({
        _id : productDisplay?._id || "",
      email: sessionStorage.getItem("userEmail"),
      name: productDisplay?.name || "",
      detail: productDisplay?.detail || "",
      price: productDisplay?.price || "",
      quantity: productDisplay?.quantity || "",
      category: productDisplay?.category || "",
        promotion: productDisplay?.promotion || false,
        priceSale: productDisplay?.priceSale || 0,
    });
  }, [productDisplay]);

  if (!productDisplay) {
    return null;
  }

  const handleOnChange = (e) => {
    console.log(e.target.id, e.target.value);
    const updatedData = { ...data, [e.target.id]: e.target.value };
    setData(updatedData);
    console.log(updatedData);
  };

  const uploadImage = async (e) => {
    const dataImg = await ImagetoBase64(e.target.files[0]);
    setData((prev) => {
      return {
        ...prev,
        image: dataImg,
      };
    });
    setImageBase64(dataImg); // เพิ่มบรรทัดนี้เพื่ออัพเดต imageBase64
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);
    const updatedData = { ...data };

    try {
        const response = await axios.put(`${process.env.REACT_APP_SERVER_DOMAIN}/editproduct`, updatedData, {
            headers: {
              'Content-Type': 'application/json',
              "x-access-token": sessionStorage.getItem("token"),
            }
          });

      if (response.data.message === "successfully") {
        toast.success("แก้ไขสินค้าสำเร็จแล้ว");
      } else if (response.data.message === "notadmin") {
        toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      } else if (response.data.message === "productnotfound") {
        toast.error("ไม่พบสินค้า");
      }
      else if (response.data.message === "onlypng") {
        toast.error("อัพโหลดได้เฉพาะไฟล์ .png เท่านั้น");
      } else {
        toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="p-2">
      <form
        onSubmit={handleSubmit}
        className="m-auto max-w-md my-4 shadow-md bg-white flex flex-col p-2 rounded-xl"
      >
        {/* ... (รายละเอียดฟิลด์อื่น ๆ เช่นชื่อสินค้า, ราคา, จำนวน, รายละเอียด, ฯลฯ) */}
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
        {/* เพิ่ม มีโปรหรือไม่ กับ ราคาที่ลด */}
        <label htmlFor="name">โปรโมชั่น</label>
        <select
            value={data.promotion}
            onChange={handleOnChange}
            id="promotion"
            name="promotion"
            className="border-2  p-2 rounded-md my-2 focus:outline-none focus:border-peach"
        >
            <option value="false">ไม่มีโปรโมชั่น</option>
            <option value="true">มีโปรโมชั่น</option>
        </select>
        <label htmlFor="name">ราคาที่ลด</label>
        <input

            value={data.priceSale}
            onChange={handleOnChange}
            type={"number"}
            id="priceSale"
            name="priceSale"
            className="border-2  p-2 rounded-md my-2 focus:outline-none focus:border-peach"
            placeholder="ราคาที่ลด"
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
            value={data.category}
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
          Product Image
          <div className="py-2"></div>
          <div className="h-40 w-full bg-slate-300 rounded flex items-center justify-center">
            {(data.image && data.image !== imageUrlBases64) || imageBase64 ? (
              <img
                src={
                  data.image && data.image !== imageUrlBases64
                    ? data.image
                    : imageBase64
                }
                className="h-full"
                alt="Product"
              />
            ) : (
              <span className="text-8xl">
                <AiOutlineCloudUpload />
              </span>
            )}
            <input
              type="file"
              id="image"
              onChange={uploadImage}
              accept="image/*"
              className="hidden"
            ></input>
          </div>
        </label>
        <button className="w-full btn-color-peach text-white p-2 rounded-md my-2">
          Update Product
        </button>
      </form>
    </div>
  );
}

export default EditProduct;
