import { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom"
import SwiperComponent from "../components/SwiperComponent.jsx"
import { ChevronLeft, ChevronRight, ShoppingCart, Cat,MoveRight, Calendar } from 'lucide-react';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Grid } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/grid';


// 暫時用設計稿上的假資料
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
            <Swiper
                slidesPerView={4}
                spaceBetween={30}
                className='position-relative'
            >
                {cardSwiperData.map((card) => (
                <SwiperSlide key={card.id} className="swiper-slide overflow-hidden">
                    <div className="card h-auto border-0 p-5">
                        <img src={card.image} className="card-img-top mb-4" alt={card.title} />
                        <div className="card-body p-0 mb-4">
                            <h5 className="card-title fw-bold fs-5 text-primary-950 mb-20">{card.title}</h5>
                            <p className="card-text fs-5 text-primary-950">NT${card.price} <del className="text-gray-300 fs-6 fw-normal">NT${card.origin_price}</del></p>
                        </div>
                        <button className="btn btn-primary fw-bold py-4 rounded-pill w-100">加入購物車</button>
                    </div>                  
                </SwiperSlide>
                ))}
            </Swiper>             
        </>
    )
}


const GreyCardSwiper = () => {
    return (
        <>
            <Swiper
                slidesPerView={4}
                spaceBetween={30}
                modules={[Navigation]}
                navigation={true} 
                className='position-relative px-4'
            >
                {cardSwiperData.map((card) => (
                <SwiperSlide key={card.id} className="swiper-slide">
                    <div className="card bg-gray-50 h-auto border-0 p-5">
                        <img src={card.image} className="card-img-top mb-4" alt={card.title} />
                        <div className="card-body p-0 mb-4">
                            <h5 className="card-title fw-bold fs-5 text-primary-950 mb-20">{card.title}</h5>
                            <p className="card-text fs-5 text-primary-950">NT${card.price} <del className="text-gray-300 fs-6 fw-normal">NT${card.origin_price}</del></p>
                        </div>
                        <button className="btn btn-primary fw-bold py-4 rounded-pill w-100">加入購物車</button>
                    </div>
                </SwiperSlide>
                ))}
            </Swiper>  
        </>
    )
}


const PromoCardSwiper = () => {
    return (
        <>
            <Swiper
                slidesPerView={4}
                spaceBetween={30}
                modules={[Navigation]}
                navigation={true}               
            >
                {cardSwiperData.map((card) => (
                <SwiperSlide key={card.id} className="swiper-slide">
                    <div className="card bg-white h-auto border-0 p-5">
                        <img src={card.image} className="card-img-top mb-4" alt={card.title} />
                        <div className="card-body p-0 mb-4">
                            <h5 className="card-title fw-bold fs-5 text-primary-950 mb-20">{card.title}</h5>
                            <p className="card-text fs-5 text-primary-950">NT${card.price} <del className="text-gray-300 fs-6 fw-normal">NT${card.origin_price}</del></p>
                        </div>
                        <button className="btn btn-primary fw-bold py-4 rounded-pill w-100">加入購物車</button>
                    </div>
                    </SwiperSlide>
                ))}
            </Swiper>  
        </>
    )
}



export default function Home() {
    return (
        <>
            {/* menu 商品類別選單 */}
            <div className="container">
                <div className="">
                    <ul className="d-flex justify-content-between align-items-center p-0 mb-1 list-unstyled">
                        <li className="nav-item dropdown">
                            <div className="btn-group">
                                <button type="button" className="btn border-primary border-1 rounded-1 my-1 me-1 text-primary fw-bold" data-bs-toggle="dropdown" aria-expanded="false">
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
                        <li className="category-text-secondary"><a href="#" className="py-3 px-6">生活用品</a></li>
                        <li className="category-text-secondary"><a href="#" className="py-3 px-6">食品飲料</a></li>
                        <li className="category-text-secondary"><a href="#" className="py-3 px-6">美妝保養</a></li>
                        <li className="category-text-secondary"><a href="#" className="py-3 px-6">數位家電</a></li>
                        <li className="category-text-secondary"><a href="#" className="py-3 px-6">嬰幼兒</a></li>
                        <li className="category-text-secondary"><a href="#" className="py-3 px-6">寵物</a></li>
                        <li className="category-text-secondary"><a href="#" className="py-3 px-6">室內居家</a></li>
                        <li className="category-text-secondary"><a href="#" className="py-3 px-6">品牌服飾</a></li>
                    </ul>   
                </div>          
            </div>
            

            {/* swiper 輪播圖 */} 
            <section className="hero">
                <SwiperComponent />
            </section>

            {/* flash sale 限時搶購 */}
            <section className="flash-sale bg-primary-900 p-0">
                <div className="container py-120">
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


            <section className='bg-primary-50 p-0'>
                <div className="container py-120">
                    <div className="bg-white d-flex justify-content-between align-items-center mb-7">
                        <div className='d-flex align-items-center m-0'>
                            <div className='bg-primary p-4 text-white me-4'>
                                <Cat size={52} />
                            </div>
                            <h2 className='me-3'>寵物用品</h2>
                            <div className="badge rounded-pill bg-primary-100 px-4 py-2 text-primary fw-bold fs-20">精選推薦</div>
                        </div>
                        <div><Link to="/" className="btn btn-border-primary rounded-pill py-4 px-7 fs-5 fw-bold me-4">查看更多</Link>
                        </div>
                    </div>
            
                    <div className="row">
                        <div className="col-4">
                            <div className="promo-img border-4">
                            <img src="/images/promo-pet.svg" alt="pet-supplies" />
                            </div>
                        </div>
                        <div className="col-8">
                            <div>
                            <PromoCardSwiper />
                            </div>
                       </div>                        
                    </div>
                </div>
            </section>

        </>

    )
}