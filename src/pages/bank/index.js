import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View } from '@tarojs/components';
import './index.less';

@connect(({bank}) => ({...bank}))
class Bank extends Component {

  config = {
    navigationBarTitleText: '银行卡',
  }

  componentDidShow() {
    const { dispatch } = this.props;
    dispatch({ type: 'bank/banks' })
  }

  onHanderAddBank = async () => {
    const { dispatch } = this.props;
    const { tapIndex } = await Taro.showActionSheet({
      itemList: ['中国（大陆）','中国（香港）'],
      itemColor: '#574F5F'
    });
    tapIndex === 0 && dispatch({ type: 'router/navigateTo', payload: { url: '/pages/bank/bank-add/index' } })
    tapIndex === 1 && dispatch({ type: 'router/navigateTo', payload: { url: '/pages/bank/bank-add-HK/index' } })
  }
  render() {
    const { banks } = this.props;
    return (
      <View class='container top-line'>
        <View onClick={this.onHanderAddBank} class='f26 add-bank'>+ 添加银行卡</View>
        <View class='banks'>
          {
            banks.map( (bank,index) => (
              <View key={index} class='bank'>
                <View class='name'>{bank.bank_name}</View>
                <View class='currency'>{bank.currency}</View>
                <View class='number'>*** **** ***{bank.account_number.slice(-3)}</View>
                <View class='footer'>
                  <View>开户分行/Swift code</View>
                  <View>{bank.bank_branch_name || ''}</View>
                </View>
              </View>
            ))
          }
        </View>
      </View>
    );
  }
}

export default Bank;