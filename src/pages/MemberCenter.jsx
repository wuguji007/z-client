import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { 
  User, 
  Package, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  ChevronRight,
  ShoppingBag,
  Info,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  X,
  Wallet,
  Trash2
} from 'lucide-react';

export default function MemberCenter({ user: propUser }) {
    const [currentUser, setCurrentUser] = useState(propUser);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // all, pending, completed
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    // 分頁狀態 && Modal狀態
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
        if (propUser) {
            setCurrentUser(propUser);
        }
    }, [propUser]);


    useEffect(() => {
        const initMemberCenter = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                // alert('尚未登入，請先登入會員');
                // setTimeout(() => navigate('/login'), 1000);
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);

                let activeUser = currentUser;
                if (!activeUser) {
                    try {
                        const getUser = await axiosClient.get('/api/me');
                        activeUser = getUser.data;
                        setCurrentUser(activeUser);
                        console.log(currentUser);
                    } catch (error) {
                        console.error('身分驗證失敗', error);
                    }
                }

                //確認取得User後再call GET /api/orders
                if (activeUser) {
                    const res = await axiosClient.get('/api/orders');
                    //防禦編程 - check後端回傳資料是否為陣列
                    if (res.data) {
                        setOrders(Array.isArray(res.data) ? res.data : []);
                    }
                    console.log('取得訂單資訊:', res.data);
                    setOrders(res.data);
                }

            } catch (error) {
                console.error('無法進入會員中心', error);
            } finally {
                setLoading(false);
            }
        };

        initMemberCenter();
    }, [propUser]);


    // 付款方式動態切換
    const getPaymentMethodLabel = (method) => {
        switch (method) {
            case 'CREDIT': return '信用卡';
            case 'CREDIT_INST': return '信用卡分期';
            case 'WEBATM': return 'Web ATM';
            case 'VACC': return 'ATM 轉帳';
            case 'CVS': return '超商代碼繳費';
            default: return method || '未指定';
        }
    };

    // Modal互動邏輯：處理外部點擊與 Esc 鍵
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowModal(false);
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                setShowModal(false);
            }
        };

        if (showModal) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
            // 禁止背景捲動
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        };
    }, [showModal]);

    // 篩選訂單
    const filteredOrders = orders.filter(order => {
        if (activeTab === 'pending') return order.paymentStatus === 'PENDING';
        if (activeTab === 'success') return order.paymentStatus === 'SUCCESS';
        return true;
    });

    // 分頁Pagination
    const totalPages = Math.ceil(filteredOrders.length / pageSize);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );
    // 訂單Tab
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    //格式化日期
    const formatDate = (dateSrting) => {
        if (!dateSrting) return 'null';
        return new Date(dateSrting).toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    //訂單狀態badge
    const getStatusBadge = (status) => {
        switch (status) {
            case 'SUCCESS':
                return (
                    <span className="badge rounded-pill bg-success-subtle text-success border border-success px-3">
                        <CheckCircle size={12} className="me-1" /> 已付款
                    </span>
                );
            case 'PENDING':
                return (
                    <span className="badge rounded-pill bg-danger-subtle text-danger-emphasis border border-warning px-3">
                        <Clock size={12} className="me-1" /> 尚未付款
                    </span>
                );
            case 'FAILED':
                return (
                    <span className="badge rounded-pill bg-danger-subtle text-danger border border-danger px-3">
                        <X size={12} className="me-1" /> 付款失敗
                    </span>
                );
            default:
                return <span className="badge rounded-pill bg-secondary px-3">{status}</span>;
        }
    };

    // 處理載入中狀態，避免讀取 null 的屬性
    if (loading) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status"></div>
                    <p className="text-muted">資料同步中，請稍候...</p>
                </div>
            </div>
        );
    }

    // 處理未登入狀態
    if (!currentUser) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
                <div className="card shadow-sm p-5 text-center border-0" style={{ maxWidth: '400px' }}>
                    <div className="mb-4">
                        <i className="bi bi-shield-lock text-primary" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h4 className="fw-bold mb-3">無查看權限</h4>
                    <p className="text-muted mb-4">請先登入您的會員帳號，以查看訂單紀錄與個人資料。</p>
                    <button className="btn btn-primary w-100 py-2 shadow-sm" onClick={() => navigate('/login')}>
                        立即前往登入
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* <div className='h-100 bg-light d-flex justify-content-center align-items-center py-5 py-md-8' style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }} >
                <div className="container">
                    <div className="card shadow">
                    <div className="card-header bg-primary text-white">會員中心</div>
                    <div className="card-body">
                        <h3>歡迎回來, {user?.username}</h3>
                        <p>Email: {user?.email}</p>
                        <p>這是只有登入會員才能看到的頁面。</p>
                    </div>
                    </div>
                </div>
            </div> */}
            
            <div className='min-vh-100 bg-light py-5' style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
                <div className="container">
                    <div className="row g-4">
                        {/* 左側：會員卡片 */}
                        <div className="col-lg-4">
                            <div className="card rounded-4 shadow border-0 h-auto">
                                <div className="card-header bg-primary text-white py-3 border-0 rounded-top">
                                    <h5 className="mb-0 fw-bold d-flex align-items-center">
                                        <User size={20} className="me-2" /> 會員中心
                                    </h5>
                                </div>                                
                                <div className="card-body text-center py-5">
                                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '90px', height: '90px' }}>
                                        <span className="h1 mb-0 text-primary fw-bold">
                                            {currentUser?.username?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <h4 className="fw-bold mb-1">{currentUser?.username}</h4>
                                    <p className="text-muted small mb-4">{currentUser?.email}</p>
                                    <hr className="my-4 opacity-50" />
                                    <div className="text-start small px-2">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">身分狀態</span>
                                            <span className="fw-bold">{currentUser?.isVerified ? '已驗證' : '待驗證'}</span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span className="text-muted">會員等級</span>
                                            <span className="fw-bold text-primary">一般會員</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 右側：訂單清單 */}
                        <div className="col-lg-8">
                            <div className="card shadow border-0 rounded-4 overflow-hidden">
                                <div className="card-header bg-white border-0 pt-4 px-4">
                                    <h5 className="fw-bold mb-4 d-flex align-items-center text-dark text-lg md:text-xl">
                                        <Package size={22} className="me-2 text-primary" /> 我的訂單紀錄
                                    </h5>

                                    <ul className="nav nav-pills nav-fill bg-light bg-opacity-50 rounded p-1 mb-2 d-flex gap-2">
                                        <li className="nav-item">
                                            <button 
                                            className={`nav-link border-0 py-2 text-xs md:text-sm ${activeTab === 'all' ? 'active bg-primary shadow-sm text-white' : 'text-muted'}`} onClick={() => handleTabChange('all')}>所有訂單</button>
                                        </li>
                                        <li className="nav-item">
                                            <button className={`nav-link border-0 py-2 text-xs md:text-sm ${activeTab === 'pending' ? 'active bg-primary shadow-sm text-white' : 'text-muted'}`} onClick={() => handleTabChange('pending')}>尚未付款</button>
                                        </li>
                                        <li className="nav-item">
                                            <button className={`nav-link border-0 py-2 text-xs md:text-sm ${activeTab === 'success' ? 'active bg-primary shadow-sm text-white' : 'text-muted'}`} onClick={() => handleTabChange('success')}>完成訂單</button>
                                        </li>
                                    </ul>
                                </div>

                                <div className="card-body p-0">
                                    {paginatedOrders.length === 0 ? (
                                        <div className="py-5 text-center text-muted">
                                            <ShoppingBag size={56} className="mx-auto mb-3 opacity-25" />
                                            <p className="text-sm md:text-base">目前查無符合條件的訂單</p>
                                        </div>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-hover align-middle mb-0">
                                                <thead className="bg-light bg-opacity-50">
                                                    <tr className="text-xs md:text-sm">
                                                        <th className="ps-4 py-3 text-secondary fw-bold border-bottom">訂單編號 / 日期</th>
                                                        <th className="py-3 text-secondary fw-bold text-center border-bottom">金額</th>
                                                        <th className="py-3 text-secondary fw-bold text-center border-bottom">付款方式</th>
                                                        <th className="py-3 text-secondary fw-bold text-center border-bottom">付款狀態</th>
                                                        <th className="pe-4 py-3 text-end border-bottom"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-xs md:text-sm lg:text-base">
                                                    {paginatedOrders.map((order) => (
                                                        <tr key={order.id} className="transition-all">
                                                            <td className="ps-4 py-4">
                                                                <div className="fw-bold text-dark">{order.merchantOrderNo}</div>
                                                                <div className="small text-muted d-flex align-items-center mt-1">
                                                                    <Calendar size={12} className="me-1 opacity-75" />
                                                                    {formatDate(order.createdAt)}
                                                                </div>
                                                            </td>
                                                            <td className="py-4 text-center">
                                                                <div className="fw-bold text-primary">${order.total?.toLocaleString()}</div>
                                                            </td>
                                                            <td className="py-4 text-center">
                                                                <span className="text-muted small md:text-sm">{getPaymentMethodLabel(order.paymentMethod)}</span>
                                                            </td>
                                                            <td className="py-4 text-center">
                                                                {getStatusBadge(order.paymentStatus)}
                                                            </td>
                                                            <td className="pe-4 py-4 text-end">
                                                                <button 
                                                                    className="btn btn-sm btn-primary px-2 rounded-2 fw-medium"
                                                                    onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                                                                >
                                                                    <ChevronRight size={18} className=" d-md-inline" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                {/* Pagination分頁 */}
                                {totalPages > 1 && (
                                    <div className="card-footer bg-white border-0 py-4">
                                        <nav>
                                            <ul className="pagination pagination-sm justify-content-center mb-0 gap-2">
                                                {/* 左導引按鈕 */}
                                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                    <button 
                                                        className="page-link shadow-none" 
                                                        onClick={() => setCurrentPage(p => p - 1)}
                                                        disabled={currentPage === 1}
                                                    >
                                                        <ChevronLeft size={18} className={currentPage === 1 ? 'text-muted' : 'text-primary'} />
                                                    </button>
                                                </li>
                                                
                                                {[...Array(totalPages)].map((_, i) => (
                                                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                                        <button 
                                                            className="page-link" 
                                                            onClick={() => setCurrentPage(i + 1)}
                                                        >
                                                            {i + 1}
                                                        </button>
                                                    </li>
                                                ))}

                                                {/* 右導引按鈕 */}
                                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                    <button 
                                                        className="page-link shadow-none" 
                                                        onClick={() => setCurrentPage(p => p + 1)}
                                                        disabled={currentPage === totalPages}
                                                    >
                                                        <ChevronRight size={18} className={currentPage === totalPages ? 'text-muted' : 'text-primary'} />
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 訂單詳情Modal */}
                {showModal && selectedOrder && (
                    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
                        <div className="modal-dialog modal-lg modal-dialog-centered px-3">
                            <div ref={modalRef} className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                                {/* Modal Header */}
                                <div className="modal-header bg-primary-50 border-0 py-3 px-4">
                                    <h5 className="modal-title text-primary fw-bold d-flex align-items-center text-sm md:text-lg">
                                        <Info size={20} className="me-2 text-primary" /> 訂單詳細資訊
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                
                                <div className="modal-body p-3 p-md-4">
                                    {/* 訂單摘要 */}
                                    <div className="row g-2 g-md-3 mb-4">
                                        <div className="col-md-6">
                                            <div className="p-3 bg-gray-50 rounded-3 h-100 border border-light">
                                                <small className="text-muted d-block mb-1 text-xs fw-bold">訂單編號</small>
                                                <span className="fw-bold text-dark text-xs md:text-sm">{selectedOrder.merchantOrderNo}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="p-3 bg-gray-50 rounded-3 h-100 border border-light">
                                                <small className="text-muted d-block mb-1 text-xs fw-bold">付款方式</small>
                                                <span className="fw-bold d-flex align-items-center gap-1 text-primary text-xs md:text-sm">
                                                    <Wallet size={14} /> {getPaymentMethodLabel(selectedOrder.paymentMethod)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-md-4 pt-md-2">
                                            <small className="text-muted d-block px-2 text-xs">建立日期</small>
                                            <div className="small px-2 fw-medium text-xs md:text-sm">{formatDate(selectedOrder.createdAt)}</div>
                                        </div>
                                        <div className="col-md-4 pt-md-2">
                                            <small className="text-muted d-block px-2 text-xs">付款日期</small>
                                            <div className="small px-2 fw-medium text-xs md:text-sm">
                                                {selectedOrder.paymentStatus === 'SUCCESS' ? formatDate(selectedOrder.paidAt) : '尚未付款'}
                                            </div>
                                        </div>
                                        <div className="col-md-4 pt-md-2">
                                            <small className="text-muted d-block px-2 mb-1 text-xs">目前狀態</small>
                                            <div className="px-2">{getStatusBadge(selectedOrder.paymentStatus)}</div>
                                        </div>
                                    </div>

                                    {/* 收件人資訊 */}
                                    <div className="mb-4">
                                        <div className="bg-primary-50 px-3 py-2 border-start border-4 border-primary mb-3 rounded-2">
                                            <span className="fw-bold small text-primary d-flex align-items-center">
                                                <MapPin size={14} className="me-2" /> 收件資訊
                                            </span>
                                        </div>
                                        <div className="row g-3 px-2 text-dark">
                                            <div className="col-md-6">
                                                <small className="text-muted d-block text-xs">收件姓名</small>
                                                <div className="fw-medium text-xs md:text-sm">{selectedOrder.receiverName}</div>
                                            </div>
                                            <div className="col-md-6">
                                                <small className="text-muted d-block text-xs">連絡電話</small>
                                                <div className="fw-medium text-xs md:text-sm">{selectedOrder.phone}</div>
                                            </div>
                                            <div className="col-md-6">
                                                <small className="text-muted d-block text-xs">電子信箱</small>
                                                <div className="fw-medium text-xs md:text-sm text-truncate">{selectedOrder.email}</div>
                                            </div>
                                            <div className="col-md-6">
                                                <small className="text-muted d-block text-xs">配送地址</small>
                                                <div className="fw-medium text-xs md:text-sm">{selectedOrder.address}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 購買商品清單 */}
                                    <div className="border border-1 rounded-3 overflow-hidden">
                                        <div className="bg-gray-50 px-3 py-3 d-flex align-items-center">
                                            <ShoppingBag size={16} className="me-2 text-primary" />
                                            <span className="fw-bold small text-primary">購買商品清單</span>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table table-sm mb-0 align-middle">
                                                <thead className="bg-white">
                                                    <tr className="text-xs border-bottom">
                                                        <th className="ps-3 py-2 fw-bold">商品名稱</th>
                                                        <th className="py-2 text-end fw-bold">單價</th>
                                                        <th className="py-2 text-end fw-bold">數量</th>
                                                        <th className="pe-3 py-2 text-end fw-bold">小計</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white text-sm">
                                                    {selectedOrder.items?.map((item, idx) => (
                                                        <tr key={idx} className="border-bottom border-light">
                                                            <td className="ps-3 py-3">
                                                                <div className="fw-bold text-dark">{item.title || item.name}</div>
                                                                <div className="text-muted" style={{ fontSize: '10px' }}>ID: {item.id}</div>
                                                            </td>
                                                            <td className="py-3 text-end text-muted">${item.price?.toLocaleString()}</td>
                                                            <td className="py-3 text-end text-muted">x{item.quantity}</td>
                                                            <td className="pe-3 py-3 text-end fw-bold text-dark">${(item.price * item.quantity).toLocaleString()}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-gray-50 bg-opacity-50 text-xs md:text-sm">
                                                    <tr className="border-light">
                                                        <td colSpan="3" className="ps-3 text-end py-2 text-muted">商品小計</td>
                                                        <td className="pe-3 text-end py-2 fw-medium text-dark">${selectedOrder.subtotal?.toLocaleString()}</td>
                                                    </tr>
                                                    {(selectedOrder.subtotal + selectedOrder.shippingFee - selectedOrder.total) > 0 && (
                                                        <tr className="border-light">
                                                            <td colSpan="3" className="ps-3 text-end py-1 text-primary">優惠折扣</td>
                                                            <td className="pe-3 text-end py-1 fw-bold text-primary">-${(selectedOrder.subtotal + selectedOrder.shippingFee - selectedOrder.total).toLocaleString()}</td>
                                                        </tr>
                                                    )}
                                                    <tr className="border-light">
                                                        <td colSpan="3" className="ps-3 text-end py-1 text-muted">運費</td>
                                                        <td className="pe-3 text-end py-1 fw-medium text-dark">
                                                            {selectedOrder.shippingFee === 0 ? '免運' : `$${selectedOrder.shippingFee?.toLocaleString()}`}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan="3" className="ps-3 text-end py-3 fw-bold text-dark" style={{ fontSize: '0.95rem' }}>總計金額</td>
                                                        <td className="pe-3 text-end py-3 fw-bold text-primary" style={{ fontSize: '1.25rem' }}>NT$ {selectedOrder.total?.toLocaleString()}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer border-0 p-4 pt-0 d-flex justify-content-end">
                                    <div className="d-flex align-items-center gap-2">                                   
                                        {/* 提示訊息 */}
                                        {selectedOrder.paymentStatus === 'PENDING' && (selectedOrder.paymentMethod === 'CVS' || selectedOrder.paymentMethod === 'VACC') && (
                                            <div className="text-danger text-xs d-flex align-items-center ms-2">
                                                <Info size={14} className="me-1 opacity-75" />
                                                <span>請於繳費期限內完成付款</span>
                                            </div>
                                            )}
                                            
                                        <button type="button" className="btn btn-light px-4 rounded-pill text-xs md:text-sm" onClick={() => setShowModal(false)}>關閉</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}