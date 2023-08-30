import { Link } from "react-router-dom";
import logo from "../assets/fukuroutomo.png";
import { HiOutlineUserCircle } from "react-icons/hi";
import { BiSolidCart } from "react-icons/bi";
import Login from "../pages/Login";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { string } from "prop-types";
import { logoutRedux } from "../redux/userSlice";
import { toast } from "react-hot-toast";

function Header() {
  const Email = sessionStorage.getItem("userEmail");
  const Id = sessionStorage.getItem("userId");
  const isAdmin = sessionStorage.getItem("isAdmin");

  const [showMenu, setShowMenu] = React.useState(false);
  const dispatch = useDispatch();
  const handleShowMenu = () => {
    setShowMenu((preve) => !preve);
  };
  const handleLogout = () => {
    dispatch(logoutRedux());
    sessionStorage.clear();
    toast.success("ออกจากระบบสำเร็จ");
  };
  const cartItemNumber = useSelector((state) => state.product.cartItem);

  return (
    <header className="fixed shadow-md w-full h-18 px-2 md:px-4 z-50 bg-white">
      {/* desktop */}

      <div className="flex items-center h-full justify-between">
        <Link to="">
          <div className="h-16 flex flex-row">
            <img src={logo} className="h-full" />
            {Email && Id != null && (
              <div className="py-5">ยินดีต้อนรับ, {Email}</div>
            )}
          </div>
        </Link>
        <div className="flex item-center gap-4 md:gap-7">
          <nav className="gap-4 md:gap-6 text-base md:text-lg hidden md:flex">
            <Link to={""}>หน้าแรก</Link>
            <Link to={"https://www.facebook.com/fukuroutomo/"} target="_blank">
              แฟนเพจ
            </Link>
            <Link to={"https://www.facebook.com/fukuroutomo/"} target="_blank">เกี่ยวกับ</Link>
            <Link to={"https://www.facebook.com/fukuroutomo/"} target="_blank">ติดต่อ</Link>
          </nav>
          <div className="text-3xl text-slate-600 relative  first-line:">
            <Link to={"cart"}>
              <BiSolidCart className="cursor-pointer" />
              <div className="absolute -top-1 -right-1 text-white bg-red-500 h-4 w-4 rounded-full m-0 p-0 text-sm text-center">
                {cartItemNumber.length}
              </div>
            </Link>
          </div>
          <div className="text-slate-600" onClick={handleShowMenu}>
            <div className="text-3xl text-slate-600 cursor-pointer">
              <HiOutlineUserCircle />
            </div>
            {showMenu && (
              <div className="absolute right-2 bg-white py-2 px-2 drop-shadow-md flex flex-col min-w-[120px]">
                {isAdmin === "true" && (
                  <>
                  <Link
                  to={"addproduct"}
                  className="text-base md:text-lg cursor-pointer py-2"
                >
                  เพิ่มสินค้าใหม่
                </Link>
                <Link
                    to={"adminorder"}
                    className="text-base md:text-lg cursor-pointer py-2"
                  >
                    จัดการออเดอร์
                  </Link>
                </>
                )}
                {Email && Id != null ? (
                  <></>
                ) : (
                  <Link
                    to={"login"}
                    className="text-base md:text-lg whitespace-nowrap cursor-pointer py-2"
                  >
                    เข้าสู่ระบบ
                  </Link>
                )}
                <nav className="text-base md:text-lg flex flex-col">
                  <Link to={""} className=" py-2">
                    หน้าแรก
                  </Link>
                  <Link
                    to={"https://www.facebook.com/fukuroutomo/"}
                    target="_blank"
                    className="py-2"
                  >
                    แฟนเพจ
                  </Link>
                  <Link to={"https://www.facebook.com/fukuroutomo/"} target="_blank" className="py-2">
                    ติดต่อ
                  </Link>
              
                  {Email && Id != null ? (
                    <> 
                 <Link to={"order"} className="py-2">
                  รายการสั่งซื้อ
                  </Link>
                  <Link to={"setting"} className="py-2">
                  ตั้งค่าที่อยู่
                  </Link>
                  <Link
                    to={"login"}
                    className="text-base md:text-lg whitespace-nowrap cursor-pointer py-2"
                    onClick={handleLogout}
                  >
                    ออกจากระบบ
                  </Link></>
                ) : (
                  <></>
                )}
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* mobile */}
    </header>
  );
}

export default Header;
