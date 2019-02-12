import Taro from '@tarojs/taro';
import fly from '~/utils/fly';
import api from '~/utils/api';

export default {
  balances(){
    return fly.get(api.balances);
  },
  availableCurrencies(data){
    return fly.post(api.availableCurrencies, data)
  }
}