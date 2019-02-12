import Taro from '@tarojs/taro';
import fly from '~/utils/fly';
import api from '~/utils/api';

export default {
  createCollections(body) {
    return fly.post(api.createCollections, body);
  }
}