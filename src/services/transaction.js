import Taro from '@tarojs/taro';
import fly from '~/utils/fly';
import api from '~/utils/api';

export default {
  transactions(params){
    return fly.get(api.transactions, params)
  },
  transactionDetail(params){
    return fly.get(api.transactionDetail.replace(':transactionType',params.transactionType).replace(':transactionId',params.id))
  }
}