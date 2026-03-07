import { CreditCard, Building2, Store, Wifi, SplitSquareHorizontal } from 'lucide-react';
// 付款方式設定
/**
 * 藍新金流支付參數說明：
 * CREDIT=1 → 信用卡一次付清
 * VACC=1 → ATM 轉帳
 * CVS=1 → 超商代碼繳費
 * WEBATM=1 → 網路 ATM
 * InstFlag="3,6,12" → 信用卡分期（需同時開啟CREDIT）
*/

/* ──────────────────────────────────────────────────────────
   藍新金流付款方式清單
   tradeKey  → 後端組裝 TradeInfo 時的參數名稱
   tradeValue → 對應值（1 或分期字串 "3,6,12"）
   is_instant → 即時扣款(true) or 需自行繳費(false)
────────────────────────────────────────────────────────── */
export const PAYMENT_METHODS = [
    {
        id: 'CREDIT',
        label: '信用卡',
        sublabel: '一次付清，即時扣款',
        icon: CreditCard,
        tradeKey: 'CREDIT',
        tradeValue: 1,
        is_instant: true,
        badge: null,
    },
    // {
    //     id: 'CREDIT_INST',
    //     label: '信用卡分期',
    //     sublabel: '分期付款，可選擇3 / 6 / 12 期（依銀行規定）',
    //     icon: SplitSquareHorizontal,
    //     tradeKey: 'InstFlag',
    //     tradeValue: '3,6,12',
    //     is_instant: false,
    //     badge: '分期0利率',
    // },
    // {
    //     id: 'WEBATM',
    //     label: '網路 ATM',
    //     sublabel: '使用網銀帳號，即時轉帳',
    //     icon: Wifi,
    //     tradeKey: 'WEBATM',
    //     tradeValue: 1,
    //     is_instant: true,
    //     badge: null, 
    // },
    {
        id: 'VACC',
        label: 'ATM 轉帳',
        sublabel: '取得虛擬帳號後至 ATM 繳款',
        icon: Building2,
        tradeKey: 'VACC',
        tradeValue: 1,
        is_instant: false,
        badge: '3天內繳款',
    },
    {
        id: 'CVS',
        label: '超商代碼繳費',
        sublabel: '7-11 / 全家 / 萊爾富 / OK',
        icon: Store,
        tradeKey: 'CVS',
        tradeValue: 1,
        is_instant: false,
        badge: '3天內繳款',
    },
]