import Taro from '@tarojs/taro';
import { c_cny, c_eur, c_gbp, c_jpy, c_usd } from '~/utils/imgs';

export default {
  state: {
    currencys: {
      'USD': {
        color: '#030FA1',
        symbol: '$',
        pic: c_usd,
      },
      'CNY': {
        color: '#704AFF',
        symbol: '¥',
        pic: c_cny,
      },
      'EUR': {
        color: '#9C5FF8',
        symbol: '€',
        pic: c_eur,
      },
      'GBP': {
        color: '#00A0E9',
        symbol: '￡',
        pic: c_gbp,
      },
      'JPY': {
        color: '#32DEC4',
        symbol: '¥',
        pic: c_jpy,
      },
    },
    regions: {
      CN: '中国',
      HK: '香港',
      US: '美国',
      JP: '日本',
      EU: '欧洲',
      GB: '英国'
    }
  },
  effects: { },
  reducers: {
    save(state, { payload }) {
      return Object.assign({}, state, payload)
    },
  }
}