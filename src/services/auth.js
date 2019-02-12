import Taro from '@tarojs/taro';
import fly from '~/utils/fly';
import api from '~/utils/api';

export default {
  fontOCR(data){
    return fly.post(api.fontOCR, data);
  },
  backOCR(data){
    return fly.post(api.backOCR, data);
  },
  companyOCR(data){
    return fly.post(api.companyOCR, data);
  },
  legalentity(data){
    return fly.post(api.legalentity, data)
  }
}