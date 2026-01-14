import { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom"
import HeroSwiper from "../components/HeroSwiper.jsx"
import { ChevronLeft, ChevronRight, ShoppingCart, Cat, CookingPot } from 'lucide-react';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Grid } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/grid';


// 暫時用的類別假資料
const categories = [
    "生活用品", "食品飲料", "美妝保養", "數位家電", "嬰幼兒", 
    "寵物用品", "室內居家", "運動生活", "廚房用具", "手作禮品", 
    "限時搶購"
  ];


// 暫時用的商品假資料
const cardSwiperData = [
    {
        id: 1,
        title: "嚴選紅茶茶包組（熱泡／冷泡適用）",
        image: "/images/limit-product-1.svg",
        price: "399",
        origin_price: "499",
    },
    {
        id: 2,
        title: "無線藍牙耳罩式耳機",
        image: "/images/limit-product-2.svg",
        price: "5399",
        origin_price: "6099",
    },
    {
        id: 3,
        title: "智慧空氣清淨機（家用型）",
        image: "/images/limit-product-3.svg",
        price: "7999",
        origin_price: "8099",
    },
    {
        id: 4,
        title: "保濕滋養沐浴乳",
        image: "/images/limit-product-4.svg",
        price: "129",
        origin_price: "209",
    },
    {
        id: 5,
        title: "嚴選紅茶茶包組（熱泡／冷泡適用）",
        image: "/images/limit-product-1.svg",
        price: "399",
        origin_price: "499",
    },
    {
        id: 6,
        title: "無線藍牙耳罩式耳機",
        image: "/images/limit-product-2.svg",
        price: "5399",
        origin_price: "6099",
    },
    {
        id: 7,
        title: "無線藍牙耳罩式耳機",
        image: "/images/limit-product-2.svg",
        price: "5399",
        origin_price: "6099",
    },
    {
        id: 8,
        title: "無線藍牙耳罩式耳機",
        image: "/images/limit-product-2.svg",
        price: "5399",
        origin_price: "6099",
    },
    {
        id: 9,
        title: "無線藍牙耳罩式耳機",
        image: "/images/limit-product-2.svg",
        price: "5399",
        origin_price: "6099",
    },
    {
        id: 10,
        title: "無線藍牙耳罩式耳機",
        image: "/images/limit-product-2.svg",
        price: "5399",
        origin_price: "6099",
    },
    {
        id: 11,
        title: "無線藍牙耳罩式耳機",
        image: "/images/limit-product-2.svg",
        price: "5399",
        origin_price: "6099",
    }
];


