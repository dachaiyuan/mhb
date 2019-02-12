import Taro from '@tarojs/taro';
import modelExtend from 'dva-model-extend';
import { transferService } from '~/services';
import base from './base';

export default modelExtend(base, {
  namespace: 'transfer',
  state: {
    current: { },
    payee: {
      account_avatar: '',
      account_name: '',
      amount: '',
      currency: '',
      id: '',
      legal_name: '',
      mobile: '',
      url_prefix: '',
    }
  },
  effects: {
    *init(_,{put, select}){
      yield put.resolve({type:'global/balances'});
      const { balances } = yield select(state => state.global);
      if(balances.length) {
        yield put({type:'save',payload:{ current: balances[0]}});
        return balances[0].currency;
      }else{
        return '';
      }
    },
    *getCollections({payload},{call, put}){
      try{
        Taro.showLoading({ title: '识别中' })
        const { data: payee } = yield call(transferService.getCollections, payload);
        yield put({type:'save',payload: { payee }})
        Taro.hideLoading();
        return Promise.resolve()
      }catch(e){
        return Promise.reject()
      }
    },
    *scanTransfers({payload},{call, put}){
      try{
        yield call(transferService.scanTransfers, payload);
        yield put({type:'router/navigateBack', payload: { title: '转账成功' }})
      }catch(e){
        return Promise.resolve();
      }
    },
    *transfers({payload},{call,put}){
      try{
        yield call(transferService.transfers, payload);
        yield put({type:'router/navigateBack', payload: { title: '转账成功', url: '/pages/home/index' }})
      }catch(e){
        return Promise.resolve();
      }
    }
  },
})