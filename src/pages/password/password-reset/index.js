import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Minput, FormLayout, MformItem } from '~/components';
import './index.less';

class PasswordReset extends Component {
  config = {
    navigationBarTitleText: '支付密码重置',
  }
  onVerify = () => {
    console.log('123')
  }
  render() {
    return (
      <FormLayout onSubmit={this.onSubmit}>
        <View class='container top-line'>
          <MformItem label='当前密码'  >
            <Minput placeholder='请输入当前密码' password />
          </MformItem>
          <MformItem label='新设密码' extra='包含大、小写英文，数字的组合方式，8位字符'>
            <Minput placeholder='请输入新设密码' password />
          </MformItem>
          <MformItem label='再次输入' >
            <Minput placeholder='请再次输入新设密码' password />
          </MformItem>
          <MformItem onVerify={this.onVerify} mode='verify' label='验证码' extra='将发送至17610832019'>
            <Minput placeholder='请输入验证码' />
          </MformItem>
        </View>
      </FormLayout>
    );
  }
}

export default PasswordReset;