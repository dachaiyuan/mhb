import Taro from '@tarojs/taro';
import fly from '~/utils/fly';
import api from '~/utils/api';

export default {
  async activities(){
    return fly.get(api.activities);
  }
}