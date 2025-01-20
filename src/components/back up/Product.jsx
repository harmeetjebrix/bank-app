import React, { useState, useEffect, useRef } from "react";
import { BiSolidShareAlt } from "react-icons/bi";
import { IoLocationSharp } from "react-icons/io5";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import Slider from "react-slick";
import { getData } from "./../../api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Loader from "../Loader/loader";
import { useNavigate } from "react-router-dom";

// Custom Previous Arrow
const PrevArrow = ({ onClick, bgColor }) => {
  return (
    <div
      className={`p-2 rounded-full cursor-pointer ${bgColor}`}
      onClick={onClick}
      aria-label="Previous slide"
    >
      <IoIosArrowBack size={20} />
    </div>
  );
};

// Custom Next Arrow
const NextArrow = ({ onClick, bgColor }) => {
  return (
    <div
      className={`p-2 rounded-full cursor-pointer ${bgColor}`}
      onClick={onClick}
      aria-label="Next slide"
    >
      <IoIosArrowForward size={20} />
    </div>
  );
};

const Products = () => {
  const sliderRef = useRef(null);
  const [offeredslide, setOfferedslide] = useState(0);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [offeredProducts, setOfferedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMoreIndex, setViewMoreIndex] = useState(null);

  const navigate = useNavigate();

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getData("/product/allproducts");
        const products = response.products.map((product) => ({
          title: product.name,
          description: product.description,
          image: `${import.meta.env.VITE_API_BASE_URL}${product.image}`,
          price: `₹ ${product.price}`,
          category: product.category,
          grade: getGrade(product),
          location: product.location || "Location not specified",
          company: product.companyName || "Unknown Company",
          uniqueId: product.uniqueId,
        }));
        console.log(products.category);
        setOfferedProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1400,
      once: false,
    });

    return () => {
      AOS.refresh();
    };
  }, []);

  const getGrade = (product) => {
    if (product.price > 1000) {
      return "A/Grade";
    } else if (product.price > 500) {
      return "B/Grade";
    } else {
      return "C/Grade";
    }
  };
  
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleViewMore = (index) => {
    setViewMoreIndex(viewMoreIndex === index ? null : index);
  };

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
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
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
        className="text-center w-full lg:max-w-2xl xl:max-w-3xl mx-auto px-4 mb-4 mt-4"
        data-aos="zoom-out-up"
      >
        <img
          src="/Header/product.svg"
          alt="Transporting Text"
          className="mx-auto"
        />
        <h2 className=" text-xl md:text-2xl lg:text-3xl font-bold mt-[-1rem] md:mt-[-1.5rem] text-primary tracking-wide">
          Offered Products
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
                  offeredslide === offeredProducts.length - 4
                    ? "bg-[#FFDCD9] text-[#FF7D6F]"
                    : "bg-[#FB3D28] text-white"
                }
              />
            </div>
          )}

          <div className="flex flex-wrap gap-4 justify-center mb-6">
            {offeredProducts.map((product, index) => (
              <>
              {/* <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${
                  selectedCategory === category
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {category}
              </button> */}
              <h1 key={index} className="px-4 py-2 rounded-full text-sm font-medium cursor-pointer bg-pink"> {product.category}</h1>
              </>
            ))}
          </div>
          <Slider ref={sliderRef} {...settings}>
            {offeredProducts.map((product, index) => {
              if (!isLargeScreen && index % 4 === 0) {
                const group = offeredProducts.slice(index, index + 4);
                return (
                  <div key={index} className="p-2 cursor-pointer">
                    <div className="grid grid-cols-2 gap-3">
                      {group.map((productInGroup, groupIndex) => (
                        <div
                          key={productInGroup.uniqueId}
                          className="p-0  cursor-pointer"
                        >
                          <div
                            className="flex flex-col p-5 bg-white rounded-2xl shadow-md product-card"
                            onClick={() =>
                              navigate(
                                `/productlist/productdetails/${productInGroup.title}/${productInGroup.uniqueId}`
                              )
                            }
                          >
                            <div className="flex justify-center items-center mb-4">
                              <img
                                src={productInGroup.image}
                                alt={productInGroup.title}
                                className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 object-contain"
                              />
                            </div>
                            <h2 className="text-black text-xl font-bold mb-2">
                              {productInGroup.title}
                            </h2>
                            <div className="flex my-2">
                              <p
                                className={`w-full text-nav font-normal text-sm ${
                                  viewMoreIndex === index ? "" : "line-clamp-1"
                                }`}
                              >
                                {productInGroup.description}
                              </p>
                              {productInGroup.description.length > 30 && (
                                <button
                                  className="text-red-500 text-sm underline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleViewMore(index);
                                  }}
                                >
                                  {viewMoreIndex === index ? (
                                    <FaChevronUp />
                                  ) : (
                                    <FaChevronDown />
                                  )}
                                </button>
                              )}
                            </div>
                            <div className="flex flex-col justify-between mb-2">
                              <p className="font-medium text-black text-base">
                                {productInGroup.uniqueId}
                              </p>
                              <h6 className="font-medium text-black text-base">
                                {productInGroup.grade}
                              </h6>
                            </div>
                            <div className="flex items-center mb-1">
                              <IoLocationSharp className="text-red-500 mr-1" />
                              <p className="font-medium text-black text-base">
                                {productInGroup.location}
                              </p>
                            </div>
                            <p className="font-medium text-gray-500 text-base">
                              {productInGroup.company}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // Render single product for large screens
              if (isLargeScreen) {
                return (
                  <div key={product.uniqueId} className="p-3 cursor-pointer">
                    <div
                      className="flex flex-col p-5 bg-white rounded-2xl shadow-md product-card"
                      onClick={() =>
                        navigate(
                          `/productlist/productdetails/${product.title}/${product.uniqueId}`
                        )
                      }
                    >
                      <div className="flex justify-center items-center mb-4">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-32 h-32 object-contain"
                        />
                      </div>
                      <h2 className="text-black text-xl font-bold mb-2">
                        {product.title}
                      </h2>
                      <div className="flex my-2">
                        <p
                          className={`w-full text-nav font-normal text-sm ${
                            viewMoreIndex === index ? "" : "line-clamp-1"
                          }`}
                        >
                          {product.description}
                        </p>
                        {product.description.length > 30 && (
                          <button
                            className="text-red-500 text-sm underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleViewMore(index);
                            }}
                          >
                            {viewMoreIndex === index ? (
                              <FaChevronUp />
                            ) : (
                              <FaChevronDown />
                            )}
                          </button>
                        )}
                      </div>
                      <div className="flex justify-between mb-2">
                        <p className="font-medium text-black text-base">
                          {product.uniqueId}
                        </p>
                        <h6 className="font-medium text-black text-base">
                          {product.grade}
                        </h6>
                      </div>
                      <div className="flex items-center mb-1">
                        <IoLocationSharp className="text-red-500 mr-1" />
                        <p className="font-medium text-black text-base">
                          {product.location}
                        </p>
                      </div>
                      <p className="font-medium text-gray-500 text-base">
                        {product.company}
                      </p>
                    </div>
                  </div>
                );
              }
            })}
          </Slider>

          <div className="flex justify-center space-x-4 mt-2 lg:hidden">
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
                offeredslide === offeredProducts.length - 4
                  ? "bg-[#FFDCD9] text-[#FF7D6F]"
                  : "bg-[#FB3D28] text-white"
              }
            />
          </div>
        </>
      )}
    </section>
  );
};

export default Products;
