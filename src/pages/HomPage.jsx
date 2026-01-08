import { Link } from "react-router-dom"
import SwiperComponent from "../components/SwiperComponent.jsx"


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
            

            {/* 主要內容區塊 */} 
            <section className="hero">
                <SwiperComponent />
            </section>
            <div className="container">
                主要內容區塊
            </div>

        </>

    )
}