import React from 'react'
import { GrFormAdd, GrFormSubtract } from 'react-icons/gr'
import { IoTrashBin } from 'react-icons/io5'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteCartItem,increaseQty,decreaseQty } from "../redux/productSlice";

function CartProduct({ name, price, image, category, quantity, _id, priceSale, qty, total, promotion }) {
  const imageUrl = `https://backend.fukuroutomo.com:8080/images/products/${_id}.png`;
  //boolean promotion to text
  if (promotion === true) {
    promotion = "true";
  } else {
    promotion = "false";
  }
  const dispatch = useDispatch()
  return (
        <div className='m-10 p-4 border rounded-md shadow-md bg-white'>
          <div className='flex items-center'>
            <div className='w-2/3 md:w-40 md:h-40 bg-gray-200 rounded-md overflow-hidden'>
              <Link to={`/menu/${_id}`}>
              <img
                src={imageUrl}
                alt='Product'
                className='w-full h-full object-cover'
              />
              </Link>
            </div>
            <div className='ml-4'>
              <h3 className='text-lg md:text-xl text-gray-800 font-semibold'>ชื่อสินค้า {name}</h3>
              <p className='text-sm md:text-base text-gray-600 mt-1'>หมวดหมู่ {category}</p>
              <p className='text-sm md:text-base text-gray-600 mt-1'>ราคาต่อชิ้น ฿{price}</p>
              {
                promotion === "true" ? (
                  <div className='flex flex-row'>
                  <p className='text-sm md:text-base text-gray-600 mt-1'>ราคาโปรโมชั่น</p>
                  <p className='pl-2 text-sm md:text-base text-red-400 mt-1'> ฿{priceSale}</p>
                  </div>
                ) : (
                  <></>
                )

              }
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center py-3'>
              <span className='text-sm md:text-base text-gray-600'>จำนวน:</span>
              <input
                type={'number'}
                className='w-10 h-8 border border-gray-300 ml-2 text-center text-sm md:text-base'
                value={qty}
                readOnly
              />
              
              <div className='p-1'></div>
                 <GrFormSubtract onClick={()=>dispatch(decreaseQty(_id))} className='cursor-pointer btn-color-peach rounded-md w-6 h-6'/>
                 <div className='p-1'></div>
                  < GrFormAdd onClick={()=>dispatch(increaseQty(_id))}  className='cursor-pointer btn-color-peach rounded-md w-6 h-6'/>
                  <div className='p-1'></div>
                  <IoTrashBin onClick={()=>dispatch(deleteCartItem(_id))}  className='cursor-pointer hover:text-red-300 w-4 h-4'/>

            </div>
            {
              promotion === "true" ? (
                <> 
                <div className='flex flex-row'> 
                          <div>
                          <span className='pl-2 text-lg md:text-xl font-semibold text-red-400'>฿{total}</span>
                        </div>
              </div>
              </>
              ) : (
                <div> 
                <span className='text-lg md:text-xl font-semibold text-gray-800'>฿{total}</span>
              </div>
              )
            }
 
           
          </div>
        </div>
      );
}

export default CartProduct