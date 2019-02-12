import Taro from '@tarojs/taro';
import fly from '~/utils/fly';
import api from '~/utils/api';

export default {
  getCollections(params){
    return fly.get(api.getCollections.replace(':collection_id',params.id))
  },
  scanTransfers(body){
    return fly.post(api.scanTransfers, body);
  },
  transfers(body){
    return fly.post(api.transfers, body);
  }
}