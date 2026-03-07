import { useState, useMemo, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import VerifyPage from './pages/VerifyPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import MemberCenter from './pages/MemberCenter.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import PaymentCompletePage from './pages/PaymentCompletePage.jsx';


function App() {
  // const navigate = useNavigate();
  // useEffect(() => {
  //   // window.location.search 讀取 # 之前的 query string
  //   const params = new URLSearchParams(window.location.search);
  //   const redirect = params.get('redirect');
  //   const orderNo  = params.get('orderNo');
  //   const amt      = params.get('amt');

  //   if (redirect === 'payment-complete' && orderNo) {
  //     // 清除 URL 上的參數，再導向 Hash 路由的 payment-complete
  //     window.history.replaceState({}, '', window.location.pathname);
  //     navigate(`/payment-complete?orderNo=${orderNo}&amt=${amt}`);
  //   }
  // }, []);

  
  /* 註冊/登入/登出相關狀態管理 */
  const [verificationEmail, setVerificationEmail] = useState('');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  //登出功能
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  }


  /* 購物車/結帳相關狀態管理 */
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const STORAGE_KEY = 'zonama-cart';
  const [products, setProducts] = useState(() => {
    try {
      const savedProduct = localStorage.getItem(STORAGE_KEY);
      return savedProduct ? JSON.parse(savedProduct) : [];
    } catch (error) {
      console.log('無法從取得購物車資料:', error);
      return [];
    }
  });

  //products改變時自動更新localstorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);


  //加入購物車功能
  const handleAddToCart = (product) => {
    setProducts(prev => {
      // 檢查購物車是否已有此商品
      const isExists = prev.find(item => item.id === product.id);
      // 商品已存在? 在原有商品上增加數量：否則新增一個newProduct
      if (isExists) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      // 新增商品
      const newProduct = {
        id: product.id,
        category: product.category,
        image: product.image,
        title: product.title,
        price: Number(product.price),
        originalPrice: Number(product.origin_price),
        unit: product.unit,
        quantity: 1,
        checked: true
      };

      return [...prev, newProduct];
    });
  };


  // 結帳表單相關
  // const [merchantOrderNo] = useState(`ZNM${Date.now()}`);
  const [formData, setFormData] = useState({
    receiverName: '',
    phone: '',
    email: '',
    address: '',
  });

  // 結帳明細和商品數量計算
  const totals = useMemo(() => {
    const checkedItems = products.filter(prod => prod.checked);
    const originalTotal = checkedItems.reduce((acc, p) => acc + p.originalPrice * p.quantity, 0)
    const subTotal = checkedItems.reduce((acc, p) => acc + (p.price * p.quantity), 0);
    const savings = originalTotal - subTotal;
    const shipping = subTotal >= 1000 || subTotal === 0 ? 0 : 120;  // 運費滿千免運
    const totalAmount = subTotal + shipping - (selectedCoupon?.discount || 0);
    const allChecked = products.length > 0 && products.every(p => p.checked);
    const anyChecked = products.some(p => p.checked);
    return {
      // originalTotal,
      // subTotal,
      // savings,
      // shipping,
      // totalAmount,
      // allChecked,
      // anyChecked,
      cartTotalQuantity: products.reduce((acc, p) => acc + p.quantity, 0),
      // checkedCount: checkedItems.length
    }
  }, [products, selectedCoupon]);


  // 重置資料
  const handleReset = () => {
    setProducts([]);
    setFormData({ receiverName: '', phone: '', email: '', address: '' });
  };


  /* 保護路由 - 保護需要登入才能訪問的頁面 */
  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };  

  return (
    <>
      <div className="App">

        {/* isLoggedIn 根據是否有 Token 來決定顯示內容 */}
        <Header
          isLoggedIn={!!token}
          onLogout={handleLogout}
          cartCount={totals.cartTotalQuantity}
        />

        <div className="App-container">
          <Routes>
            <Route path="/" element={<HomePage handleAddToCart={handleAddToCart} />} />
            <Route path="/login" element={<LoginPage setToken={setToken} setUser={setUser} />} />
            <Route path='/register' element={<RegisterPage setVerificationEmail={setVerificationEmail} />} />
            <Route path='/verify' element={<VerifyPage />} />
            <Route path='/forgot-password' element={<ForgotPasswordPage />} />
            <Route path='/reset-password' element={<ResetPasswordPage />} />
            
            <Route
              path="/cart"
              element={
                <CartPage
                  products={products}
                  setProducts={setProducts}
                  totals={totals}
                  selectedCoupon={selectedCoupon}
                  checkLoggedIn={!!token}
                />
              }
            />
            
            <Route
              path='/checkout'
              element={
                <CheckoutPage
                  formData={formData}
                  setFormData={setFormData}
                  totals={totals}
                  onReset={handleReset}
                />
              }
            />

            <Route
              path='/payment-complete' 
              element={
                <PaymentCompletePage
                  formData={formData}
                  onReset={handleReset}
                />
              }
            />

            <Route
              path='/member-center'
              element={
                <MemberCenter user={user} />
                // <ProtectedRoute>
                
                // </ProtectedRoute>
              } />
              
          </Routes>
        </div>
        <Footer/>
      </div>
    </>
  )
}

export default App;
