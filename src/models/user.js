import Taro from '@tarojs/taro';
import modelExtend from 'dva-model-extend';
import { userService, globalService } from '~/services';
import base from './base';

export default modelExtend(base, {
  namespace: 'user',
  state: {
    avatar: '',
    findUsers: {},
    recentUser:[]
  },
  effects: {
    *init(_,{put}){
      yield put({type:'global/account'});
      yield put({type:'global/balances'});
    },
    * accountName({payload},{call, put}){
      yield call(userService.accountName,payload);
      yield put( { type: 'router/navigateBack', payload: { title: '设置成功' } } )
    },
    * uploadAvatar({payload},{call,put,select}){
      const { account: { id:accountId } } = yield select(state => state.global);
      const avatar = yield call(globalService.upload,{ ...payload, accountId, imageSrc: 'avatar' });
      yield call(userService.accountAvatar,{ avatar });
      yield put({type:'global/account'});
      Taro.showToast({title:'设置成功'});
    },
    * accounts({payload},{call,put}){
      try{
        const { data } = yield call(userService.accounts, payload);
        if(data.length){
          yield put({
            type:'save',
            payload: {
              findUsers: data[0]
            }
          })
        }
      }catch(e){
        return Promise.resolve()
      }
    },
    * recentTransfer({payload}, {call,put}){
      const { data } = yield call(userService.recentTransfer, payload);
      yield put({type:'save',payload:{ recentUser: data.map( user => ({...user,id:user.account_id})) }})
    }
  },
})