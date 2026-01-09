import { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import SwiperComponent from "../components/SwiperComponent.jsx"

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';



const CardSwiper = () => {

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
        }
    ];

    return (
        <>
            <Swiper
                slidesPerView={4}
                spaceBetween={30}
                modules={[Pagination]}
                pagination={{ clickable: true }}
                        
            >
                {cardSwiperData.map((card) => (
                <SwiperSlide key={card.id} className="swiper-slide">
                        <div className="card h-auto border-0 p-5">
                            <img src={card.image} className="card-img-top mb-4" alt={card.title} />
                            <div className="card-body p-0 mb-4">
                                <h5 className="card-title fw-bold fs-5 text-primary-950">{card.title}</h5>
                                <p className="card-text fw-bold fs-5 text-primary-950">NT${card.price} <del className="text-secondary fs-6 fw-normal">NT${card.origin_price}</del></p>
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
                        <li className="text-secondary"><a href="#" className="py-3 px-6">生活用品</a></li>
                        <li className="text-secondary"><a href="#" className="py-3 px-6">食品飲料</a></li>
                        <li className="text-secondary"><a href="#" className="py-3 px-6">美妝保養</a></li>
                        <li className="text-secondary"><a href="#" className="py-3 px-6">數位家電</a></li>
                        <li className="text-secondary"><a href="#" className="py-3 px-6">嬰幼兒</a></li>
                        <li className="text-secondary"><a href="#" className="py-3 px-6">寵物</a></li>
                        <li className="text-secondary"><a href="#" className="py-3 px-6">室內居家</a></li>
                        <li className="text-secondary"><a href="#" className="py-3 px-6">品牌服飾</a></li>
                    </ul>   
                </div>          
            </div>
            

            {/* swiper 輪播圖 */} 
            <section className="hero">
                <SwiperComponent />
            </section>

            {/* flash sale 限時搶購 */}
            <section className="flash-sale bg-primary-900 p-0">
                <div className="container p-120">
                    <h4 className="text-primary-200 fw-bold fs-4 mb-3">HURRY UP !</h4>
                    <h2 className="text-white fw-bold me-4 mb-7"><span className="title-line">限時搶購</span>
                    </h2>
                    <div>
                        <CardSwiper />
                    </div>                    
                </div>
            </section>


        </>

    )
}