import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View } from '@tarojs/components';
import RateTable from './components/rateTable';
import RateMap from './components/rateMap';
import './index.less';

@connect(({exchange, loading}) => ({...exchange, loading}))
class Rate extends Component {
  config = {
    navigationBarTitleText: '汇率',
  }
  componentDidShow(){
    const { dispatch } = this.props;
    dispatch({ type: 'exchange/exchangeRateCurrent' })
    dispatch({ type: 'exchange/exchangeRates', payload: { sellCurrency: 'USD' } })
  }
  state = {
    tabActive:1
  }
  onTabChange = tabActive => {
    this.setState({tabActive})
  }
  render() {
    const { tabActive } = this.state;
    const { exchangeRateCurrent, exchangeRates } = this.props;
    return (
      <View class='container top-line'>
        <View class='tabs'>
          <View onClick={this.onTabChange.bind(this,1)} class={tabActive == 1?'tab-active':''}>汇率表</View>
          <View onClick={this.onTabChange.bind(this,2)} class={tabActive == 2?'tab-active':''}>汇率图</View>
        </View>
        <View class='tab-content'>
          {
            tabActive == 1 && <RateTable exchangeRateCurrent={exchangeRateCurrent} />
          }
          {
            tabActive == 2 && <RateMap exchangeRates={exchangeRates} />
          }
        </View>
      </View>
    );
  }
}

export default Rate;