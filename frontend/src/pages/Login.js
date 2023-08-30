import React, { useEffect, useState } from "react";
import loginImage from "../assets/login.gif";
import "../css/signupcss.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { loginRedux } from "../redux/userSlice";

function Login() {
  const navigate = useNavigate();
  const email = sessionStorage.getItem("userEmail");
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const handleOnChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };
  useEffect(() => {
    document.title = 'Fukurou Tomo - Login';
    //check login
    if (email) {
      navigate("/");
    }
    
  }, []);

  const userData = useSelector(state => state);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) {

      return;
    }
    
    setIsSubmitting(true); 
    try {
    toast.loading("กำลังโหลด...");
    const { email, password} = data;
    if (email && password) {
      const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/login`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), 
      });
      const dataRes = await fetchData.json();
      toast.remove();
      if(dataRes.message === "Loginsuccessfully"){
    
        toast.success("เข้าสู่ระบบสำเร็จ");
        dispatch(loginRedux(dataRes))
        
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
   
      else if(dataRes.message === "Usernotfound"){
        toast.error("ไม่พบผู้ใช้งานหรือรหัสผ่านผิด");
      } else if(dataRes.message === "inputrequried"){
        toast.error("กรุณากรอกข้อมูลให้ครบ");
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
        <h1 className="text-center text-2xl">เข้าสู่ระบบ</h1>
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
            placeholder="อีเมลล์"
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
          {/* btn signup */}
          <div className="py-4"></div>
          <button className="w-full btn-color-peach text-white p-2 rounded-md my-2">
            เข้าสู่ระบบ
          </button>
        </form>
        <p className="text-left text-sm">
          ยังไม่มีบัญชี?{" "}
          <Link to={"/signup"} className="font-color-peach">
            ลงทะเบียน
          </Link>
        </p>
      </div>
    </div>
  );
}
 
export default Login