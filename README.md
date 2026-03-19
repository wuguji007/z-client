# Zonama Ecommerce — 電商購物平台

> 全端電子商務網站，採用 **React 19** 與 **Vite** 打造流暢的前端體驗，後端運用 **JSON Server** 快速構建 RESTful API，並完整實作 **JWT 身分驗證**與**藍新第三方金流 (NewebPay)** 串接，提供安全、完整且順暢的購物與結帳流程。

---

## 🌐 線上 Demo & 資源

| 項目 | 連結 |
|------|------|
| 🔗 Live Demo | [https://wuguji007.github.io/z-client/](https://wuguji007.github.io/z-client/) |
| 💻 Frontend Repo | [z-client (GitHub)](https://github.com) |
| 🗄️ Backend Repo | [z-server (GitHub)](https://github.com) |

---

## 🛠️ 技術棧 Tech Stack

| 類別 | 技術與工具 |
|------|-----------|
| 前端框架 | React 19, Vite |
| 樣式與 UI | Bootstrap 5, Sass（模組化管理）, Swiper React |
| 後端架構 | Node.js, Express（客製化路由）, JSON Server |
| 核心機制 | RESTful API, JWT（無狀態身分驗證）, Axios |
| 第三方服務 | 藍新金流 (NewebPay) API |
| 部署 | GitHub Pages（前端）/ 雲端平台（後端）|

---

## ✨ 核心專案亮點 Key Highlights

### 1. 💳 藍新金流 (NewebPay) 完整串接

突破一般純前端專案的限制，完整實作了真實環境的第三方支付金流：

#### 後端加密機制
在 Node.js 中實作 `newebpayUtils.js`，處理藍新金流嚴格的 **AES-256-CBC 加密**與 **SHA-256 雜湊簽章**邏輯，確保交易資料 `TradeInfo` 的安全性。

#### 前端無縫導轉
前端取得加密字串後，動態生成 Form 表單並自動 Submit，順暢引導使用者至藍新付款頁面。

#### 交易狀態更新
後端自訂 API 路由接收藍新 Server-to-Server 的背景通知（`NotifyURL`），動態解密並更新 `db.json` 中的訂單付款狀態。

---

### 2. 🛡️ JWT 無狀態身分驗證與路由保護

#### 安全登入機制
整合 `json-server-auth` 實作使用者註冊與登入，後端核發 JWT Token，落實無狀態（Stateless）身分驗證。

#### Axios 攔截器 (Interceptors)
前端封裝 Axios，自動在發送需授權的 API 請求時，於 Header 夾帶 Bearer Token。

#### 受保護的路由 (Protected Routes)
前端利用 React Router 實作路由守衛，未登入使用者無法訪問以下頁面，保護用戶隱私資料：

- 🛒 購物車 `CartPage`
- 💰 結帳頁 `CheckoutPage`
- 👤 會員中心 `MemberCenter`

---

### 3. ⚙️ RESTful API 與客製化後端邏輯

#### RESTful 架構
利用 JSON Server 建立標準的 `GET`、`POST`、`PUT`、`PATCH`、`DELETE` 介面，管理以下資源：

- 🏷️ 商品 Products
- 🛒 購物車 Cart
- 📦 訂單 Orders

#### 客製化 Middleware
透過 `server.js` 攔截並自訂複雜的業務邏輯，包含：

- 結帳時合併購物車資料生成訂單
- 計算總價、套用優惠券邏輯
- 同步清除購物車

展現超越單純 Mock Server 的後端開發能力。

---

### 4. ⚡ 現代化前端架構與極致效能

#### React 19 & Vite
採用最新的 React 版本搭配 Vite，享受極速的冷啟動與熱重載（HMR）開發體驗，並優化生產環境的打包體積。

#### Sass + Bootstrap 5
抽離並客製化 Bootstrap 變數（`_variables.scss`、`_variables-dark.scss`），打造具備品牌識別度（`#00F5FF`、`#BF5AF2`）的全站響應式設計（RWD），確保在手機、平板與桌機皆有完美視覺呈現。

---

## 📂 專案目錄架構

專案分為**前端 (z-client)** 與**後端 (z-server)** 雙儲存庫架構。

### Frontend — z-client

```
z-client/
├── public/                 # 靜態資源 (SVG, Icons)
├── src/
│   ├── api/                # Axios 實體封裝與 API 請求模組
│   ├── assets/             # Sass 樣式檔 (架構化管理)
│   ├── components/         # 共用 UI 元件 (Header, Footer, HeroSwiper...)
│   ├── config/             # 網站靜態設定檔 (運費、付款方式、優惠券)
│   ├── pages/              # 頁面級元件 (Home, Login, Cart, Checkout...)
│   ├── utils/              # 工具函式 (Image Helper 等)
│   ├── App.jsx             # 路由設定與全域狀態管理
│   └── main.jsx            # React 進入點
└── vite.config.js          # Vite 專案設定
```

### Backend — z-server

```
z-server/
├── utils/
│   └── newebpayUtils.js    # 藍新金流 AES/SHA256 加解密核心邏輯
├── db.json                 # JSON Server 資料庫 (模擬 Users, Products, Orders)
├── server.js               # Express 伺服器進入點、客製化 API 路由與金流回傳處理
└── test_decrypt.js         # 金流加解密測試腳本
```

---

## 🚀 本地開發啟動指南

### Step 1 — 啟動後端伺服器 (z-server)

```bash
# 進入後端目錄
cd z-server

# 安裝依賴套件
npm install

# 設定環境變數（需填入您申請的藍新金流測試 API Key、IV 與商店代號）
# 建立 .env 檔案並寫入相關設定
echo "HASH_KEY=您的HashKey"     > .env
echo "HASH_IV=您的HashIV"      >> .env
echo "MERCHANT_ID=您的商店代號" >> .env

# 啟動伺服器（預設運行於 http://localhost:3000）
npm start
# 或使用
node server.js
```

### Step 2 — 啟動前端開發環境 (z-client)

```bash
# 開啟新的終端機，進入前端目錄
cd z-client

# 安裝依賴套件
npm install

# 啟動 Vite 開發伺服器（預設運行於 http://localhost:5173）
npm run dev
```
