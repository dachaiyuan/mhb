import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import './index.less';

class RateTable extends Component {
  static options = {
    addGlobalClass: true
  }
  render() {
    const { exchangeRateCurrent } = this.props;
    return (
      <View class='container'>
        <View class='title'>
          <View class='flex1'></View>
          <View class='title-content'>
            <View>妙汇宝</View>
            <View>中国银行</View>
          </View>
        </View>
        <View class='block'>
          {
            exchangeRateCurrent.map( (item,index) =>(
              <View key={index} class='item'>
                <View class='currency f20'>
                  <View>
                    <Image src={item.sell_currency_pic} />
                    <View>{item.sell_currency}</View>
                  </View>
                  <View class='f30'>兑</View>
                  <View>
                    <Image src={item.buy_currency_pic} />
                    <View>{item.buy_currency}</View>
                  </View>
                </View>
                <View class='rate flex f30'>
                  <View class='flex1 text-right'>{item.sys_exchange_rate}</View>
                  <View class='vertical-line'></View>
                  <View class='flex1'>{item.boc_exchange_rate}</View>
                </View>
              </View>
            ))
          }
        </View>
      </View>
    );
  }
}

export default RateTable;

RateTable.defaultProps = {
  exchangeRateCurrent: []
}