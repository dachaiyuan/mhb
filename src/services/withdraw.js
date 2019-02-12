import Taro from '@tarojs/taro';
import fly from '~/utils/fly';
import api from '~/utils/api';

export default {
  limitAmount(params){
    return fly.get(api.limitAmount, params)
  },
  withdrawPre(data){
    return fly.post(api.withdrawPre, data);
  },
  withdraw(data){
    return fly.post(api.withdraw, data);
  }
}