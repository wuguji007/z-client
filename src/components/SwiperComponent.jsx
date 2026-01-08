import { useState} from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';


export default function SwiperTemplate() {
    const [carouselData] = useState([
        {
            id: 1,
            image: "/images/swiper-1.svg",
            title: "生活家電全面折扣",
            description: "11/24-12/08 全館特價優惠",
        },
        {
            id: 2,
            image: "/images/swiper-2.svg",
            title: "冬天乾肌保養大補帖",
            description: "保養品最低五折起！",
        },
        {
            id: 3,
            image: "/images/swiper-3.svg",
            title: "居家裝潢修繕服務",
            description: "家用五金全面促銷中，滿千折百最划算",
        },
    ]);

    return (
        <>
            <Swiper>
                {carouselData.map((item) => (
                    <SwiperSlide key={item.id}>
                        <img src={item.image} className="d-block w-100 slide-img" alt={`Slide ${item.id}`} />
                        <div className="container carousel-caption d-none d-md-block text-end">
                            <h1 className='swiper-title fw-bold'>{item.title}</h1>
                            <p className='fs-3'>{item.description}</p>
                            <button className='btn border-primary border-1 bg-white rounded-pill py-4 px-7 fs-5 fw-bold text-primary'>立即查看優惠</button>
                        </div>                       
                    </SwiperSlide>                    
                ))}
            </Swiper>
            
        </>
    )
}
