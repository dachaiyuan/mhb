import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { AtIcon } from 'taro-ui';
import { View } from '@tarojs/components';
import './index.less';

@connect(({ transaction })=>({...transaction}))
class Detail extends Component {
  config = {
    navigationBarTitleText: '详情',
    enablePullDownRefresh: true,
    backgroundColor: '#574F5F',
  }
  componentDidShow(){
    const { params } = this.$router;
    const { dispatch } = this.props;
    dispatch({type:'transaction/saveTransaction', payload: params})
    dispatch({type:'transaction/transactionDetail', payload: { id:params.id, transactionType:params.transactionType, params } })
    Taro.setNavigationBarTitle({title:params.title||'详情'})
  }
  async onPullDownRefresh() {
    const { dispatch } = this.props;
    const { params } = this.$router;
    Taro.showNavigationBarLoading();
    await dispatch({type:'transaction/transactionDetail', payload: { id:params.id, transactionType:params.transactionType, params } })
    Taro.stopPullDownRefresh();
    Taro.hideNavigationBarLoading();
  }
  render() {
    const { transaction } = this.props;
    return (
      <View class='container top-line'>
        <View class='status text-center'>
          <AtIcon prefixClass='icon' value={transaction.icon} size='40'  color={transaction.infoColor}></AtIcon>
          <View class='f56' style={{color:transaction.infoColor}}>{transaction.info}</View>
        </View>
        <View class='content'>
          {
            transaction.list.map( (item,index) => (
              <View key={index} class='item'>
                <View>{item.label}</View>
                <View class='bold'>{item.text}</View>
              </View>
            ))
          }
        </View>
        {
          !!transaction.pload_dto && (
            <View class='extra'>
              <View>汇款至（如有疑问请联系客户经理）</View>
              <View class='extra-content tip-bg'>
                <View class='item'>
                  <View>附言/备注：</View>
                  <View>{transaction.pload_dto.account_name}</View>
                </View>
                <View class='item'>
                  <View>银行名称：</View>
                  <View>{transaction.pload_dto.bank_name}</View>
                </View>
                <View class='item'>
                  <View>账户号码：</View>
                  <View>{transaction.pload_dto.account_number}</View>
                </View>
                <View class='item'>
                  <View>开户行：</View>
                  <View>{transaction.pload_dto.bank_deposit}</View>
                </View>
                <View class='item'>
                  <View>银行地址：</View>
                  <View>{transaction.pload_dto.bank_address}</View>
                </View>
                <View class='item'>
                  <View>SWIFT码：</View>
                  <View>{transaction.pload_dto.bank_swift}</View>
                </View>
                <View class='item'>
                  <View>银行代码：</View>
                  <View>{transaction.pload_dto.bank_code}</View>
                </View>
                <View class='item'>
                  <View>分支代码：</View>
                  <View>{transaction.pload_dto.bank_branch_code}</View>
                </View>
              </View>
            </View>
          )
        }
      </View>
    );
  }
}

export default Detail;