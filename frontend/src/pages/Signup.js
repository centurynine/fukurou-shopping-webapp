import React, { useEffect, useState } from "react";
import loginImage from "../assets/login.gif";
import "../css/signupcss.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function Signup() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
    confirmpassword: "",
  });
  const handleOnChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    document.title = 'Fukurou Tomo - SignUp';
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) {

      return;
    }
    try {
    const { email, password, confirmpassword } = data;
    if (email && password && confirmpassword) {
      if (password.length >= 8 && confirmpassword.length >= 8) {
        if (password === confirmpassword) {
          const fetchData = await fetch(
            `${process.env.REACT_APP_SERVER_DOMAIN}/signup`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );
          const dataRes = await fetchData.json();
     
          

          if (dataRes.message === "successfully") {
            toast.success("ลงทะเบียนสำเร็จ");
            navigate("/login");
          } else if (dataRes.message === "emailalreadyexists") {
            toast.error("อีเมลนี้มีผู้ใช้งานแล้ว");
          } else if (dataRes.message === "inputrequried") {
            toast.error("กรุณากรอกข้อมูลให้ครบ");
          } else {
            toast.error("เกิดข้อผิดพลาด");
          }

          //  navigate("/login");
        } else {
          toast.error("รหัสผ่านไม่ตรงกัน");
        }
      } else {
        toast.error("กรุณากรอกรหัสผ่านให้มากกว่า 8 ตัวอักษร");
      }
    } else {
      toast.error("กรุณากรอกข้อมูลให้ครบ");
    }
  } catch (error) {
 
    toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
  } finally {
    setIsSubmitting(false); // สิ้นสุดกระบวนการส่งคำขอ
  }
 
  };

  return (
    <div className="p-3 md:p-4">
      <div className="w-full max-w-sm bg-white m-auto flex flex-col p-4 rounded-3xl">
        <h1 className="text-center text-2xl">ลงทะเบียน</h1>
        <div className="py-2"></div>
        <div className="w-20 overflow-hidden rounded-full drop-shadow-md shadow-md flex mx-auto">
          <img src={loginImage} className="w-full" />
        </div>
        <div className="py-2"></div>
        <form className="w-full py-3 flex flex-col" onSubmit={handleSubmit}>
          {/* email */}
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={data.email}
            onChange={handleOnChange}
            className="w-full border-2 border-gray-400 p-2 rounded-md my-2 focus:outline-none focus:border-peach"
            placeholder="อีเมมล์"
            required
          />
          {/* password */}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={data.password}
            onChange={handleOnChange}
            className="w-full border-2 border-gray-400 p-2 rounded-md my-2 focus:outline-none focus:border-peach"
            placeholder="รหัสผ่าน"
            required
          />
          {/* confirm password */}
          <label htmlFor="confirmpassword">Confirm Password</label>
          <input
            type="password"
            id="confirmpassword"
            value={data.confirmpassword}
            onChange={handleOnChange}
            className="w-full border-2 border-gray-400 p-2 rounded-md my-2 focus:outline-none focus:border-peach"
            placeholder="ยืนยันรหัสผ่าน"
            required
          />
          {/* btn signup */}
          <div className="py-4"></div>
          <button className="w-full btn-color-peach text-white p-2 rounded-md my-2">
            ลงทะเบียน
          </button>
        </form>
        <p className="text-left text-sm">
          มีบัญชีแล้ว?{" "}
          <Link to={"/login"} className="font-color-peach">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
