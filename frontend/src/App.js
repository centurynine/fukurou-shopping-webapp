import "./App.css";
import Header from "./components/Header";
import { Outlet } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { addProduct } from "./redux/productSlice";
import { useDispatch, useSelector } from "react-redux";
import Footer from "./components/Footer";

function App() {
  const dispatch = useDispatch()
 
  useEffect(() => 
 
    {  
      document.head.querySelector('title').textContent = 'Fukurou Tomo';
      
      toast.loading("กำลังโหลดสินค้า...");
      ( async ()=>{

        const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/getproduct`)
        const resData = await res.json()
        dispatch(addProduct(resData))
        toast.dismiss()
        toast.success("โหลดสินค้าสำเร็จ")
      })()
    }, [])
  return (
    <>
    <title>Fukurou Tomo</title>
    <Toaster />
      <div className="">
        <Header />
        <main className="pt-16 bg-ivory min-h-[calc(100vh)]">
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
}

export default App;
