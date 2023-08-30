import React from "react";
import { BsFillPencilFill } from "react-icons/bs";
import { FaUtensils } from "react-icons/fa";
import { GiFlowerPot } from "react-icons/gi";
import { LuCandy } from "react-icons/lu";  

function FilterProduct({ category, onClick }) {
  return (
    <div className="p-1">
      <div
        onClick={onClick}
        className="text-2xl p-3 bg-white rounded-3xl flex items-center shadow-md cursor-pointer transition duration-300 hover:bg-indigo-700 hover:text-white"
      >
        <p className="text-center overflow-scroll scrollbar-none truncate">{category}</p>
        <div className="ml-2">
          {category === "เครื่องเขียน" ? (
            <BsFillPencilFill className="text-3xl" />
          ) : category === "ของใช้" ? (
            <FaUtensils className="text-3xl" />
          ) : category === "ของตกแต่ง" ? (
            <GiFlowerPot className="text-3xl" />
          ) : category === "ขนม" ? (
            <LuCandy className="text-3xl" />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilterProduct;
