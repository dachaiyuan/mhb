import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { Popup, Payment } from '~/components'
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './index.less'

@connect(({ exchange, loading }) => ({ ...exchange, loading }))
class Exchange extends Component {
  config = {
    navigationBarTitleText: '结汇',
    navigationBarBackgroundColor: "#20B275",
    navigationBarTextStyle: "white",
  }
  state = {
    BtnHeight: 144,
    CurrencyHeight: 0,
    form: {
      value: '0',
      currency: '',
    },
    expect: 0,
    popupVisiable: false,
    paymentVisiable: false,
  }
  async componentDidShow(){
    const { dispatch } = this.props;
    const { form: { currency } } = this.state;
    if(!currency){
      Taro.showLoading({ title:'加载中' })
      const currencys = await dispatch({type:'exchange/init'})
      this.setState({ form: { value: 0, currency:currencys  } })
      Taro.hideLoading()
    }else{
      const currencys = await dispatch({type:'exchange/init'})
      this.setState({ form: { value: 0, currency:currencys  } })
    }
    
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
    if(loading.effects['exchange/init']) return;

    let form  = JSON.parse(JSON.stringify(this.state.form));
    if(form.value == '0' && val != '.'){
      form.value = val;
    }else{
      form.value = `${form.value}${val}`
    }
    // 监听&&本地计算换汇
    if(this.listen(form.value, val) && this.localExchange(form)){
      this.setState({ form })
    }
  }
  delete = () => {
    const { loading } = this.props;
    if(loading.effects['exchange/init']) return;

    let form  = JSON.parse(JSON.stringify(this.state.form));
    if(form.value.toString().length == 1){
      form.value = '0';
    } else {
      form.value = form.value.slice(0,-1);
    }

    // 监听&&本地计算换汇
    this.listen(form.value);
    this.localExchange(form);
    this.setState({ form })
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
    if ( len > 18 ) return false;
    // 余额判定
    const { current } = this.props;
    if(+value > +current.amount){
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
    this.setState({ form: { currency:current.currency, value: 0 }, expect: 0 })
    await this.props.dispatch({
      type: 'exchange/saveCurrent',
      payload: {
        current,
      }
    })
    await this.onSelect()
  }
  localExchange = form => {
    const { currentRate: { sys_exchange_rate } } = this.props;
    let len = (form.value*sys_exchange_rate).toFixed(2).toString().length;
    if ( len > 18 ) {
      Taro.showToast({ title: '超过最大范围', icon: 'none' });
      return false;
    };
    this.setState({
      expect:(form.value*sys_exchange_rate).toFixed(2)
    })
    return true;
  }
  getFontSize = value => {
    let len = value.toString().length;
    if(len < 7) {
      return '92rpx';
    }
    else if(len >= 7 && len < 12){
      return '60rpx';
    } else if(len >= 12){
      return '40rpx';
    }
  }
  onConfirm = async () => {
    const { dispatch } = this.props;
    const { form: { value } } = this.state;
    if(+value > 0){
      const { deal } = await dispatch({type:'exchange/businessDatetime'});
      if(!deal) return Taro.showToast({title:'今日不可交易'})
      this.setState({popupVisiable:true})
    }else{
      Taro.showToast({title:'请输入转账金额', icon: 'none'})
    }
  }
  onPaymentSubmit = async value => {
    const { form: { value: sell_amount, currency: sell_currency } } = this.state;
    let form = { sell_amount, sell_currency, buy_currency: 'CNY', pay_password: value };
    const { dispatch } = this.props;
    console.log(form);
    await dispatch({
      type: 'exchange/exchange',
      payload: form
    })
    this.setState({paymentVisiable:false})
  }
  onPopupSubmit = () => {
    this.setState({
      paymentVisiable: true,
      popupVisiable: false,
    })
  }
  onCancel = visiableName => {
    this.setState({ [visiableName]: false })
  }
  onForget = () => {
    this.setState({paymentVisiable:false})
    Taro.navigateTo({url:'/pages/password/password-getBack/index'})
  }
  render () {
    const { BtnHeight, CurrencyHeight, form, expect, popupVisiable, paymentVisiable } = this.state;
    const { current, currentRate, businessDatetime: { working_day, working_start_time, working_end_time }, currencys, loading } = this.props;
    return (
      <View class='container'>
        <View class='content'>
          <View class='main'>
            <View class='amount-wrap'>
              <View>
                <View class='title text-center'>
                  <View>{!!working_day?`交易时间（工作日${working_start_time}至${working_end_time}）`:'今日不可交易'}</View>
                  <View class='f32'>当前汇率：{currentRate.sys_exchange_rate}</View>
                </View>
                <View class='item flex'>
                  <View class='amount f94' style={{fontSize: this.getFontSize(form.value)}}>{form.value}</View>
                  <View onClick={this.onSelect} class='select after center f40 active'>{current.currency}</View>
                </View>
                <View class='f24 flex'>
                  <View class='flex-grow'></View>
                  <View class='expect text-center'>预计兑换</View>
                </View>
                <View class='item flex'>
                  <View class='amount f94' style={{fontSize: this.getFontSize(expect)}}>{expect}</View>
                  <View class='select center f40'>CNY</View>
                </View>
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
            <View onClick={this.keyboard.bind(this,'.')} class='active'>.</View>
            <View onClick={this.keyboard.bind(this,0)} class='active'>0</View>
            <View onClick={this.delete} class='active'>
              <AtIcon prefixClass='icon' value='shanchu'  color='#FFF'></AtIcon>
            </View>
          </View>
        </View>
        <View onClick={this.onConfirm} style={{height: `${BtnHeight}rpx`}} class='footer f40 center active'>确认</View>
        <Popup
          title='确认结汇'
          submitText='立即结汇'
          visiable={popupVisiable}
          onSubmit={this.onPopupSubmit}
          onCancel={this.onCancel.bind(this,'popupVisiable')}
          list={[
            { name: '订单信息', value: '结汇' },
            { name: '当前汇率', value: currentRate.sys_exchange_rate },
          ]}
          renderContent={<View class='center f50 bold'>
            <View class='flex1 text-center'>{currencys[current.currency].symbol}{form.value}</View>    
            <AtIcon prefixClass='icon' value='xiangyou'  color='#574F5F'></AtIcon>
            <View class='flex1 text-center'>¥{expect}</View>
          </View>}
        />
        <Payment
          loading={loading.effects['exchange/exchange']}
          visiable={paymentVisiable}
          onCancel={this.onCancel.bind(this,'paymentVisiable')}
          onSubmit={this.onPaymentSubmit}
          onForget={this.onForget}
        />
      </View>
    )
  }
}

export default Exchange;