const CardSwiper = () => {
    return (
        <>
            <div className="row">
                <div className="col-12">
                    <Swiper
                        slidesPerView={1.3}
                        spaceBetween={12}
                        modules={[Navigation]}
                        navigation={true} 
                        loop={true}
                        breakpoints={{
                        378: { slidesPerView: 1.3, spaceBetween: 12 },
                        576: { slidesPerView: 2.2, spaceBetween: 12 },
                        768: { slidesPerView: 3, spaceBetween: 20 },
                        1024: { slidesPerView: 4, spaceBetween: 24 }
                        }}
                    >
                        {cardSwiperData.map((card) => (
                        <SwiperSlide key={card.id} className="swiper-slide">
                            <div className="card h-auto border-0 p-3 p-md-5">
                                <img src={card.image} className="card-img-top mb-0 mb-md-4" alt={card.title} />
                                <div className="card-body p-0 mb-4">
                                    <h5 className="card-title fw-bold fs-5 text-primary-950 mb-20">{card.title}</h5>
                                    <p className="card-text fs-5 text-primary-950">NT${card.price} <del className="text-gray-300 fs-6 fw-normal">NT${card.origin_price}</del></p>
                                </div>
                                <button className="btn btn-primary fw-bold py-4 rounded-pill w-100">加入購物車</button>
                            </div>                  
                        </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>                        
        </>
    )
}


const GreyCardSwiper = () => {
    return (
        <>
            <div className="row">
                <div className="col-12">
                    <Swiper
                        slidesPerView={1.3}
                        spaceBetween={12}
                        modules={[Navigation]}
                        navigation={true} 
                        loop={true}
                        breakpoints={{
                        576: { slidesPerView: 2.2, spaceBetween: 12 },
                        768: { slidesPerView: 3, spaceBetween: 20 },
                        1024: { slidesPerView: 4, spaceBetween: 24 }
                        }}
                    >
                        {cardSwiperData.map((card) => (
                        <SwiperSlide key={card.id} className="swiper-slide">
                            <div className="card bg-gray-50 h-auto border-0 p-3 p-md-5">
                                <img src={card.image} className="card-img-top mb-0 mb-md-4" alt={card.title} />
                                <div className="card-body p-0 mb-4">
                                    <h5 className="card-title fw-bold fs-5 text-primary-950">{card.title}</h5>
                                    <p className="card-text fs-5 fs-md-4 text-primary-950">NT${card.price} <del className="text-gray-300 fs-5 fw-normal">NT${card.origin_price}</del></p>
                                </div>
                                <button className="card-btn btn btn-primary fw-bold py-3 py-md-4 rounded-pill w-100">加入購物車</button>
                            </div>
                        </SwiperSlide>
                        ))}
                    </Swiper> 
                </div>
            </div>
             
        </>
    )
}


//精選推薦區-網格卡片輪播元件
const products = cardSwiperData;

const CardCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // 每頁顯示 6 張卡片 (2欄 x 3行)
  const itemsPerSlide = 6;
  
  // 將產品分組 (Chunks)
  const slides = [];
  for (let i = 0; i < products.length; i += itemsPerSlide) {
    slides.push(products.slice(i, i + itemsPerSlide));
  }

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="d-flex flex-column">
      
      <style>{`
        /* 覆蓋 Bootstrap Carousel 預設樣式 */
        .carousel-item {
          transition: transform 0.6s ease-in-out;
        }
        
        /* 導航按鈕樣式 */
        .nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid #eee;
          background: white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .nav-btn:hover {
          background: #2c3e50;
          border-color: $primary; //#2c3e50;
        }
        .nav-btn:hover svg {
          stroke: white;
        }
        .nav-prev { left: -24px; }
        .nav-next { right: -24px; }
        
        @media (max-width: 768px) {
        .nav-btn { display: none; }
        }

        /* 產品卡片樣式 - 配合 g-0 進行微調 */
        .product-card {
          border-radius: 0; /* 內部卡片維持直角 */
          overflow: hidden;
        }
        
        .btn-add-cart {
          background-color: #2c3e50;
          border: none;
        }
        .btn-add-cart:hover {
          background-color: #1a252f;
        }


        /* 分頁圓點 (Indicators) 自定義 */
        .carousel-indicators {
          position: static; /* 移出圖片區域 */
          margin-top: 10px;
          margin-bottom: 0;
        }

        /* 修正選擇器與圓點樣式 */
        .carousel-indicators button {
          background-color: #EFFAFC; /* Inactive: #EFFAFC背景色 */
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 1px #1F749B solid;
          margin: 0 6px;
          padding: 0 0;
          transition: all 0.3s ease;
          opacity: 1; /* 確保顏色不被 Bootstrap 預設的 opacity 覆蓋 */
        }
        
        .carousel-indicators button.active {
          background-color: #1F749B; /* Active: 深色填滿 */
          width: 12px; /* 保持圓形，不拉長 */
        }


      /* Grid 容器外框 */
        .grid-container-wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
        border-radius: 16px;       /* 容器圓角 */
        overflow: hidden;          /* 裁切內部卡片的直角 */
        border: 1px solid #dee2e6; /* 最外層邊框 */
        background-color: #dee2e6; /* 避免邊框間隙透出背景 */
      }


      /* Grid Card 自定義樣式 */
      .grid-card {
        border: 1px solid #dee2e6;
        border-radius: 0; /* 內部卡片維持直角 */
        transition: all 0.3s ease;
        height: 100%;
        background: white;
        
        /* 負 Margin 技巧：讓卡片邊框重疊，形成單線格線效果 */
        margin-bottom: -1px; 
        margin-right: -1px;
      }
      `}</style>

        <div className="position-relative px-0 px-md-4">
          
          {/* 輪播主體 */}
          <div id="productGridCarousel" className="carousel slide">
            
            {/* 左右導航按鈕 (Lucide Icons) */}
            <button 
              className="nav-btn nav-prev" 
              onClick={prevSlide}
              aria-label="Previous Slide"
            >
              <ChevronLeft size={24} color="#333" />
            </button>
            <button 
              className="nav-btn nav-next" 
              onClick={nextSlide}
              aria-label="Next Slide"
            >
              <ChevronRight size={24} color="#333" />
            </button>

                  
            <div className="carousel-inner">
              {slides.map((slideProducts, slideIndex) => (
                <div 
                  key={slideIndex} 
                  className={`carousel-item ${slideIndex === activeIndex ? 'active' : ''}`}
                  >
                      
                <div className="grid-container-wrapper"> 
                  {/* Grid 結構: g-0 (No Gutters) */}
                  <div className="row g-0">
                    {slideProducts.map((product) => (
                      /* 響應式設定: 
                        col-12: 手機單欄 (每頁6個 = 6行)
                        col-md-6: 電腦雙欄 (每頁6個 = 3行) 
                      */
                      <div key={product.id} className="col-12 col-md-6">
                        <div className="grid-card product-card">
                          <div className="row g-0">
                            {/* 修改為水平卡片佈局在手機上可能更好看，但這裡維持垂直卡片風格 */}
                            <div className="col-6">
                              <div className="card-img-wrapper">
                                <img 
                                  src={product.image} 
                                  className="card-img-top" 
                                  alt={product.title} 
                                />
                              </div>
                            </div>
                                    
                            <div className="col-6 d-flex flex-column flex-grow-1">
                                <div className="card-body d-flex flex-column p-3">                              
                                    <h6 className="card-title fw-bold fs-5 fs-md-4 mb-1">{product.title}</h6>
                                    
                                    <div className="d-flex justify-content-between flex-column align-items-start mt-auto pt-2 border-top">
                                        <span className="text-primary-950 fs-4 mb-2">NT${product.price}<del className='text-gray-300 fs-6 fs-md-5'>${product.origin_price}</del></span>
                                        <button className="btn bg-primary text-white fw-bold btn-sm rounded-pill w-100 py-3 d-flex align-items-center shadow-sm d-none d-md-block" style={{ fontSize: '0.8rem' }}>
                                            加入購物車
                                        </button>
                                        <button className="btn bg-primary text-white btn-sm rounded-circle px-2 py-2 d-flex align-items-center shadow-sm d-block d-md-none" style={{ fontSize: '0.8rem' }}>
                                        <ShoppingCart size={20} className="" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                        </div>
                    </div>
                </div>
              ))}
            </div>

            {/* Pagination Dots (Bootstrap Indicators) */}
            <div className="carousel-indicators">
                {slides.map((_, index) => (
                    <button
                    key={index}
                    type="button"
                    onClick={() => goToSlide(index)}
                    className={index === activeIndex ? "active" : ""}
                    aria-current={index === activeIndex ? "true" : "false"}
                    aria-label={`Slide ${index + 1}`}
                    ></button>
                ))}
            </div>
                
          </div>
        </div>
      </div>
    // </div>
  );
};
//精選推薦區-網格卡片輪播元件




export default function Home() {
    return (
        <>
            {/* menu 商品類別選單 */}
            <div className="container category-container">
                <div className="container-fluid px-0">
                    <ul className="d-flex flex-nowrap overflow-auto hide-scrollbar justify-content-between align-items-center p-0 mb-0 list-unstyled">
                        <li className="nav-item dropdown">
                            <div className="btn-group">
                                <button type="button" className="btn border-primary border-1 rounded-1 my-1 me-1 text-primary fw-bold category-link" data-bs-toggle="dropdown" aria-expanded="false">
                                    所有類別
                                </button>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="#">Separated link</a></li>
                                </ul>
                            </div>
                        </li>
                        <li className="category-text-secondary"><a href="#" className="py-3 px-6 category-link">生活用品</a></li>
                        <li className="category-text-secondary"><a href="#" className="py-3 px-6 category-link">食品飲料</a></li>
                        <li className="category-text-secondary"><a href="#" className="py-3 px-6 category-link">美妝保養</a></li>
                        <li className="category-text-secondary"><a href="#" className="py-3 px-6 category-link">數位家電</a></li>
                        <li className="category-text-secondary"><a href="#" className="py-3 px-6 category-link">嬰幼兒</a></li>
                        <li className="category-text-secondary"><a href="#" className="py-3 px-6 category-link">寵物</a></li>
                        <li className="category-text-secondary"><a href="#" className="py-3 px-6 category-link">室內居家</a></li>
                        <li className="category-text-secondary"><a href="#" className="py-3 px-6 category-link">品牌服飾</a></li>
                    </ul>   
                </div>          
            </div>
            {/* 關鍵class:
            d-flex: 讓子元素橫向排列
            flex-nowrap: 禁止換行，強制在同一行
            overflow-auto: 當內容溢出時顯示滾動機制
            hide-scrollbar: 我們自定義的 CSS class，用來隱藏 X 軸
            */}



            {/* Hero swiper輪播圖 */} 
            <section className="hero">
                <HeroSwiper />
            </section>

            {/* flash sale 限時搶購 */}
            <section className="flash-sale bg-primary-900 p-0">
                <div className="container py-7 py-md-120">
                    <h4 className="text-primary-200 fw-bold fs-4 mb-3">HURRY UP !</h4>
                    <div className="d-flex justify-content-between align-items-center mb-7">
                        <h2 className='title-line text-white fw-bold'>限時搶購</h2>
                        {/* Horizontal Line (Flex Grow to fill space) */}
                        <div className="flex-grow-1 bg-primary-100" style={{ height: '1px' }}></div>
                    </div>                    
                    <div>
                        <CardSwiper />
                    </div>                    
                </div>
            </section>

            {/* best-sellers 熱銷商品 & member-only會員專屬優惠 */}
            <section className="bg-white p-0">
                <div className="container py-120">
                    <div className="row">
                        <div className="col-12 mb-10">
                            <div className="w-100 mb-8">
                                <h4 className="text-primary fw-bold fs-4 mb-3">HOT</h4>
                                <div className="d-flex justify-content-between align-items-center mb-7">
                                    <h2 className="text-black fw-bold bg-white">熱銷商品</h2>
                                    {/* Horizontal Line (Flex Grow to fill space) */}
                                    <div className="flex-grow-1 mx-4 bg-primary" style={{ height: '1px' }}></div>                                               
                                    <div><Link to="/member" className="btn btn-border-primary rounded-pill py-4 px-7 fs-5 fw-bold">查看更多</Link>
                                    </div>
                                </div>                   
                                <div>
                                    <GreyCardSwiper />
                                </div>
                            </div>
                            <div className="w-100">
                                <h4 className="text-primary fw-bold fs-4 mb-3">MEMBER ONLY</h4>
                                <div className="d-flex justify-content-between align-items-center mb-7">
                                    <h2 className="text-black fw-bold bg-white">會員專屬優惠</h2>
                                    {/* Horizontal Line (Flex Grow to fill space) */}
                                    <div className="flex-grow-1 mx-4 bg-primary" style={{ height: '1px' }}></div>                                               
                                    <div><Link to="/member" className="btn btn-border-primary rounded-pill py-4 px-7 fs-5 fw-bold">查看更多</Link>
                                    </div>
                                </div>                   
                                <div>
                                    <GreyCardSwiper />
                                </div>
                            </div>
                        </div>
                    </div>                
                </div>
            </section>

            
            {/* Promo 精選推薦 */}
            <section className='bg-primary-50 p-0'>
                <div className="container py-120 d-flex flex-column">

                    {/* 寵物用品 */}
                    <div className='mb-6 mb-md-8'>
                        <div className="bg-white d-flex justify-content-between align-items-center mb-7">
                            <div className='d-flex align-items-center m-0'>
                                <div className='bg-primary p-4 text-white me-4'>
                                    <Cat size={52} />
                                </div>
                                <div className="d-flex flex-column-reverse flex-md-row">
                                    <h2 className='me-3'>寵物用品</h2>
                                    <div className="badge rounded-pill bg-primary-100 px-4 py-2 text-primary fw-bold fs-20">精選推薦</div>
                                </div>
                            </div>
                            <div><Link to="/" className="btn btn-border-primary rounded-pill py-3 px-5 py-md-4 px-md-7 fs-sm fs-md-5 fw-bold me-4">查看更多</Link>
                            </div>
                        </div>
                                        
                        <div className="row bg-primar-50 align-items-stretch">
                            <div className="col-12 col-md-4 px-md-0 h-100">
                                <div className="border-4 mb-3 mb-md-0 h-100">
                                <img src="/images/promo-pet.svg" alt="pet-supplies" className='promo-img'/>
                                </div>
                            </div>
                            {/* 網格卡片輪播 */}
                            <div className="col-12 col-md-8">                           
                                <CardCarousel />                            
                            </div>                        
                        </div>
                    </div>


                    {/* 食品飲料 */}
                    <div>
                        <div className="bg-white d-flex justify-content-between align-items-center mb-7">
                            <div className='d-flex align-items-center m-0'>
                                <div className='bg-primary p-4 text-white me-4'>
                                    <CookingPot size={52} />
                                </div>
                                <div className="d-flex flex-column-reverse flex-md-row">
                                    <h2 className='me-3'>食品飲料</h2>
                                    <div className="badge rounded-pill bg-primary-100 px-4 py-2 text-primary fw-bold fs-20">精選推薦</div>
                                </div>
                            </div>
                            <div><Link to="/" className="btn btn-border-primary rounded-pill py-3 px-5 py-md-4 px-md-7 fs-sm fs-md-5 fw-bold me-4">查看更多</Link>
                            </div>
                        </div>
                                        
                        <div className="row bg-primar-50 align-items-stretch">
                            <div className="col-12 col-md-4 px-md-0 h-100">
                                <div className="border-4 mb-3 mb-md-0 h-100">
                                <img src="/images/promo-food.svg" alt="pet-supplies" className='promo-img'/>
                                </div>
                            </div>
                            {/* 網格卡片輪播 */}
                            <div className="col-12 col-md-8">                           
                                <CardCarousel />                            
                            </div>                        
                        </div>
                    </div>

                </div>
            </section>

        </>
    )
}