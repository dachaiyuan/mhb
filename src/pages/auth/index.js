import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Text } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import { authCard } from '~/utils/imgs'
import './index.less';

@connect(() => ({}))
class Auth extends Component {
  config = {
    navigationBarTitleText: '认证中心',
  }
  render() {
    return (
      <View class='container top-line'>
        <View class='card' style={{backgroundImage: `url(${authCard})`}}>
          <View>
            <View class='title'>妙汇宝提示您：</View>
            <View>个人用户：请您准备好个人身份证</View>
            <View>企业用户：请您准备好<Text class='primary-color'>法人</Text>身份证及营业执照</View>
          </View>
        </View>
        <View class='auth-list'>
          <View class='auth' onClick={this.props.dispatch.bind(this, { type: 'router/navigateTo', payload: { url: '/pages/auth/auth-person/index' } })}>
            <View><AtIcon prefixClass='icon' value='xiangji'  color='#2960EB'></AtIcon></View>
            <View class='content flex1'>
              <View class='f30 bold'>实名认证</View>
              <View class='f20 info-color'>上传证件照片，保证资金安全</View>
            </View>
            <View>去认证</View>
          </View>
          <View class='auth' onClick={this.props.dispatch.bind(this, { type: 'router/navigateTo', payload: { url: '/pages/auth/auth-company/index' } })} >
            <View><AtIcon prefixClass='icon' value='xiangji'  color='#2960EB'></AtIcon></View>
            <View class='content flex1'>
              <View class='f30 bold'>企业认证</View>
              <View class='f20 info-color'>上传证件照片，保证资金安全</View>
            </View>
            <View>去认证</View>
          </View>
          <View class='auth' onClick={this.props.dispatch.bind(this, { type: 'router/navigateTo', payload: { url: '/pages/auth/auth-company-HK/index' } })}>
            <View><AtIcon prefixClass='icon' value='xiangji'  color='#2960EB'></AtIcon></View>
            <View class='content flex1'>
              <View class='f30 bold'>企业认证（香港）</View>
              <View class='f20 info-color'>请上传<Text class='primary-color'>股份最大持有者证件</Text>及相关公司材料</View>
            </View>
            <View>去认证</View>
          </View>
        </View>
      </View>
    );
  }
}

export default Auth;