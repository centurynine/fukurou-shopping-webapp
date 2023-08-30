import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import thumbail2 from "../assets/thumbail2.jpg";
import thumbail3 from "../assets/thumbail3.jpg";
import thumbail1 from "../assets/thumbail.png";
import CardFeature from "../components/CardFeature";
import HomeCard from "../components/HomeCard";
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";
import { BsFillPencilFill } from "react-icons/bs";
import FilterProduct from "../components/FilterProduct";
import { BiCategoryAlt } from "react-icons/bi";

function Home() {
  const productData = useSelector((state) => state.product.productList);
  const homeProductCartList = productData.slice(0, 50);
  const homeProductCartListPromotion = productData.filter((item) => {
    return item.promotion === true;
  });

  const slideProductRef = useRef();

  const nextProduct = () => {
    slideProductRef.current.scrollLeft += 200;
  };

  const prevProduct = () => {
    slideProductRef.current.scrollLeft -= 200;
  };

  const categoryList = [...new Set(productData.map((item) => item.category))];
  //filter data display
  const [filterBy, setFilterBy] = useState("");
  const [dataFilter, setDataFilter] = useState([]);

  useEffect(() => {
    setDataFilter(productData);
    document.title = 'Fukurou Tomo - Home';
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: false,
  };

  return (
    <div className="p-2 md:p-4">
      <div className="flex flex-col ">
        
      <div className="text-6xl justify-center items-center w-auto ">
          <Slider {...settings}>
            <div className="flex justify-center items-center">
              <img src={thumbail1} alt="Thumbnail 1" className="slick-center rounded-3xl" />
            </div>
            <div className="flex justify-center items-center">
              <img src={thumbail2} alt="Thumbnail 2" className="slick-center rounded-3xl" />
            </div>
            <div className="flex justify-center items-center">
              <img src={thumbail3} alt="Thumbnail 3" className="slick-center rounded-3xl" />
            </div>
      </Slider>
  </div>

 

        <div className="flex w-full items-center">
    
        <div className="m-4"> 
          {homeProductCartListPromotion[0] ? (
                      <div className="bg-white shadow-md rounded-full mt-4 ml-10 truncate">
                      <p className="m-3 text-2xl">สินค้าราคาโปรโมชั่น</p>
                    </div>
          ) : (
            <div></div>
          )}
</div>
          <div className="ml-auto flex gap-4">
            <button
              onClick={prevProduct}
              className="btn-color-peach text-xl p-1 rounded"
            >
              <GrPrevious />
            </button>
            <button
              onClick={nextProduct}
              className="btn-color-peach text-xl p-1 rounded"
            >
              <GrNext />
            </button>
          </div>
        </div>
  
        <div
          ref={slideProductRef}
          className="flex scrollbar-none overflow-scroll flex-row p-16 gap-16 transition-all justify-center scroll-smooth"
        >
          {homeProductCartListPromotion[0] ? (
            homeProductCartListPromotion.map((item) => {
              return (
                <CardFeature
                  key={item._id}
                  name={item.name}
                  price={item.price}
                  priceSale={item.priceSale}
                  image={item.image}
                  category={item.category}
                  quantity={item.quantity}
                  _id={item._id}
                  promotion={item.promotion}
                />
              );
            })
          ) : (
            <div></div>
          )}
        </div> 
      </div>
      <div className="  my-2">
        <div className="  flex gap-4 justify-center overflow-scroll scrollbar-none cursor-pointer  ">
          
          
        <div className="ml-20 md:ml-0"></div>
          <div className="p-1 ml-96 md:ml-0">
            <div
              onClick={showAllProducts}
              className="text-2xl p-3 bg-white rounded-3xl items-center shadow-md cursor-pointer transition duration-300 hover:bg-indigo-700 hover:text-white"
            >
              <div className="flex flex-row jus items-center">
                <p className=" text-center overflow-scroll scrollbar-none truncate">สินค้าทั้งหมด</p>
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
            
        <div className=" flex flex-wrap p-16 gap-16 transition-all justify-center">
          {dataFilter.map((item) => {
            return (
              <HomeCard
                key={item._id}
                name={item.name}
                price={item.price}
                priceSale={item.priceSale}
                image={item.image}
                category={item.category}
                quantity={item.quantity}
                _id={item._id}
                promotion={item.promotion}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;
