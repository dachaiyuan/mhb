import Taro from '@tarojs/taro';
import Fly from 'flyio/dist/npm/wx'
import { HOST } from './constants'

var lastUrl = '';

const fly = new Fly();
fly.config.baseURL = HOST;
//添加请求拦截器
fly.interceptors.request.use( async (request) => {
  lastUrl = '';
  request.headers = {
    ['Authorization']: Taro.getStorageSync('token'),
    ['x-acorn-client']: 'weixin',
    ...request.headers
  }
  return request;
});

//添加响应拦截器
fly.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { response: { data: { errors } } } = error;
    const errorText = errors && errors[0].message;
    console.log(errors);
    switch (error.status) {
      case 401: {
        if( lastUrl !== '/pages/start/index' ){
          setTimeout(() => {
            Taro.showToast({ title: errorText||'', icon: 'none' })
          }, 1000);
          Taro.reLaunch({ url:'/pages/start/index' })
          lastUrl = '/pages/start/index'
        }
        return Promise.reject(false);
      }
      case 400: Taro.showToast({ title: errorText, icon: 'none' }); return Promise.reject(false);
      default: Taro.showToast({ title: errorText, icon: 'none' }); return error;
    }
  }
);


export default fly;