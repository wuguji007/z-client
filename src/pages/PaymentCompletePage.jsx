import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { PAYMENT_METHODS } from '../config/payment_methods';
import { SHIPPING_METHODS } from '../config/shipping_methods';
import { CheckCircle, XCircle, Loader2, Info } from 'lucide-react';
import axiosClient from '../api/axiosClient';


/*
    藍新金流付款完成後，以 GET 導回此頁（ReturnURL）
    URL 格式：/payment-complete?status=SUCCESS&orderNo=ZNM-xxx&amt=1234
  
    ReturnURL 是給使用者看的導頁，「實際訂單狀態更新」
    由後端 NotifyURL 非同步處理，兩者獨立。
    因此此頁不能直接信任 URL 的 status，
    而是去後端查詢訂單的 paymentStatus 做最終顯示。
*/

export default function PaymentCompletePage({ formData, onReset }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);

    // 從藍新 ReturnURL 帶回的參數
    const orderNo = searchParams.get('orderNo') || searchParams.get('MerchantOrderNO') || searchParams.get('merchantOrderNO') || '測試訂單編號';
    const urlStatus = searchParams.get('status'); // SUCCESS || FAILED
    const amt = searchParams.get('amt') || searchParams.get('Amt') || '0';


    // 查詢後端訂單資訊，以paymentStatus為準
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axiosClient.get(`/api/orders?orderNo=${orderNo}`);
                const list = res.data;
                if (Array.isArray(list) && list.length > 0) {
                    setOrder(list[0]);
                }
                // console.log('取得後端訂單資訊:', res.data);
            } catch (error) {
                console.error('無法取得訂單資訊:', error);
                setFetchError(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrder();
    }, [orderNo]);

    
    const paymentStatus = order?.paymentStatus || urlStatus || '未知狀態';
    const isPending = paymentStatus === 'PENDING'; // ATM/超商取號成立，待繳款
    const isSuccess = paymentStatus === 'SUCCESS';
    const displayAmt = order?.total || amt;
    const displayPaymentMethod = PAYMENT_METHODS.find(m => m.id === order?.paymentMethod)?.label || order?.paymentMethod || '';
    const displayShippingMethod = SHIPPING_METHODS.find(m => m.id === order?.shippingMethod)?.label || order?.shippingMethod || '';

    const handleGoHome = () => {
        onReset();
        navigate('/');
    };

    if (isLoading) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center gap-3" style={{ minHeight: '70vh' }}>
                <Loader2 className="spinner-border text-primary" size={40} />
                <p className="text-muted small">正在確認付款結果...</p>
            </div>
        );
    }

    // if (fetchError) {
    //     return (
    //         <div className="d-flex flex-column justify-content-center align-items-center gap-3" style={{ minHeight: '70vh' }}>
    //             <AlertCircle className="text-danger" size={40} />
    //             <p className="text-muted small">無法取得訂單資訊</p>
    //         </div>
    //     );
    // }

    return (
        <div className="complete-panel h-100 bg-light d-flex justify-content-center align-items-center py-5 py-md-8" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <div className='container my-5'>
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="card h-100 shadow border-0 rounded-4 p-5 p-md-7 text-center">
                            
                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mx-auto p-4 mb-3" >
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="fw-bold mb-2 text-primary">
                                訂單已成立
                            </h2>
                            <p className="small text-muted mb-5">
                                {isSuccess
                                ? '感謝您的購買，訂單確認信已寄至您的信箱'
                                :  <span>付款未完成，請至<strong>我的訂單</strong>查看訂單詳情</span>}
                            </p>

                            <div className="bg-primary-50 rounded-4 p-5 text-left mb-4 border-0">
                                <div className="d-flex justify-content-between small mb-3 text-muted">
                                    <span>訂單編號</span>
                                    <span className="font-weight-bold text-dark">{order?.merchantOrderNo || '_'}</span>
                                </div>
                                <div className="d-flex justify-content-between small mb-3 text-muted">
                                    <span>收件姓名</span>
                                    <span className="font-weight-bold text-dark">{order?.receiverName || '測試用戶'}</span>
                                </div>
                                {order?.shippingMethod && (
                                    <div className="d-flex justify-content-between small mb-3 text-muted">
                                        <span>運送方式</span>
                                        <span className="font-weight-bold text-dark">{displayShippingMethod}</span>
                                    </div>
                                )}
                                {order?.paymentMethod && (
                                    <div className="d-flex justify-content-between small mb-3 text-muted">
                                        <span>付款方式</span>
                                        <span className="font-weight-bold text-dark">{displayPaymentMethod}</span>
                                    </div>
                                )}
                                <div className="d-flex justify-content-between small mb-3 text-muted">
                                    <span>支付總額</span>
                                    <span className="text-primary font-weight-bold h6 mb-0">NT${Number(displayAmt).toLocaleString()}</span>
                                </div>
                            
                                <div className="d-flex justify-content-between small text-muted">
                                    <span>支付狀態</span>
                                    <span className={`badge px-2 py-1 ${ isPending? 'bg-danger-light text-danger':isSuccess ? 'bg-primary' : 'bg-danger-light text-danger'}`}>
                                        {isPending? '尚未付款' : isSuccess ? '付款成功' : '付款失敗'}
                                    </span>
                                </div>

                                {/* 非即時付款（ATM/超商）：顯示待付款說明 */}
                                {order?.paymentStatus === 'PENDING' && (
                                    <div className="alert alert-danger mt-4 mb-0 py-2 small">
                                        <Info size={16} className="me-2 mb-1" />
                                        您的訂單已成立，請於 <strong>3 天內</strong>完成付款。
                                    </div>
                                )}
                            </div>

                            {/* 查詢失敗提示 */}
                            {fetchError && (
                                <p className="text-muted small mb-3">
                                ⚠️ 無法即時查詢訂單狀態，請至「我的訂單」確認。
                                </p>
                            )}

                            {isSuccess ? (
                                <button
                                className="btn btn-primary btn-block btn-lg rounded-4 py-3 my-3 fw-semibold"
                                onClick={handleGoHome}
                                >
                                返回首頁
                                </button>
                            ) : (
                                <div className="d-flex flex-column gap-3 mt-3">
                                    <button
                                        className="btn btn-outline-primary btn-lg rounded-4 py-3 fw-semibold"
                                        onClick={() => navigate('/member-center')}
                                    >
                                        前往 <strong>我的訂單</strong> 查看訂單詳情
                                    </button>
                                    <button
                                        className="btn btn-link text-muted small"
                                        onClick={handleGoHome}
                                    >
                                        返回首頁
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>        
    );
}