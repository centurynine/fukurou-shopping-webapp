import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import FilterProduct from './FilterProduct';
import HomeCard from './HomeCard';
import { BiCategoryAlt } from "react-icons/bi";

function AllProduct() {
  const productData = useSelector((state) => state.product.productList);
  const categoryList = [...new Set(productData.map((item) => item.category))];
 
  const [filterBy, setFilterBy] = useState("");
  const [dataFilter, setDataFilter] = useState([]);

  useEffect(() => {
    setDataFilter(productData);
  }, [productData]);

  const handlerFilterProduct = (category) => {
    const filter = productData.filter((item) => item.category === category);
    setDataFilter(() => {
      return [...filter]; 
    });
  };
  const showAllProducts = () => {
    setDataFilter(productData);
  };
  return (
    <div className="my-10">
    <div className="flex gap-4 justify-center overflow-scroll scrollbar-none cursor-pointer  ">
      <div className="p-1">
        <div
          onClick={showAllProducts}
          className="text-2xl p-3 bg-white rounded-3xl items-center shadow-md"
        >
          <div className="flex flex-row jus items-center">
            <p>สินค้าทั้งหมด</p>
            <div className="text-3xl ml-2">
              <BiCategoryAlt />
            </div>
          </div>
        </div>
      </div>
      {categoryList[0] &&
        categoryList.map((item) => {
          return (
            <FilterProduct
              key={item}
              category={item}
              onClick={() => handlerFilterProduct(item)}
            />
          );
        })}
    </div>
        
    <div className=" flex flex-wrap p-16 gap-16 transition-all justify-center"  >
      {dataFilter.map((item) => {
        return (
          <HomeCard
            key={item._id}
            name={item.name}
            price={item.price}
            category={item.category}
            quantity={item.quantity}
            _id={item._id}
          />
        );
      })}
    </div>
  </div>
  )
}

export default AllProduct