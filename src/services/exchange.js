import Taro from '@tarojs/taro';
import fly from '~/utils/fly';
import api from '~/utils/api';

export default {
  exchangeRateCurrent(){
    return fly.get(api.exchangeRateCurrent)
  },
  businessDatetime(params){
    return fly.get(api.businessDatetime, params)
  },
  exchange(data){
    return fly.post(api.exchange,data)
  },
  exchangeRates(params){
    return fly.get(api.exchangeRates,params)
  }
}