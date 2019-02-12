import Taro from '@tarojs/taro';
import modelExtend from 'dva-model-extend';
import { globalService, baseService } from '~/services';
import base from './base';

export default modelExtend(base, {
  namespace: 'global',
  state: {
    account: {
      id: '',
      avatar: '',
      mobile: '',
      name: '',
      pay_password_initialized: '',
      legal_entity_uploaded: '',
      legal_entity_id: '',
      legal_entity_status: '',
      legal_entity_type: '',
      legal_name: ''
    },
    constants: [],
    balances: [],
  },
  effects: {
    * loginSMS({payload},{call}){
      try{
        yield call(globalService.loginSMS, payload);
        yield Taro.showToast({ title: '验证码已发送' });
      }catch(e){
        return Promise.resolve();
      }
      
    },
    * login({payload},{call, put}){
      try{
        const { token_type, access_token } = yield call(globalService.login, payload);
        yield Taro.setStorageSync('token', `${token_type} ${access_token}`);
        const data = yield put.resolve({type:'notice/acornPublicNotifications'});
        if(data.mobile_image){
          Taro.reLaunch({ url: '/pages/notice/notice-full/index' });
        }else{
          Taro.reLaunch({ url: '/pages/home/index' });
        }
      }catch(e){
        return Promise.resolve()
      }
    },
    *loginWeiXin({payload},{call, put}){
      try{
        const { token_type, access_token } = yield call(globalService.loginWeiXin, payload);
        yield Taro.setStorageSync('token', `${token_type} ${access_token}`);
        const data = yield put.resolve({type:'notice/acornPublicNotifications'});
        if(data.mobile_image){
          Taro.reLaunch({ url: '/pages/notice/notice-full/index' });
        }else{
          Taro.reLaunch({ url: '/pages/home/index' });
        }
      }catch(e){
        return Promise.resolve()
      }
    },
    * account({payload},{call,put}){
      const { data: account } = yield call(globalService.account,payload);
      yield put({
        type: 'save',
        payload:{
          account
        }
      })
      return account;
    },
    * constants({payload},{call,put}){
      const { data: constants } = yield call(globalService.constants, payload);
      yield put({
        type: 'save',
        payload: {
          constants
        }
      })
    },
    * balances({payload},{call,put, select}){
      const { data } = yield call(baseService.balances, payload);
      const { currencys } = yield select(state => state.global);
      let balances = data.map( item => !!currencys[item.currency] && { ...item, ...currencys[item.currency] } );
      yield put({
        type: 'save',
        payload: {
          balances
        }
      });
      return balances;
    },

  },
})