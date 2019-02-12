import Taro, { Component } from '@tarojs/taro';
import { View, Input, Text } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import Popup from '~/components/popup';
import PaymentModal from '~/components/payment';
import './index.less'

class WithdrawConfirm extends Component {
  config = {
    navigationBarTitleText: '提现',
    navigationBarBackgroundColor: "#6940C3",
    navigationBarTextStyle: "white",
  }
  state = {
    popupVisiable: false,
    paymentVisiable: false,
  }
  onPopupSubmit = () => {
    this.setState({
      paymentVisiable: true,
      popupVisiable: false,
    })
  }
  onPaymentSubmit = () => {
    console.log('123s')
  }
  onSubmitBtn = () => {
    this.setState({
      popupVisiable: true
    })
  }
  onPopupCancel = visiableName => {
    this.setState({
      [visiableName]: false
    })
  }
  render() {
    const { popupVisiable, paymentVisiable } = this.state;

    return (
      <View>
        <View class='container'>
          <View class='content'>
            <View class='form'>
              <View class='item'>
                <Text class='f32'>银行卡：</Text>
                <Input placeholder='请输入手机号' />
              </View>
              <View class='item'>
                <Text class='f32'>卡信息：</Text>
                <Input placeholder='开户分行/Swift Code' disabled />
              </View>
              <View class='center'>
                <Text>预计到账金额：</Text>
                <Text class='bold f36'>12345</Text>
              </View>
            </View>
            <View class='friends'>
              <View class='title f30 bold'>最近提现银行卡</View>
              <View class='f-content f30'>
                <View class='friend'>
                  <AtIcon className='f-icon' prefixClass='icon' value='yinxingqia' size='38'  color='#32DEC4'></AtIcon>
                  <View>
                    <View class='f-name bold'>中国银行 尾号1234</View>
                    <View class='f-phone'>提现金额：1234</View>
                  </View>
                </View>
                <View class='friend'>
                  <AtIcon className='f-icon' prefixClass='icon' value='yinxingqia' size='38'  color='#7876C9'></AtIcon>
                  <View>
                    <View class='f-name bold'>中国银行 尾号1234</View>
                    <View class='f-phone'>提现金额：1234</View>
                  </View>
                </View>
                <View class='friend'>
                  <AtIcon className='f-icon' prefixClass='icon' value='yinxingqia' size='38'  color='#7876C9'></AtIcon>
                  <View>
                    <View class='f-name bold'>中国银行 尾号1234</View>
                    <View class='f-phone'>提现金额：1234</View>
                  </View>
                </View>
                <View class='friend'>
                  <AtIcon className='f-icon' prefixClass='icon' value='yinxingqia' size='38'  color='#7876C9'></AtIcon>
                  <View>
                    <View class='f-name bold'>中国银行 尾号1234</View>
                    <View class='f-phone'>提现金额：1234</View>
                  </View>
                </View>
                <View class='friend'>
                  <AtIcon className='f-icon' prefixClass='icon' value='yinxingqia' size='38'  color='#7876C9'></AtIcon>
                  <View>
                    <View class='f-name bold'>中国银行 尾号1234</View>
                    <View class='f-phone'>提现金额：1234</View>
                  </View>
                </View>
                <View class='friend'>
                  <AtIcon className='f-icon' prefixClass='icon' value='yinxingqia' size='38'  color='#7876C9'></AtIcon>
                  <View>
                    <View class='f-name bold'>中国银行 尾号1234</View>
                    <View class='f-phone'>提现金额：1234</View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View onClick={this.onSubmitBtn} class='footer center f40'>确认</View>
        </View>
        <Popup
          title='确认提现'
          submitText='立即支付'
          visiable={popupVisiable}
          onSubmit={this.onPopupSubmit}
          onCancel={this.onPopupCancel.bind(this,'popupVisiable')}
          list={[
            { name: '收款信息', value: '转账' },
            { name: '收款方', value: '王大毛' },
          ]}
          renderContent={<View class='center f56 bold'>123CNY</View>}
        />
        <PaymentModal
          title='支付'
          visiable={paymentVisiable}
          onCancel={this.onPopupCancel.bind(this,'paymentVisiable')}
          onSubmit={this.onPaymentSubmit}
        />
      </View>
    );
  }
}

export default WithdrawConfirm;