import { Truck, Store, Package} from 'lucide-react';
// 運送方式設定
/**
 * 藍新金流運送方式設定說明：
 * HOME_DELIVERY：宅配到府黑貓宅急便，預設選項
 * CVS_PICKUP：超商取貨7-11 / 全家
 * SELF_PICKUP：門市自取免運費
*/

export const SHIPPING_METHODS = [
  {
    id: 'HOME_DELIVERY',
    label: '宅配到府',
    sublabel: '黑貓宅急便，3-5 個工作天',
    icon: Truck,
    fee: 0,          // 費用由購物車計算決定，此處僅顯示用
    badge: '預設',
  },
  // {
  //   id: 'CVS_PICKUP',
  //   label: '超商取貨',
  //   sublabel: '7-11 / 全家，3-5 個工作天',
  //   icon: Store,
  //   fee: 60,
  //   badge: null,
  // },
  {
    id: 'SELF_PICKUP',
    label: '門市自取',
    sublabel: '台北門市，週一至週六 10:00-20:00',
    icon: Package,
    fee: 0,
    badge: '免運費',
  },
];
