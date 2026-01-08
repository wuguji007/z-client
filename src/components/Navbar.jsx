import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, ShoppingCart, CircleX, Mic } from "lucide-react"


const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleClear = () => {
        setQuery('');
    };

  return (
    <div className="container-fluid" style={{ maxWidth: '700px' }}>
      <div
        className={`
          d-flex align-items-center w-100 px-4 py-2 rounded-1 border border-1 bg-white
          ${isFocused ? 'shadow border-transparent' : 'shadow-sm border-light'}
        `}
        style={{
          height: '48px',
          transition: 'box-shadow 0.2s ease-in-out',
          borderColor: isFocused ? 'transparent' : '#dfe1e5' // Google 預設邊框色
        }}
      >
        {/* Search Icon */}
        <div className="d-flex align-items-center justify-content-center text-primary me-3">
          <Search size={20} />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="搜尋想要的商品"
          className="flex-grow-1 border-0 bg-transparent text-dark"
          style={{ 
            outline: 'none', 
            fontSize: '16px',
            boxShadow: 'none' // 移除 Bootstrap input 預設 focus 效果
          }}
        />

        {/* Right Side Icons (Clear & Mic) */}
        <div className="d-flex align-items-center ms-2">
          {/* Clear Button */}
          {query && (
            <button
              onClick={handleClear}
              className="btn btn-link text-secondary p-1 d-flex align-items-center text-decoration-none rounded-circle"
              style={{ width: '32px', height: '32px' }}
              aria-label="清除"
            >
              <CircleX size={22} />
            </button>
          )}

        </div>
      </div>
    </div>
  );
};


export default function NavBar() {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-white px-0 pb-0 mt-4 mb-2">
                <div className="container p-0">
                    <div className="container container-fluid d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center py-0">
                            <Link className="navbar-brand w-240 h-62" to="/">
                                <img src="./images/zonama-logo.svg" alt="logo" />
                            </Link>

                            {/* 搜尋欄 */}
                            <SearchBar />

                            {/* 購物車 */}
                            <div className="">
                                <button className="btn rounded-pill p-2">
                                    <Link className="text-primary" to="/cart">
                                        <ShoppingCart size={36} />
                                    </Link>                                        
                                </button>
                            </div>

                            {/* 登入/註冊 */}
                            <div className="ms-3">
                                <button className="btn border-primary rounded-pill p-0">
                                    <Link className="nav-link fw-bold text-primary py-4 px-7" to="/loggin">登入/註冊</Link>
                                </button>
                            </div>                        
                        </div>
                    </div>                               
                </div>
            </nav>
        </>

    )
}