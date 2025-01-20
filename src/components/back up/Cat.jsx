import React, { useRef, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { getData } from "./../../api";
import AOS from "aos";
import "aos/dist/aos.css";
import Loader from "../Loader/loader";
import { useNavigate } from "react-router-dom";

// Custom Previous Arrow
const PrevArrow = ({ onClick, bgColor }) => (
  <div
    className={`p-2 rounded-full cursor-pointer ${bgColor}`}
    onClick={onClick}
    aria-label="Previous slide"
  >
    <IoIosArrowBack size={20} />
  </div>
);

// Custom Next Arrow
const NextArrow = ({ onClick, bgColor }) => (
  <div
    className={`p-2 rounded-full cursor-pointer ${bgColor}`}
    onClick={onClick}
    aria-label="Next slide"
  >
    <IoIosArrowForward size={20} />
  </div>
);

const Categories = () => {
  const sliderRef = useRef(null);
  const [offeredslide, setOfferedslide] = useState(0);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    AOS.init({
      duration: 1400,
      once: false,
    });

    return () => {
      AOS.refresh();
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getData("/categories/categories");
        const data = response.categories.map((category) => ({
          id: category._id,
          name: category.categoryName,
          description: category.description || "Default description here.",
          image: `${API_BASE_URL}${category.image}`,
        }));
        setCategoriesData(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [API_BASE_URL]);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: isLargeScreen ? 4 : 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    beforeChange: (oldIndex, newIndex) => {
      setOfferedslide(newIndex);
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="py-7 px-6 md:px-16 lg:px-16 xl:px-32 relative bg-gradient-to-b from-[#FFF8F7] to-white">
      <div
        className="text-center w-full lg:max-w-2xl xl:max-w-3xl mx-auto px-4 mt-4"
        data-aos="zoom-out-up"
      >
        <img
          src="/Header/categories.svg"
          alt="Categories Header"
          className="mx-auto"
        />
        <h2 className=" text-xl md:text-2xl lg:text-3xl font-bold mt-[-1rem] md:mt-[-1.5rem] text-primary tracking-wide">
          Categories
        </h2>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
        {isLargeScreen && (
            <div className="absolute flex right-40 top-16 space-x-4 mt-4">
              <PrevArrow
                onClick={() => sliderRef.current.slickPrev()}
                bgColor={
                  offeredslide === 0
                    ? "bg-[#FFDCD9] text-[#FF7D6F]"
                    : "bg-[#FB3D28] text-white"
                }
              />
              <NextArrow
                onClick={() => sliderRef.current.slickNext()}
                bgColor={
                  offeredslide === categoriesData.length - 4
                    ? "bg-[#FFDCD9] text-[#FF7D6F]"
                    : "bg-[#FB3D28] text-white"
                }
              />
            </div>
          )}
        <Slider ref={sliderRef} {...settings}>
          {categoriesData.map((_, index) => {
            if (!isLargeScreen && index % 6 === 0) {
              const group = categoriesData.slice(index, index + 6);
              return (
                <div key={index}>
                  <div className="grid grid-cols-2 gap-4">
                    {group.map((category) => (
                      <div
                        key={category.id}
                        className="p-3 cursor-pointer"
                        data-aos="flip-down"
                        onClick={() => navigate(`/productlist`)}
                      >
                        <div className="flex flex-col  bg-white px-4 py-1 rounded-2xl shadow-md overflow-hidden
                         h-full justify-between">
                          <div className="flex justify-center items-center ">
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-32 h-32 object-contain pb-2"
                            />
                          </div>
                          <h2 className="text-black text-xl font-bold ">
                            {category.name}
                          </h2>
                          <p className="text-nav font-normal text-sm">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            if (isLargeScreen) {
              return (
                <div
                  key={categoriesData[index].id}
                  className="py-6 px-4 cursor-pointer"
                  data-aos="flip-down"
                  onClick={() => navigate(`/productlist`)}
                >
                  <div className="flex flex-col p-5 bg-white rounded-2xl shadow-md 
                  overflow-hidden h-full justify-between">
                    <div className="flex justify-center items-center mb-4">
                      <img
                        src={categoriesData[index].image}
                        alt={categoriesData[index].name}
                        className="w-32 h-32 object-contain"
                      />
                    </div>
                    <h2 className="text-black text-xl font-bold mb-2">
                      {categoriesData[index].name}
                    </h2>
                    <p className="text-nav font-normal text-sm">
                      {categoriesData[index].description}
                    </p>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </Slider>
        </>
      )}

      <div className="flex justify-center space-x-4 mt-6 lg:hidden">
        <PrevArrow
          onClick={() => sliderRef.current.slickPrev()}
          bgColor={
            offeredslide === 0
              ? "bg-[#FFDCD9] text-[#FF7D6F]"
              : "bg-[#FB3D28] text-white"
          }
        />
        <NextArrow
          onClick={() => sliderRef.current.slickNext()}
          bgColor={
            offeredslide === categoriesData.length - 1
              ? "bg-[#FFDCD9] text-[#FF7D6F]"
              : "bg-[#FB3D28] text-white"
          }
        />
      </div>
    </section>
  );
};

export default Categories;
