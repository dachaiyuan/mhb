import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import dva from '~/utils/dva'
import models from '~/models'
import Home from '~/pages/index'
import { noticeService } from '~/services'

import './app.less'

const dvaApp = dva.createApp({
  initialState: { },
  models: models,
});
const store = dvaApp.getStore();

class App extends Component {

  config = {
    pages: [
      'pages/start/index',
      'pages/start/user-privacy/index',
      'pages/home/index',
      'pages/user/index',
      'pages/user/personal/index',
      'pages/user/nickname/index',
      'pages/password/password-reset/index',
      'pages/password/password-update/index',
      'pages/password/password-getBack/index',
      // 转账
      'pages/transfer/index',
      'pages/transfer/transfer-confirm/index',
      'pages/transfer/scan/index',
      'pages/withdraw/index',
      'pages/withdraw/withdraw-confirm/index',
      'pages/exchange/index',
      'pages/rate/index',
      // 通知
      'pages/notice/index',
      'pages/notice/notice-full/index',

      'pages/bank/index',
      'pages/bank/bank-add/index',
      'pages/bank/bank-add-HK/index',
      // 'pages/start/index',
      'pages/login/index',
      // 收款
      'pages/gather/index',
      'pages/gather/gather-set/index',
      // 账单
      'pages/transaction/index',
      'pages/transaction/detail/index',
      // 安全中心
      'pages/safety/index',
      // 实名认证
      'pages/auth/index',
      'pages/auth/auth-person/index',
      'pages/auth/auth-company/index',
      'pages/auth/auth-company-HK/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '妙汇宝',
      navigationBarTextStyle: 'black',
    },
    tabBar: {
      color: '#574F5F',
      selectedColor: '#030FA1',
      backgroundColor: '#fff',
      list: [
        {
          pagePath: "pages/home/index",
          text: "首页",
          iconPath: 'assets/images/home.png',
          selectedIconPath: 'assets/images/home-fill.png'
        },
        {
          pagePath: "pages/user/index",
          text: "我的",
          iconPath: 'assets/images/user.png',
          selectedIconPath: 'assets/images/user-fill.png'
        }
      ]
    },
  }

  async componentWillMount() {
    const isLogin = Taro.getStorageSync('loginUserinfo');
    if (isLogin === '1') {
      console.log('已登录');
      Taro.reLaunch({ url: '/pages/home/index' });
      const { data } = await noticeService.acornPublicNotifications();
      if(data.mobile_image){
        Taro.reLaunch({ url: '/pages/notice/notice-full/index' });
      }
    } else {
      console.log('未登录');
      Taro.reLaunch({ url: '/pages/start/index' });
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Home />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
