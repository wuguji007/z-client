// 優惠券設定
/**
 * 【商家使用說明】
 * type 欄位說明：
 * - 'coupon'：優惠券（顯示在 Modal 列表中，使用者可點擊選擇）
 * - 'code'：輸入代碼（不顯示在列表，僅能透過手動輸入使用）
 * 
 * 使用場景：
 * - 優惠券：公開活動、會員專屬、限時優惠（讓使用者看到並選擇）
 * - 輸入代碼：隱藏優惠、特殊獎勵、合作夥伴專屬（需知道代碼才能使用）
 */
export const COUPON_CONFIG = [
  // ── 優惠券設定 ──
  { 
    id: 'ZONAMA100',
    type: 'coupon',
    code: 'ZONAMA100',  
    discount: 100, 
    title: '8折 最高折抵 $100',
    minAmount: 0,
    validUntil: '2026.12.10'
  },
  { 
    id: 'SPRING200',
    type: 'coupon',
    code: 'SPRING200',  
    discount: 200, 
    title: '8折 最高折抵 $200',
    minAmount: 0,
    validUntil: '2026.12.10'
  },
  
  // ── 輸入代碼（隱藏，需手動輸入）──
  { 
    type: 'code',
    code: 'VIP500',     
    discount: 500, 
    description: 'VIP 會員專屬折抵 $500'
  },
  { 
    type: 'code',
    code: 'SECRET1000',     
    discount: 1000, 
    description: '神秘優惠折抵 $1000'
  },
];
