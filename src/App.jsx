import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar'
import HomePage from './pages/HomPage.jsx';
import LogginPage from './pages/LogginPage.jsx';
import CartPage from './pages/CartPage.jsx';

function App() {

  return (
    <>
      <div className="App">
        <NavBar />
        <div className="App-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/loggin" element={<LogginPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
