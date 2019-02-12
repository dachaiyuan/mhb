import Taro from '@tarojs/taro';
import fly from '~/utils/fly';
import api from '~/utils/api';

export default {
  async accountName(data){
    return fly.put(api.accountName,data);
  },
  async accountAvatar(data){
    return fly.put(api.accountAvatar,data);
  },
  accounts(params){
    return fly.get(api.accounts, params)
  },
  recentTransfer(params){
    return fly.get(api.recentTransfer, params)
  }
}