
import Taro from '@tarojs/taro';
import modelExtend from 'dva-model-extend';
import base from './base';
// import { accountService, roleService } from '@/services';

export default modelExtend(base, {
  namespace: 'router',
  state: {
    limitForAuth:{
      '/pages/transfer/index': true,
      '/pages/withdraw/index': true,
      '/pages/exchange/index': true,
      '/pages/gather/index': true,
      '/pages/gather/gather-set/index': true,
      '/pages/bank/index': true,
    },
  },
  effects: {
    * navigateTo({ payload },{ put, select }){
      let { url, params = {} } = payload;
      let str = '';
      Object.keys(params).map( (key,index) => {
        index !== 0 && (str+='&');
        str+=`${key}=${encodeURIComponent(params[key])}`
      })
      url = `${url}?${str}`;
      
      const status = Taro.getStorageSync('loginUserinfo');
      if(!status){
        Taro.reLaunch({ url: '/pages/start/index' });
      }else{
        const { limitForAuth } = yield select(state => state.router);
        let flag = true;
        if(limitForAuth[payload.url]){
          flag = yield put.resolve({ type:'AuthLimit'})
        }
        if(flag){
          Taro.navigateTo({ url });
        }
      }


      // const { limitForAuth } = yield select(state => state.router);
      // let { url, params = {} } = payload;
      // let str = '';
      // Object.keys(params).map( (key,index) => {
      //   index !== 0 && (str+='&');
      //   str+=`${key}=${encodeURIComponent(params[key])}`
      // })
      // url = `${url}?${str}`;
      // // Taro.navigateTo({ url });


      // const status = wx.getStorageSync('loginUserinfo');
      // const urls = `${url}?params=${encodeURIComponent(JSON.stringify(params))}`;
      // if (status) {
      //   // 权限拦截
      //   let flag = true;
      //   if(this.limitForAuth[url]){
      //     flag = await this.AuthLimit();
      //   }
      //   if(flag){
      //     wx.navigateTo({ url: urls });
      //   }
      // } else {
      //   wx.navigateTo({ url: `/pages/login/main?url=${urls}` });
      // }
    },
    * redirectTo({ payload },{ }){
      let { url, params = {} } = payload;
      let str = '';
      Object.keys(params).map( (key,index) => {
        index !== 0 && (str+='&');
        str+=`${key}=${encodeURIComponent(params[key])}`
      })
      url = `${url}?${str}`;
      Taro.redirectTo({ url });
    },
    * navigateBack({ payload }){
      const { title="", icon = 'success', time = 1000, url, delta = 1 } = payload;
      yield Taro.showToast({ title, icon});
      yield new Promise( resolve => {
        setTimeout(() => {
          if (url) {
            Taro.reLaunch({url});
          } else {
            Taro.navigateBack({ delta });
          }
          resolve();
        }, time);
      })
    },
    *AuthLimit({}, { put }){
      let flag = yield Taro.getStorageSync('authStatus');
      if(flag != '1'){
        Taro.showLoading({title:'获取认证信息'})
        yield put.resolve({type:'global/account'});
        Taro.hideLoading()
        flag = Taro.getStorageSync('authStatus');
      }
      let content = '';
      flag == '0' && (content = '您未认证，无法使用此功能，是否前往认证？')
      flag == '-1' && (content = '您认证失败，无法使用此功能，是否前往继续认证？')
      if(flag == '-1' || flag == '0'){
        Taro.showModal({
          title: '提示',
          content,
          confirmText: '认证',
          confirmColor: '#EE5C63',
          success:({ confirm }) => {
            if(confirm){
              Taro.navigateTo({ url: `/pages/auth/index` });
            }
          }
        })
        return false;
      }else if(flag == '-2'){
        Taro.showToast({title:'您的实名认证申请还未通过，请您耐心等待', icon: 'none'})
      }else{
        return true;
      }
    }
  },
})