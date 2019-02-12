import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Image } from '@tarojs/components';
import { kong } from '~/utils/imgs'
import './index.less';

@connect(({ transaction, loading }) => ({ ...transaction, loading}))
class Transaction extends Component {
  config = {
    navigationBarTitleText: '支付记录',
    enablePullDownRefresh: true,
    backgroundColor: '#574F5F',
    onReachBottomDistance: '200',
  }
  state = {
    loadingText: '',
    blank: false,
  }
  async componentDidMount(){
    const { dispatch } = this.props;
    Taro.showLoading({title:'加载中'})
    await dispatch({type:'transaction/init'})
    this.setState({ blank: true })
    Taro.hideLoading();
  }
  async onPullDownRefresh() {
    const { dispatch } = this.props;
    this.setState({loadingText:''})
    Taro.showNavigationBarLoading();
    await dispatch({type:'transaction/init'})
    Taro.stopPullDownRefresh();
    Taro.hideNavigationBarLoading();
  }
  async onReachBottom() {
    const { dispatch, pagination: { page, size, last } } = this.props;
    this.setState({loadingText:''})
    Taro.showNavigationBarLoading();
    if(!last){
      this.setState({ loadingText:'加载中...' });
      setTimeout(async () => {
        await dispatch({ type: 'transaction/transactions', payload: { page: page+1, size } })
        this.setState({ loadingText:'' });
      }, 500);
    }else{
      this.setState({ loadingText:'已经没有更多了' })
    }
    Taro.hideNavigationBarLoading();
  }
  onGoPage = transaction => {
    const { dispatch } = this.props;
    dispatch({ 
      type: 'router/navigateTo',
      payload: {
        url: '/pages/transaction/detail/index',
        params: { 
          title:transaction.title,
          transactionType: transaction.transactionType,
          ...transaction.data
        } 
      } 
    })
  }
  render() {
    const { transactions } = this.props;
    const { loadingText, blank } = this.state;
    return (
      <View class='container top-line'>
        <View class='content'>
          {
            transactions.map( transaction => (
              <View
                class='transaction'
                key={transaction.id}
                onClick={this.onGoPage.bind(this, transaction)}
              >
                  <View class='type'>{transaction.type}</View>
                  <View class='info'>
                    <View class='flex1'>
                      <View class='bold f28'>{transaction.title}</View>
                      <View class='from'>{transaction.from}</View>
                      <View class='f20 info-color'>{transaction.gmt_create}</View>
                    </View>
                    <View class='text-right'>
                      <View class='bold f34'>{transaction.show_amount}</View>
                      <View style={{color:transaction.infoColor}}>{transaction.info}</View>
                    </View>
                  </View>
              </View>
            ))
          }
          {
            blank && !transactions.length && (
              <View class='kong f26'>
                <Image src={kong} />
                <View>暂无记录</View>
              </View>
            )
          }
          <View class='loading center'>{loadingText}</View>
        </View>
      </View>
    );
  }
}

export default Transaction;