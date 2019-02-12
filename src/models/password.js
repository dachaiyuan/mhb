import Taro from '@tarojs/taro';
import modelExtend from 'dva-model-extend';
import { passwordService } from '~/services';
import base from './base';

export default modelExtend(base, {
  namespace: 'password',
  state: {
  },
  effects: {
    *passwordResetSMS({payload},{call}){
      return yield call(passwordService.passwordResetSMS, payload)
    },
    *passwordReset({payload},{call}){
      yield call(passwordService.passwordReset, payload)
    },
    *passwordUpdate({payload},{call}){
      yield call(passwordService.passwordUpdate, payload);
    }
  },
})