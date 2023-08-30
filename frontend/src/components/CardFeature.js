import React, { useState } from "react";
import { BsCartPlusFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import "../css/signupcss.css";
import { addCartItem } from "../redux/productSlice";

function CardFeature({
  name,
  price,
  image,
  category,
  quantity,
  _id,
  priceSale,
  promotion,
}) {
  const isAdmin = sessionStorage.getItem("isAdmin");
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleAddToCartProduct = (e) => {
    dispatch(
      addCartItem({
        _id: _id,
        name: name,
        price: price,
        category: category,
        quantity: quantity,
        priceSale: priceSale,
        promotion: promotion,
      })
    );
  };

  const imageUrl = `https://backend.fukuroutomo.com:8080/images/products/${_id}.png`;

  return (
    <div
      className={`bg-white p-2 shadow-md rounded-xl transition duration-300 transform ${
        isHovered ? "-translate-y-2 cursor-pointer" : "hover:shadow-lg"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute top-0 -left-2 bg-red-500 text-white font-bold rounded-tl-md rounded-br-md rounded-tr-md rounded-bl-md p-1">
        ลดราคา
      </div>
      <Link to={`/menu/${_id}`} />

      {name && (
        <>
          <Link
            to={`/menu/${_id}`}
            onClick={() => window.scrollTo({ top: "0", behavior: "smooth" })}
          >
            <div className="w-60 h-60 mx-auto">
              <img
                src={imageUrl}
                className="w-full h-full object-cover rounded-md"
                alt={name}
              />
            </div>
          </Link>
          <div className="flex flex-col justify-center items-center">
            <h3 className="text-slate-600 text-center font-semibold line-clamp-2">
              {name}
            </h3>
            <p className="text-center text-slate-400">{category}</p>
            {promotion === true ? (
              <p className="text-slate-600 mb-4">
                <span className="line-through mr-1">{price}</span>
                <span className="text-2xl text-red-500 mr-1">{priceSale}</span>
                <span className="text-slate-900">฿</span>
              </p>
            ) : (
              <p className="text-slate-600 mb-4">
                <span className="text-2xl text-slate-600 mr-1">{price}</span>
                <span className="text-slate-900">฿</span>
              </p>
            )}
            <div className="flex flex-row"> 
            <div
              onClick={handleAddToCartProduct}
              className="btn-color-peach w-10 h-10 rounded-md flex items-center justify-center cursor-pointer mt-2"
            >
              <BsCartPlusFill />
            </div>
            {isAdmin === "true" && (
              <Link
                to={`/editproduct/${_id}`} // ต้องแก้ไขเส้นทางให้ตรงกับเส้นทางของหน้าแก้ไขสินค้า
                className="btn-color-peach w-10 h-10 rounded-md flex items-center justify-center cursor-pointer mt-2 ml-2"
                _id={_id}
                name={name}
                price={price}
                priceSale={priceSale}
                category={category}
                quantity={quantity}
                promotion={promotion}
              >
                Edit
              </Link>
            )}
            </div>
            <div className="text-slate-600 text-sm text-center mt-1">
              สินค้าคงเหลือ {quantity}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CardFeature;
