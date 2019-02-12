import Taro, { Component } from '@tarojs/taro';
import { View, Image, Button, Text, Checkbox, CheckboxGroup } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import { connect } from '@tarojs/redux';
import imgs from '~/utils/imgs'
import './index.less';

@connect(() => ({}))
class Start extends Component {

  state = {
    btnDisabled: false,
  }
  code = '';
  componentDidMount(){
    this.initLoginCode();
  }
  initLoginCode = async () => {
    const { code } = await Taro.login();
    this.code = code;
  }
  goMobileLogin = () => {
    Taro.navigateTo({url:'/pages/login/index'})
  }
  onGetphonenumber = ({ detail: { errMsg, encryptedData, iv } }) => {
    const { dispatch } = this.props;
    if(errMsg === 'getPhoneNumber:ok'){
      Taro.checkSession({
        success: () => {
          dispatch({ type:'global/loginWeiXin', payload: { encrypted_data: encryptedData, iv, code: this.code } })
        },
        fail: async () => {
          await this.initLoginCode();
          dispatch({ type:'global/loginWeiXin', payload: { encrypted_data: encryptedData, iv, code: this.code } })
        }
      })
    }
  }
  onCheckChange = ({ detail: { value } }) => {
    this.setState({
      btnDisabled: !value.length
    })
  }
  onGoPage = () => {
    Taro.navigateTo({ url: '/pages/start/user-privacy/index' })
  }
  render() {
    const { btnDisabled } = this.state;
    return (
      <View class='container'>
        <Image class='logo' src={imgs.mhb} />
        <View class='opt'>
          <Button disabled={btnDisabled} open-type='getPhoneNumber' onGetphonenumber={this.onGetphonenumber}><AtIcon prefixClass='icon' value='wechat-fill' size='16'  color='#FFF' /><Text>{true?' 微信登录':''}</Text></Button>
          <Button disabled={btnDisabled} onClick={this.goMobileLogin}>
            <AtIcon prefixClass='icon' value='mobile-channel' size='16'  color='#FFF' />
            <Text>{true?' 手机登录':''}</Text>
          </Button>
        </View>
        <CheckboxGroup class='check' onChange={this.onCheckChange}>
            <Checkbox color='#2960EB' value checked />
            <Text onClick={this.onGoPage}>我已同意《用户协议和隐私政策》</Text>
        </CheckboxGroup>
      </View>
    );
  }
}

export default Start;