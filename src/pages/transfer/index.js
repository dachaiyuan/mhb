import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './index.less'

@connect(({ transfer, global, loading }) => ({...transfer, ...global, loading}))
class Transfer extends Component {
  config = {
    navigationBarTitleText: '转账',
    navigationBarBackgroundColor: "#2960EB",
    navigationBarTextStyle: "white",
  }
  state = {
    BtnHeight: 144,
    CurrencyHeight: 0,
    fontSize: '92rpx',
    form: {
      value: '0',
      currency: '',
    },
  }
  async componentDidMount(){
    const { dispatch } = this.props;
    const currency = await dispatch({type:'transfer/init'})
    this.setState( { form: { value: '0', currency } })
  }
  onSelect = () => {
    if(!!this.state.BtnHeight){
      this.setState({
        BtnHeight: 0,
        CurrencyHeight: 144,
      })
    }else{
      this.setState({
        BtnHeight: 144,
        CurrencyHeight: 0,
      })
    }

  }
  keyboard = val => {
    const { loading } = this.props;
    if(loading.effects['transfer/init']) return;

    let form  = JSON.parse(JSON.stringify(this.state.form));
    if(form.value == '0' && val != '.'){
      form.value = val;
    }else{
      form.value = `${form.value}${val}`
    }
    if(this.listen(form.value, val)){
      this.setState({
        form
      })
    }
  }
  delete = () => {
    const { loading } = this.props;
    if(loading.effects['transfer/init']) return;

    let form  = JSON.parse(JSON.stringify(this.state.form));
    if(form.value.toString().length == 1){
      form.value = '0';
    } else {
      form.value = form.value.slice(0,-1);
    }
    this.listen(form.value);
    this.setState({
      form
    })
  }
  listen = (value, val) => {
    const form  = JSON.parse(JSON.stringify(this.state.form));
    // 小数点
    if(val == '.' && form.value.toString().includes('.') ){
      return false;
    }
    //控制小数点后两位
    let formValue = form.value.toString();
    if(formValue.includes('.')){
      let p = formValue.indexOf('.');
      let h = formValue.length;
      if(h-p > 2){
        return false;
      }
    }
    // 数字
    let len = value.toString().length;
    if(len < 7) {
      this.setState({
        fontSize: '92rpx'
      })
    }
    else if(len >= 7 && len < 12){
      this.setState({
        fontSize: '60rpx'
      })
    } else if(len >= 12 && len <= 18){
      this.setState({
        fontSize: '40rpx'
      })
    } else if(len > 18){
      return false;
    }
    // 余额判定
    const { current } = this.props;
    if( +value > +current.amount){
      Taro.showToast({ title: '不能超过余额', icon: 'none' });
      return false;
    }
    return true;
  }
  balanceList = () => {
    const arr = [];
    const { balances } = this.props;
    const { length } = balances;
    for (let i = 0; i < Math.ceil(length / 4); i += 1) {
      const start = i * 4;
      const end = (i * 4) + 4;
      arr[i] = balances.slice(start, length > end ? end : length);
    }
    return arr;
  }
  onSelectCurrency = async current => {
    this.setState({ form: { currency:current.currency, value: 0 } })
    await this.props.dispatch({
      type: 'transfer/save',
      payload: {
        current
      }
    });
    this.onSelect()
  }
  onConfirm = () => {
    const { dispatch } = this.props;
    const { form: { value:amount, currency } } = this.state;
    if(+amount > 0){
      dispatch({ 
        type: 'router/navigateTo',
        payload: { 
          url: '/pages/transfer/transfer-confirm/index',
          params: {
            currency,
            amount
          }
        }
      })
    }else{
      Taro.showToast({title:'请输入转账金额', icon: 'none'})
    }
  }
  render () {
    const { BtnHeight, CurrencyHeight, form, fontSize } = this.state;
    const { current } = this.props;
    return (
      <View class='container'>
        <View class='content'>
          <View class='main'>
            <View class='amount-wrap'>
              <View class='flex'>
                <View class='amount f94' style={{fontSize}}>{form.value}</View>
                <View onClick={this.onSelect} class='select center f40 active'>{current.currency}</View>
              </View>
            </View>
            <Text class='balance f24 center'>余额：{current.amount}{current.currency}</Text>
            <View style={{height: `${CurrencyHeight}rpx`}} class='currencys'>
              <Swiper
                className='swiper'
              >
                {
                  this.balanceList().map( (balance, index) => (
                      <SwiperItem className='item' key={index}>
                        {
                          balance.map( (item, indexs) => (
                            <View onClick={this.onSelectCurrency.bind(this,item)} key={indexs+100}>
                              <Image src={item.pic} />
                              <Text class='f16 center'>{item.currency}</Text>
                            </View>
                          ))
                        }
                      </SwiperItem>
                    )
                  )
                }
              </Swiper>
            </View>
          </View>
          <View class='keyboard'>
            {
              Array(9).map(
                (val, index) => <View class='active' onClick={this.keyboard.bind(this,index+1)} key={index}>{index+1}</View>
              )
            }
            <View class='active' onClick={this.keyboard.bind(this,'.')}>.</View>
            <View class='active' onClick={this.keyboard.bind(this,0)}>0</View>
            <View class='active' onClick={this.delete}>
              <AtIcon prefixClass='icon' value='shanchu'  color='#FFF'></AtIcon>
            </View>
          </View>
        </View>
        <View onClick={this.onConfirm} style={{height: `${BtnHeight}rpx`}} class='footer f40 center active'>确认</View>
      </View>
    )
  }
}

export default Transfer;