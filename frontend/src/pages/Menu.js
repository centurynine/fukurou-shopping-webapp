import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsCartPlusFill } from "react-icons/bs";
import FilterProduct from "../components/FilterProduct";
import AllProduct from "../components/AllProduct";
import { useDispatch } from 'react-redux';
import { addCartItem } from '../redux/productSlice';

function Menu() {
  const dispatch = useDispatch();
  const { filterBy } = useParams();
  const productData = useSelector((state) => state.product.productList);
useEffect(() => {
    document.title = 'Fukurou Tomo - Product';
  }, []);
  const productDisplay = productData.filter((item) => item._id === filterBy)[0];
  if (!productDisplay) {
    return null;
  }
  
  const handleAddToCartProduct = (e) => {
 
    dispatch(addCartItem({
      _id : productDisplay._id,
      name : productDisplay.name,
      price : productDisplay.price,
      category : productDisplay.category,
      quantity : productDisplay.quantity,
      priceSale : productDisplay.priceSale

    }))
  }
  const imageUrl = `${process.env.REACT_APP_SERVER_DOMAIN}/images/products/${productDisplay._id}.png`;
  return (
    <div className="py-8">
      <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto bg-white rounded-lg flex flex-col md:flex-row shadow-md">
        <div className="md:w-1/2 mb-4 md:mb-0">
          <img
            src={imageUrl}
            className="w-full h-auto object-cover rounded-md hover:scale-105 transition duration-600"
            alt="Product Image"
          />
        </div>
        <div className="md:w-1/2 p-6">
          <h3 className="text-xl font-semibold text-slate-600 mb-2">
            {productDisplay.name}
          </h3>
          <p className="text-slate-600 mb-2">{productDisplay.detail}</p>
          <p className="text-slate-400 mb-2">{productDisplay.category}</p>
          {
            productDisplay.promotion === true ? 
            <p className="text-slate-600 mb-4">
            <span className="line-through mr-1">{productDisplay.price}</span>
            <span className="text-2xl text-red-500 mr-1">
              {productDisplay.priceSale}
            </span>
             <span className="text-slate-900">฿</span>
          </p> :
          <p className="text-slate-600 mb-4">
            <span className="text-2xl text-slate-600 mr-1">
              {productDisplay.price}
            </span>
            <span className="text-slate-900">฿</span>
          </p>
          

          }
           
          <div className="flex items-center justify-center md:justify-start">
            <div onClick={handleAddToCartProduct} className="btn-color-peach rounded-md flex items-center justify-center cursor-pointer p-3">
              <BsCartPlusFill />
            </div>
            <div className="ml-4 text-sm text-slate-600">
              สินค้าคงเหลือ {productDisplay.quantity}
            </div>
          </div>
        </div>
      </div>
       <AllProduct />
    </div>
  );
}

export default Menu;
