import { useState, useEffect, useMemo, useRef} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { COUPON_CONFIG } from "../config/coupon";
import { ShoppingCart, Trash2, Plus, Minus, Tag, Info, Loader2, CheckCircle2, X, CircleX } from 'lucide-react';


/**
 * 產生唯一訂單編號
 * 格式：ZNM-YYYYMMDD-HHMMSS-XXXX (X = 4位隨機英數字)
 * 例如：ZNM-20240315-143022-A7K2
 */
function generateOrderNo() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const time = now.toTimeString().slice(0, 8).replace(/:/g, ''); // HHMMSS
  const random = Math.random().toString(36).toUpperCase().slice(2, 6); // 4位隨機英數
  return `ZNM${date}${time}${random}`;
}


export default function CartPage({ products, setProducts, checkLoggedIn }) {

    const navigate = useNavigate();

    /* 優惠券相關狀態 */
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [coupons] = useState(COUPON_CONFIG);
    const [tempSelectedCou, setTempSelectedCou] = useState(null);
    const [selectedCou, setSelectedCou] = useState(null);
    const [couponValidation, setCouponValidation] = useState({ status: '', message: '' });
    const codeInputRef = useRef(null);  //管理優惠代碼輸入框


    // 購物車清單管理
    const updateQty = (id, delta) => {    
        setProducts(prev => prev.map(p => p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p));  
    };
  
    const toggleCheck = (id) => {    
        setProducts(prev => prev.map(p => p.id === id ? { ...p, checked: !p.checked } : p));  
    };
  
    const handleRemoveProduct = (id) => {    
        if (window.confirm('確定要移除此商品嗎？')) {
            setProducts(prev => prev.filter(p => p.id !== id)); 
        }
    };

    const handleRemoveItem = (id) => {
    if (window.confirm('確定要移除此商品嗎？')) {
      // 直接把該 ID 的商品從陣列中過濾掉
      setProducts(prevItems => prevItems.filter(item => item.id !== id));
      // setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    }
  };

    // 使用useMemo，避免每次渲染時重複執行filter和reduce等運算
    const cartStats = useMemo(() => {
        const freeShippingThreshold = 1000;
        // const discount = 0;
        const selectedItems = products.filter(item => item.checked);
        const originalTotal = selectedItems.reduce(
            (acc, p) => acc + p.originalPrice * p.quantity, 0)
        const subtotal = selectedItems.reduce(
            (sum, item) => sum + item.price * item.quantity, 0);
        const savings = originalTotal - subtotal;
        const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 120;
        const diffForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
        const allChecked = products.length > 0 && products.every(p => p.checked);
        const anyChecked = products.some(p => p.checked);
        const couponDiscount = selectedCou ? selectedCou.discount : 0;
        const total = Math.max(0, subtotal + shippingFee - couponDiscount);
        return {
            selectedItems,
            originalTotal,
            subtotal,
            shippingFee,
            total,
            savings,
            freeShippingThreshold,
            diffForFreeShipping,
            allChecked,
            anyChecked,
            cartTotalQuantity: selectedItems.reduce((acc, p) => acc + p.quantity, 0),
            couponDiscount
        };
    }, [products, selectedCou]);
  
    // 解構出來使用 
    const { 
        selectedItems,
        originalTotal,
        subtotal,
        shippingFee,
        discount,
        total,
        savings,
        freeShippingThreshold,
        diffForFreeShipping,
        allChecked,
        anyChecked,
        cartTotalQuantity,
        couponDiscount
    } = cartStats;


    const shippingDisplay = () => {
        const isEmpty = selectedItems.length === 0;
        const isFree = shippingFee === 0;

        switch (true) {
            case isEmpty:
                return { text: 'NT$0', className: 'text-primary-900' };
            
            case isFree:
                return { text: '免運費', className: 'text-success fw-semibold' };
        
            default:
                return { text: `NT$${shippingFee}`, className: 'text-primary-900' };
        }
    };
    const shippingInfo = shippingDisplay();

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            alert('請選擇要結帳的商品');
            return;
        }

        if (!checkLoggedIn) {
            alert('請先登入帳號');
            setTimeout(() => navigate('/login'), 1000);
            return;
        }

        try {
            const merchantOrderNo = generateOrderNo();
            const createdAt = new Date().toISOString();
            const orderData = {
                merchantOrderNo,
                items: selectedItems,
                subtotal,
                shippingFee,
                couponDiscount: couponDiscount || 0,
                total,
                createdAt
            };

        console.log('訂單已成立');
        // navigate('/checkout', { state: { orderData } });
        setTimeout(() => navigate('/checkout', { state: { orderData, selectedItem: orderData.items } }), 1500);
        
        } catch (error) {
        console.log('訂單建立失敗');
        }
    };

    // 優惠券Modal元件
    const handleModalOpen = () => {
        // setTempSelectedCou(null);
        setCouponValidation({ status: '', message: '' });
        setIsModalOpen(true);
    };

    const handleCodeApply = () => {
        const code = codeInputRef.current.value.trim().toUpperCase();
        const couponFound = coupons.find(c => c.type === 'code' && c.code === code);
        if (!code) {
            setCouponValidation({ status: 'text-danger', message: '請輸入優惠代碼' });
            return;
        }

        if (couponFound) {
            setTempSelectedCou(couponFound);
            setCouponValidation({ status: 'text-success', message: `成功套用 ${couponFound.code}` });
            codeInputRef.current.value = '';
        } else {
            setCouponValidation({ status: 'text-danger', message: '無效的優惠代碼' });
        }   
    }

    // 優惠券選擇
    const handleCouponSelect = (coupon) => {
        setTempSelectedCou(coupon);
        setCouponValidation({ status: '', message: '' });
    };

    // 優惠券或優惠代碼確認
    const handleCouponConfirm = () => {
        if (tempSelectedCou) {
            setSelectedCou(tempSelectedCou);
            setIsModalOpen(false);
        }
    };



    return (    
        <div className="cart-panel bg-gray-50 d-flex justify-content-center align-items-center py-5 py-md-8" >
            <div className="row container px-0">

                {/* 左側商品清單 */}
                <div className="col-lg-8 h-100 mb-5">
                    <div className="card border-1 border-gray-200 h-100">
                        <div className="border-0 mb-0">
                            <div className="p-5 d-flex align-items-center">                               
                                <div className="custom-control custom-checkbox">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input me-4"
                                        id="checkAll"
                                        checked={allChecked}
                                        onChange={() => {                                    
                                            const target = !allChecked;                                    
                                            setProducts(prev => prev.map(p => ({ ...p, checked: target })));                            
                                        }}
                                    />                                
                                    <label className="custom-control-label text-primary-900 fw-bold" htmlFor="checkAll">全選商品（{selectedItems.length}）</label>
                                </div>
                            </div>
                        </div>

                        {products.length === 0 ? (
                        <div className="border-bottom border-gray-100 p-5 text-center text-muted">
                            <ShoppingCart className="mx-auto mb-3 opacity-25" size={48} />
                            <p>購物車目前沒有商品</p>
                            <button className="btn btn-primary my-2" onClick={() => window.location.reload()}>重整頁面測試</button>
                        </div>
                        ) : (
                        products.map(item => (
                            <div key={item.id} className={`border-top border-gray-100 ${!item.checked ? 'opacity-50' : ''}`}>
                                <div className="p-4">
                                    <div className="d-flex align-items-top align-items-md-center p-0">
                                        <div className="px-2">
                                            <div className="custom-control custom-checkbox pr-0">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input pr-2"
                                                    id={`p-${item.id}`}
                                                    checked={item.checked}
                                                    onChange={() => toggleCheck(item.id)}
                                                />
                                                <label className="custom-control-label" htmlFor={`p-${item.id}`}></label>
                                            </div>
                                        </div>

                                        <div className="flex-shrink-1 ms-0 px-2 px-md-4">
                                            <img src={item.image} className="h-auto" style={{ width: '150px', objectFit: 'contain' }} />
                                        </div>

                                        <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center w-100 pe-2">
                                            <div className="d-flex flex-column justify-content-between">
                                                <div className="mb-md-6">
                                                    <h6 className="text-primary-900 fw-bold mb-2">{item.title}</h6>
                                                    <p className="small text-gray-500 mb-2">規格：{item.unit}</p>         
                                                </div>
                                                <div>
                                                    <h6 className="text-primary-900 fw-bold mb-2">
                                                        NT${item.price}
                                                        <del className="small fw-medium text-gray-200">${item.originalPrice}</del>
                                                    </h6>
                                                    <p className="small text-primary mb-2 mb-md-0">下單後，商品預計???出貨</p>
                                                </div>                                                    
                                            </div>                                        
                                            <div>
                                                <div className="d-flex flex-shrink-0 justify-content-between align-items-center bg-white rounded-pill border border-gray-100 px-1 py-1 py-md-0" style={{maxWidth: '100px'}}>
                                                    <button
                                                        className="btn btn-sm p-0 border-0"
                                                        onClick={() => updateQty(item.id, -1)}
                                                        disabled={item.quantity <= 1}>
                                                        <Minus size={14} />
                                                    </button>                                                   
                                                    <span
                                                        className="mx-2 fw-bold"
                                                        style={{ width: '40px', textAlign: 'center' }}>{item.quantity}
                                                    </span>                                                  
                                                    <button
                                                        className="btn btn-sm p-0"
                                                        onClick={() => updateQty(item.id, 1)}>
                                                        <Plus size={14} />
                                                    </button>
                                                </div>   
                                            </div>
                                        </div>

                                        <div className="flex-shrink-1 align-items-md-center">
                                            {/* 刪除按鈕 */}
                                            <button 
                                            className="btn btn-link text-primary p-0 mb-1" 
                                            onClick={() => handleRemoveProduct(item.id)}
                                            title="刪除商品"
                                            >
                                            <Trash2 size={18} />
                                            </button>
                                        </div>

                                        
                                    </div>
                                </div>
                            </div>
                        ))
                        )}
                    </div>
                </div>

                {/* 右側結帳明細 */}
                <div className="col-lg-4">
                    <div className="card border-1 border-gray-200 py-4 py-md-5 h-auto">
                        <h5 className="text-primary-900 fw-bold px-4 pb-4">結帳明細</h5>

                        <div className="d-flex justify-content-between p-4 border-top border-gray-100 text-primary-900 fw-medium">
                            <span>商品原價總計</span>
                            <span>NT${originalTotal.toLocaleString()}</span>
                        </div>
                        <div className="d-flex justify-content-between px-4 mb-4 text-danger small">
                            <span>折扣優惠</span>
                            <span>-NT${savings.toLocaleString()}</span>
                        </div>
                        {/* Shipping運費 */}
                        <div className="d-flex justify-content-between px-4 text-primary-900 mb-4 fw-medium">
                            <span>運費</span>
                            <span className={shippingInfo.className}>
                                {shippingInfo.text}
                            </span>
                        </div>
                        {shippingFee > 0 && (
                            <div className="bg-danger-light p-2 small text-danger fw-semibold rounded-2 d-flex align-items-center gap-2 mx-4 mb-4" style={{ fontSize: '12px' }}>
                                <Info size={14} />
                                再買 NT${diffForFreeShipping.toLocaleString()} 即享免運
                            </div>
                        )}
                        {subtotal >= freeShippingThreshold && (
                            <div className="bg-primary-50 p-2 small text-primary fw-semibold rounded-2 d-flex align-items-center gap-2 mx-4 mb-2" style={{ fontSize: '12px' }}>
                                <CheckCircle2 size={14} />
                                已達免運門檻！
                            </div>
                        )}

                        {/* 優惠券Modal按鈕 */}
                        {selectedCou && (
                            <div className="d-flex justify-content-between align-items-center mx-4 mb-2 small">
                                <span className="text-primary-900 fw-semibold">已折抵</span>
                                <span className="text-danger">-NT${(selectedCou.discount).toLocaleString()}</span>
                            </div>
                        )}

                        <div className="d-flex align-items-center px-4 mb-4 text-primary small">
                            {selectedCou ? (
                                <button
                                    className="bg-white align-items-center border-0 py-1"
                                    onClick={handleModalOpen}
                                    >
                                        <div className="d-flex align-items-center gap-2">
                                            <Tag size={18} className="text-primary" />
                                            <span className="small fw-bold text-primary">選擇其他優惠券</span>
                                        </div>
                                </button>) : (
                                <button
                                    className="bg-white align-items-center border-0 py-1"
                                    onClick={handleModalOpen}
                                >
                                    <div className="d-flex align-items-center gap-2">
                                        <Tag size={18} className="text-primary" />
                                        <span className="small fw-bold text-primary">選擇優惠券或輸入代碼</span>
                                    </div>
                                </button>)
                            }
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center p-4 border-top border-gray-100 text-primary-900">
                            <span className="h6 mb-0 fw-bold">總金額（{cartTotalQuantity}件商品）</span>
                            <span className="h5 text-danger fw-bold mb-0">NT${total.toLocaleString()}</span>
                        </div>
                        <button 
                            className="btn btn-primary btn-md rounded-pill py-3 mx-4 fw-semibold shadow-sm " 
                            onClick={handleCheckout} 
                            disabled={!anyChecked}
                            style={{ borderRadius: '10px' }}
                        >
                            結帳
                        </button>
                    </div>
                </div>
            </div>

            {/* 優惠券Modal Template */}
            {isModalOpen && (
                <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5', backdropFilter: 'blur(4px)'}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 shadow-lg pt-2">
                            <div className="modal-header d-flex align-items-center border-gray-100 px-4">
                                <h5 className="text-primary-900 fw-bold">選擇優惠券</h5>
                                <button type="button" className="btn-close" onClick={()=> setIsModalOpen(false)}></button>
                            </div>

                            {/* 優惠代碼輸入區 */}
                            <div className="modal-body p-4">
                                <div className="mb-4 bg-gray-50 rounded-2 py-4">
                                    <label className="fw-bold text-primary-900 px-4 mb-2">新增優惠券</label>
                                    <div className="input-group px-4">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="輸入優惠代碼(例如: VIP500)"
                                            ref={codeInputRef}
                                        />
                                        <button
                                            className="btn btn-primary px-4 fw-semibold"
                                            onClick={handleCodeApply} >
                                            使用
                                        </button>
                                    </div>
                                    {tempSelectedCou === null && (couponValidation.status) &&(
                                        <div className={`bg-danger-light p-2 small rounded-2 d-flex align-items-center gap-2 mt-2 mx-4 ${couponValidation.status}`}>
                                            <Info size={14} />
                                            {couponValidation.message}
                                        </div>
                                    )}
                                    {tempSelectedCou?.type === 'code' && (couponValidation.status === 'text-success') && (
                                        <div className={`bg-success-light bg-opacity-75 p-2 small rounded-2 text-primary d-flex justify-content-between align-items-center gap-2 mt-2 mx-4 ${couponValidation.status}`}>
                                            <span>
                                            <CheckCircle2 size={14} /> {couponValidation.message}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* 優惠券選擇區 */}
                                <div className="list-group">
                                    {coupons.filter(c => c.type === 'coupon').map(c => {
                                        const isSelected = tempSelectedCou && tempSelectedCou.code === c.code;
                                        return (
                                        <div
                                            key={c.code}
                                            className="card d-flex flex-row align-items-center p-4 mb-3 h-auto"
                                            onClick={() => handleCouponSelect(c)}
                                            style={ isSelected ? { borderColor: 'var(--bs-primary-500)', boxShadow: '0 0 0 0.25rem rgba(13, 206, 219, 0.5)', cursor: 'pointer' } : {cursor: 'pointer'}}
                                        >
                                            <div className="bg-primary-50 d-flex align-items-center justify-content-center p-4" style={{ width: '100px', height: '100px' }}>
                                                <img src="./images/zonama-logo-md.svg" alt="coupon-img" />
                                            </div>
                                            <div className="flex-grow-1 px-3 py-2">
                                                <div
                                                    className="badge badge-soft-info text-info mb-1"
                                                    style={{ backgroundColor: '#e1f5fe', fontSize: '10px' }}>
                                                    {c.title}
                                                </div>
                                                <div className="text-muted" style={{ fontSize: '12px' }}>代碼: {c.code}</div>
                                                <div className="text-muted" style={{ fontSize: '12px' }}>有效日期: {c.validUntil}</div>
                                            </div>
                                            <div className="px-3">
                                                <div className="custom-control custom-radio">
                                                    <input type="radio" checked={isSelected} readOnly className="custom-control-input" />
                                                    <label className="custom-control-label"></label>
                                                </div>
                                            </div>
                                        </div>)
                                    })}
                                </div>
                            </div>

                            <div className="d-flex justify-content-between gap-2 border-top border-gray-100 p-4">
                                <button className="btn btn-bg-white border-primary w-100 text-primary fw-semibold rounded-pill py-2">取消</button>
                                <button
                                    className="btn btn-primary w-100 fw-semibold rounded-pill py-2"
                                    onClick={handleCouponConfirm}
                                >
                                    確定
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};