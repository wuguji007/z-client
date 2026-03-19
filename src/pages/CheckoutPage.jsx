import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PAYMENT_METHODS } from '../config/payment_methods';
import { SHIPPING_METHODS } from '../config/shipping_methods';
import { ArrowLeft, CreditCard, Loader2, TriangleAlert } from 'lucide-react';
import axiosClient from '../api/axiosClient';

export default function CheckoutPage({ formData, setFormData, onReset }) {

    const navigate = useNavigate();
    const location = useLocation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0].id);
    const [selectedShipping, setSelectedShipping] = useState(SHIPPING_METHODS[0].id);
    const [errMsg, setErrMsg] = useState('');
  
    const cartData = location.state?.orderData || {};
    const { items = [], total, shippingFee, subtotal, merchantOrderNo, couponDiscount } = cartData;

    // 若訂單無merchantOrderNo或total，返回購物車頁面
    useEffect(() => {
        if (!merchantOrderNo || !total) {
            navigate('/cart');
        }
    }, []);

    // 超商取貨不支援信用卡分期（藍新規範）
    const availablePaymentMethods = selectedShipping === 'CVS_PICKUP'
        ? PAYMENT_METHODS.filter(method => method.id !== 'CREDIT_INST')
        : PAYMENT_METHODS;

    // 若切換運送方式導致付款方式不可用，重設為信用卡
    useEffect(() => {
        const stillAvailable = availablePaymentMethods.find(m => m.id === selectedPayment);
        if (!stillAvailable) setSelectedPayment('CREDIT');
    }, [selectedShipping]);
    
    // 針對selectedPayment和selectedShipping建立Info物件
    const selectedPaymentInfo = PAYMENT_METHODS.find(m => m.id === selectedPayment);
    const selectedShippingInfo = SHIPPING_METHODS.find(m => m.id === selectedShipping);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrMsg('');

        try {
            // 這裡執行後端加密與導向模擬
            const payload = {
                merchantOrderNo,
                items,
                subtotal,
                shippingFee,
                total,
                couponDiscount: couponDiscount || 0,
                receiverName:   formData.receiverName,
                phone:          formData.phone,
                email:          formData.email,
                address:        selectedShipping === 'SELF_PICKUP' ? '門市自取' : formData.address,
                paymentMethod:  selectedPayment,
                shippingMethod: selectedShipping,
            }

            const res = await axiosClient.post('/api/payment/create-order', payload);
            const { MerchantID, TradeInfo, TradeSha, Version, PaymentUrl } = res.data;

            // 動態建立form --> POST給藍新金流
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = PaymentUrl;

            Object.entries({ MerchantID, TradeInfo, TradeSha, Version, MerchantOrderNo: merchantOrderNo })
                .forEach(([key, value]) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = value;
                    form.appendChild(input);
                });
            document.body.appendChild(form);

            // 跳轉藍新前存入 sessionStorage
            // 藍新導回時不一定帶參數，用 sessionStorage 確保訂單資訊不遺失
            sessionStorage.setItem('pendingOrder', JSON.stringify({
                merchantOrderNo,
                amt: total,
            }));

            form.submit(); // 離開前端，跳轉至藍新付款頁
        
            onReset();

        } catch (err) {
            console.error('建立訂單失敗:', err);
            setErrMsg('建立訂單失敗，請稍後再試');
            setIsSubmitting(false);
        }
    };

    /* 共用樣式 helper */
    const optionCard = (isSelected) =>
        `d-flex align-items-center gap-3 p-3 rounded-3 border ${
        isSelected ? 'border-primary bg-primary-50' : 'border-gray-200 bg-white'
        }`;

    const optionIcon = (isSelected) =>
        `d-flex align-items-center justify-content-center rounded-2 flex-shrink-0 ${
        isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-muted'
        }`;

    
    return (
        <div className="checkout-panel h-100 bg-gray-50 d-flex justify-content-center align-items-center py-5 py-md-8">
            <div className='container'>
                <button className="btn btn-link text-secondary mb-3 text-decoration-none d-flex align-items-center" onClick={() => navigate('/cart')}>
                    <ArrowLeft size={20} className='me-2' /> 返回購物車
                </button>
                <div className="row">

                    {/* 左欄 - 結帳表單: 收件人 + 運送方式 + 付款方式 */}
                    <div className="col col-lg-8 mb-4 mb-md-0">
                        <div className="card h-100 d-flex flex-column border-1 border-gray-200 py-4 py-md-6">
                            <form onSubmit={handleSubmit}>
                                <h5 className="text-primary fw-bold px-4 px-md-6 mb-4">收件人資訊</h5>

                                <div className='border-top border-gray-100 px-4 px-md-6 pb-4'>                                    
                                    <div className="form-row d-flex justify-content-between gap-4 pt-4">
                                        <div className="form-group col-md-5 mb-3 mb-md-4">
                                            <label className="small font-weight-bold text-muted mb-2">收件姓名</label>
                                            <input
                                                required
                                                className="form-control py-2"
                                                value={formData.receiverName}
                                                onChange={e => setFormData({ ...formData, receiverName: e.target.value })}
                                                placeholder="請輸入姓名"
                                            />
                                        </div>
                                        <div className="form-group col-md-5">
                                            <label className="small font-weight-bold text-muted mb-2">連絡電話</label>
                                            <input
                                                required
                                                className="form-control py-2"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="0912-345-678"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group mb-md-4 mb-3">
                                        <label className="small font-weight-bold text-muted mb-2">電子信箱</label>
                                        <input
                                            required
                                            type="email"
                                            className="form-control py-2"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="接收訂單通知"
                                        />
                                    </div>
                                    <div className="form-group mb-md-4">
                                        <label className="small font-weight-bold text-muted mb-2">
                                            收件地址
                                            {selectedShipping === 'SELF_PICKUP' && (
                                                <span className="text-muted fw-normal ms-2 small">（門市自取免填）</span>
                                            )}
                                        </label>
                                        <input
                                            required={selectedShipping !== 'SELF_PICKUP'}
                                            disabled={selectedShipping === 'SELF_PICKUP'}
                                            className={`form-control py-2 ${selectedShipping === 'SELF_PICKUP' ? 'bg-gray-100 text-muted' : ''}`}
                                            value={selectedShipping === 'SELF_PICKUP' ? '' : formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                            placeholder={selectedShipping === 'SELF_PICKUP' ? '門市自取免填' : '街道、門牌、樓層'}
                                        />
                                    </div>
                                </div>


                                {/* 運送方式 */}
                                <h5 className="border-top border-gray-100 text-primary fw-bold px-4 px-md-6 pt-4 mb-3">運送方式</h5>
                                <div className="px-4 px-md-6 pt-2 pb-6">
                                    <div className="d-flex flex-column gap-3">
                                        {SHIPPING_METHODS.map((method) => {
                                        const Icon = method.icon;
                                        const isSelected = selectedShipping === method.id;
                                        return (
                                            <label
                                            key={method.id}
                                            htmlFor={`ship-${method.id}`}
                                            className={optionCard(isSelected)}
                                            style={{ cursor: 'pointer', transition: 'all .15s' }}
                                            >
                                            <input
                                                type="radio"
                                                id={`ship-${method.id}`}
                                                name="shippingMethod"
                                                value={method.id}
                                                checked={isSelected}
                                                onChange={() => setSelectedShipping(method.id)}
                                                className="flex-shrink-0"
                                            />
                                            <div className={optionIcon(isSelected)} style={{ width: 40, height: 40 }}>
                                                <Icon size={20} />
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                                <span className={`fw-semibold small ${isSelected ? 'text-primary' : 'text-primary-900'}`}>
                                                    {method.label}
                                                </span>
                                                {method.badge && (
                                                    <span className="badge bg-primary-100 text-primary" style={{ fontSize: '10px' }}>
                                                    {method.badge}
                                                    </span>
                                                )}
                                                </div>
                                                <span className="text-muted" style={{ fontSize: '12px' }}>{method.sublabel}</span>
                                            </div>
                                            <span className="fw-semibold small text-success flex-shrink-0">
                                                {method.fee === 0 ? '免費' : `+NT$${method.fee}`}
                                            </span>
                                            </label>
                                        );
                                        })}
                                    </div>
                                </div>

                                {/* 付款方式 */}
                                <h5 className="border-top border-gray-100 text-primary fw-bold px-4 px-md-6 pt-4 mb-3">付款方式</h5>
                                <div className="px-4 px-md-6 pt-2">
                                    <div className="d-flex flex-column gap-3">
                                        {availablePaymentMethods.map((method) => {
                                            const Icon = method.icon;
                                            const isSelected = selectedPayment === method.id;
                                            return (
                                                <label
                                                key={method.id}
                                                htmlFor={`pay-${method.id}`}
                                                className={optionCard(isSelected)}
                                                style={{ cursor: 'pointer', transition: 'all .15s' }}
                                                >
                                                <input
                                                    type="radio"
                                                    id={`pay-${method.id}`}
                                                    name="paymentMethod"
                                                    value={method.id}
                                                    checked={isSelected}
                                                    onChange={() => setSelectedPayment(method.id)}
                                                    className="flex-shrink-0"
                                                />
                                                <div className={optionIcon(isSelected)} style={{ width: 40, height: 40 }}>
                                                    <Icon size={20} />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="d-flex align-items-center gap-2 flex-wrap">
                                                    <span className={`fw-semibold small ${isSelected ? 'text-primary' : 'text-primary-900'}`}>
                                                        {method.label}
                                                    </span>
                                                    {method.badge && (
                                                        <span className="badge bg-danger-light text-danger" style={{ fontSize: '10px' }}>
                                                        {method.badge}
                                                        </span>
                                                    )}
                                                    </div>
                                                    <span className="text-muted" style={{ fontSize: '12px' }}>{method.sublabel}</span>
                                                </div>
                                                <span
                                                    className={`badge flex-shrink-0 ${method.is_instant ? 'bg-success' : 'bg-secondary'}`}
                                                    style={{ fontSize: '10px' }}
                                                >
                                                    {method.is_instant ? '即時付款' : '非即時'}
                                                </span>
                                                </label>
                                            );
                                        })}
                                    </div>

                                    {/* 非即時付款警示 */}
                                    {selectedPaymentInfo && !selectedPaymentInfo.is_instant && selectedPaymentInfo.id !=="CREDIT_INST" && (
                                        <div className="alert alert-danger d-flex align-items-center gap-2 mt-3 py-2 small">
                                        <span><TriangleAlert size={16} /></span>
                                        <span>
                                            選擇<strong>「{selectedPaymentInfo.label}」</strong>後，系統將提供繳費代碼，
                                            請於 <strong>3 天內</strong>完成付款，逾期訂單將自動取消。
                                        </span>
                                        </div>
                                    )}
                                </div>



                                <div className="bg-gray-800 text-white p-6 mt-6 mx-4 mx-md-6 mb-4 border-0 rounded-4 rounded shadow">
                                    <div className="d-flex flex-column flex-md-row align-items-start justify-content-md-between align-items-md-center">
                                        <div className='mb-5 mb-md-0'>
                                            <p className="small mb-1 opacity-75">訂單編號</p>
                                            <code className="text-light small">{merchantOrderNo}</code>
                                        </div>

                                        <div className="text-right">
                                            <p className="small mb-1 opacity-75">應付總額</p>
                                            <h3 className="font-weight-bold mb-0 text-info">NT${total}</h3>
                                        </div>
                                    </div>
                                </div>
                                
                               {/* 送出表單按鈕 */}
                                <div className='d-flex justify-content-center align-items-center'>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-block btn-lg mt-4 p-4 fw-semibold fs-6 fs-md-2 shadow-sm rounded-4"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                            <Loader2 className="spinner-border spinner-border-sm mr-2 me-3" />
                                            金流加密安全連接中...
                                            </>
                                        ) : (
                                            <>
                                            <CreditCard className="mr-2 me-3" size={24} />
                                            確認支付並導向藍新金流
                                            </>
                                        )}
                                    </button>
                                </div>
                                
                                <p className="text-center text-muted small mt-3">※ 本次交易將離開商店進入加密付款環境</p>
                            </form>
                        </div>
                    </div>

                    {/* 右欄 - 結帳明細 */}
                    <div className="col col-lg-4 mb-4">
                        <div className="card h-auto border-1 border-gray-200 py-4 py-md-6">                      
                            <h6 className="fw-bold text-primary-900 px-4 mb-4">本次結帳明細</h6>         
                            
                            <div className="border-top border-gray-100 pt-3">
                                <div className="d-flex justify-content-between px-4 mb-2 small text-muted">
                                    <span>商品小計</span>
                                    <span>NT$${subtotal}</span>
                                </div>
                                <div className="d-flex justify-content-between px-4 mb-2 small text-muted">
                                    <span>物流費用</span>
                                    <span>{shippingFee === 0 ? '免費' : `NT$${shippingFee}`}</span>
                                </div>
                                {couponDiscount > 0 && (
                                    <div className="d-flex justify-content-between px-4 mb-2 small text-muted">
                                        <span>優惠折扣</span>
                                        <span>-NT$${couponDiscount}</span>
                                    </div> 
                                )}

                                <div className="d-flex justify-content-between border-top border-gray-100 pt-3 fw-semibold h5 mb-0 text-primary">
                                    <span className='px-4'>應付總額</span>
                                    <span className="fw-bold px-4">NT${total}</span>
                                </div>

                                
                                {/* 運送 + 付款摘要 */}
                                <div className="mx-4 mt-4 p-3 bg-gray-50 rounded-3 border border-gray-100">
                                    <div className="mb-3">
                                        <p className="small text-muted mb-1">運送方式</p>
                                        <div className="d-flex align-items-center gap-2">
                                            {selectedShippingInfo && (() => {
                                            const Icon = selectedShippingInfo.icon;
                                            return <Icon size={14} className="text-primary flex-shrink-0" />;
                                            })()}
                                            <span className="fw-semibold small text-primary-900">{selectedShippingInfo?.label}</span>
                                        </div>
                                        <p className="text-muted mb-0 mt-1" style={{ fontSize: '11px' }}>{selectedShippingInfo?.sublabel}</p>
                                    </div>
                                    <div className="border-top border-gray-100 pt-3">
                                        <p className="small text-muted mb-1">付款方式</p>
                                        <div className="d-flex align-items-center gap-2">
                                            {selectedPaymentInfo && (() => {
                                            const Icon = selectedPaymentInfo.icon;
                                            return <Icon size={14} className="text-primary flex-shrink-0" />;
                                            })()}
                                            <span className="fw-semibold small text-primary-900">{selectedPaymentInfo?.label}</span>
                                            <span
                                            className={`badge ms-auto ${selectedPaymentInfo?.is_instant ? 'bg-success' : 'bg-secondary'}`}
                                            style={{ fontSize: '10px' }}
                                            >
                                            {selectedPaymentInfo?.is_instant ? '即時' : '非即時'}
                                            </span>
                                        </div>
                                        <p className="text-muted mb-0 mt-1" style={{ fontSize: '11px' }}>{selectedPaymentInfo?.sublabel}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};