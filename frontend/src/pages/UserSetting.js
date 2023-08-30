import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
function UserSetting() {
  const navigate = useNavigate();
  const email = sessionStorage.getItem("userEmail");

 
  useEffect(() => {
 
      document.title = 'Fukurou Tomo - Address Setting';
  
    if (!email || email === "undefined" || email === "null") {
      navigate("/login");
      toast.error("กรุณาเข้าสู่ระบบ");
    } else {
 
      fetchUserAddress();
    }
  }, []);


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
      
        toast.success("เรียกข้อมูลที่อยู่สำเร็จ");
        setData(fetchRes.data); // อัพเดตข้อมูลใน state
      } else if (fetchRes.message === "useraddressnotfound") {
     
        toast.error("ไม่พบข้อมูล กรุณาบันทึกที่อยู่ใหม่");
      }else {
  
        toast.error("เกิดข้อผิดพลาด");
      }
    } catch (error) {
     
      toast.error("เกิดข้อผิดพลาดในการเรียก API");
    }
  };

  
  const handleOnChange = (e) => {
    const updatedData = { ...data, [e.target.id]: e.target.value };
    setData(updatedData);
    
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
   toast.loading("กำลังโหลด...");
    const { email,realname,phone,address ,province,district, subdistrict ,postalcode} = data;
    if ( !email ) {
      toast.error("กรุณาเข้าสู่ระบบ");
      return;
    }
    if (!realname || !phone || !address ||  !province || !district || !subdistrict || !postalcode) {
  
      toast.error("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
 
    const fectData = await fetch(
      `${process.env.REACT_APP_SERVER_DOMAIN}/settingaddress`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": sessionStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      }
    );
     
    const fetchRes = await fectData.json();
     
    toast.remove();
    if (fetchRes.message === "successfully") {
    
      
      toast.success("บันทึกที่อยู่สำเร็จ");
  
 
    } else if (fetchRes.message === "addressalreadyexists") {
    
      toast.success("อัพเดทที่อยู่สำเร็จ");
    }
    else {
     
      toast.error("เกิดข้อผิดพลาด");
    }
     
  };
  return (
    <div className="p-4">
      <div className="flex justify-center items-center w-2/6 m-auto h-20 bg-indigo-300 rounded-md">
        <h1 className="text-3xl font-semibold text-white">เปลี่ยนที่อยู่</h1>
      </div>
      <div className="py-5"></div>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto shadow-md bg-white p-4 rounded-lg"
      >
        <div className="mb-4">
          <label
            htmlFor="realname"
            className="block text-xl font-medium text-gray-700"
          >
            ชื่อ*
          </label>
          <input
            type="text"
            id="realname"
            name="realname"
            value={data.realname}
            onChange={handleOnChange}
            className="h-10 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            placeholder="ชื่อ - นามสกุล"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="phone"
            className="block text-lg font-medium text-gray-700 mb-1"
          >
            เบอร์โทรศัพท์*
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={data.phone}
            onChange={handleOnChange}
            className="h-10 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            placeholder="เบอร์โทรศัพท์"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-xl font-medium text-gray-700"
          >
            ที่อยู่*
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={data.address}
            onChange={handleOnChange}
            className="h-10 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            placeholder="บ้านเลขที่, หมู่, ซอย, ถนน"
            required
          />
        </div>
 
        <div className="mb-4">
          <label
            htmlFor="province"
            className="block text-xl font-medium text-gray-700"
          >
            จังหวัด*
          </label>
          <input
            type="text"
            id="province"
            name="province"
            value={data.province}
            onChange={handleOnChange}
            className="h-10 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            placeholder="จังหวัด"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="district"
            className="block text-xl font-medium text-gray-700"
          >
            อำเภอ*
          </label>
          <input
            type="text"
            id="district"
            name="district"
            value={data.district}
            onChange={handleOnChange}
            className="h-10 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            placeholder="อำเภอ"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="subdistrict"
            className="block text-xl font-medium text-gray-700"
          >
            ตำบล*
          </label>
          <input
            type="text"
            id="subdistrict"
            name="subdistrict"
            value={data.subdistrict}
            onChange={handleOnChange}
            className="h-10 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            placeholder="ตำบล"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="postalcode"
            className="block text-xl font-medium text-gray-700"
          >
            รหัสไปรษณีย์*
          </label>
          <input
            type="text"
            id="postalcode"
            name="postalcode"
            value={data.postalcode}
            onChange={handleOnChange}
            className="h-10 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            placeholder="รหัสไปรษณีย์"
            required
          />
        </div>
        {/* ... */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserSetting;
