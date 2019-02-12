import Taro from '@tarojs/taro';
import fly from '~/utils/fly';
import api from '~/utils/api';

export default {
  async banks(){
    return fly.get(api.bank);
  },
  async bankAdd(body){
    return fly.post(api.bank, body);
  },
  async bankAddSMS(data){
    return fly.post(`${api.bankAddSMS}?mobile=${data.mobile}`);
  }
}