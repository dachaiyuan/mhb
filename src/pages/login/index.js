import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Image } from '@tarojs/components';
import { Minput, Mbutton } from '~/components';
import imgs from '~/utils/imgs'
import './index.less';

@connect(({loading}) => ({loading}))
class Login extends Component {
  config = {
    navigationBarTitleText: '手机登录',
  }
  form = {
    mobile: '',
    code: '',
  }
  onInputChange = (type,{ target: { value } }) => {
    this.form[type] = value;
  }
  onSendSMS = async resolve => {
    const { dispatch } = this.props;
    const { mobile } = this.form;
    if(mobile && mobile.length === 11){
      await dispatch({
        type: 'global/loginSMS',
        payload: { mobile }
      })
      resolve(true)
    }else{
      Taro.showToast({ title: '手机号格式不正确', icon: 'none' });
      resolve(false)
    }

  }

  login = () => {
    const { dispatch } = this.props;
    const { mobile, code } = this.form;
    if(mobile&&code){
      dispatch({
        type: 'global/login',
        payload: this.form
      })
    }else{
      Taro.showToast({ title: '请输入手机号及验证码', icon: 'none' })
    }
  }

  render() {
    const { loading } = this.props;
    return (
      <View class='container'>
        <Image class='logo' src={imgs.logo} />
        <View class='form'>
          <Minput onChange={this.onInputChange.bind(this,'mobile')} placeholder='请输入手机号' />
          <View class='checks'>
            <Minput onChange={this.onInputChange.bind(this,'code')} placeholder='请输入验证码' />
            <Mbutton onClick={this.onSendSMS} mode='timer' timer={120} type='secondary' width='240rpx'>发送验证码</Mbutton>
          </View>
          <View class='submit'>
            <Mbutton loading={loading.effects['global/login']} onClick={this.login}>登录</Mbutton>
          </View>
        </View>
      </View>
    );
  }
}

export default Login;