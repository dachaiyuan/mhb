import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { MformItem, Mpicker, Minput, Mbutton, Popup, Payment } from '~/components'
import { View } from '@tarojs/components'
import './index.less'

@connect(({ withdraw, loading }) => ({...withdraw, loading }))
class Withdraw extends Component {
  config = {
    navigationBarTitleText: '提现',
    navigationBarBackgroundColor: "#6940C3",
    navigationBarTextStyle: "white",
  }
  state = {
    current: { },
    popupData: [],
    popupVisiable: false,
    paymentVisiable: false,
  }
  preForm = {
    amount: '',
    currency: '',
    withdraw_bank_account_id: '',
  }
  currentBank = {}
  async componentDidShow (){
    const { dispatch } = this.props;
    const current = await dispatch({type:'withdraw/init'})
    this.preForm.currency = current.currency;
    this.initBank(current);
  }
  initBank = current => {
    const { dispatch } = this.props;
    if(!!current.banks.length){
      this.setState({ 
        current: {
          ...current,
          bank: current.banks[0]
        }
      })
      dispatch({ 
        type: 'withdraw/limitAmount', 
        payload: { 
          currency: current.banks[0].currency, 
          businessType: 'WITHDRAW', 
          bank_account_id: current.banks[0].id,
        } 
      });
      this.currentBank = current.banks[0];
    }else{
      this.setState({ 
        current
      })
    }
  }
  onConfirm = async () => {
    const { loading, dispatch, limitAmount: { max_amount, min_amount } } = this.props;
    const { current } = this.state;
    const { amount } = this.preForm;
    const { bank_names, id } = this.currentBank;
    if(loading.effects['withdraw/init'] || !amount) return;
    if(+amount> +current.amount) return Taro.showToast({title:'输入的金额超出余额',icon:'none'})
    if(+amount< +min_amount || +amount>max_amount) return Taro.showToast({title:'输入的金额超出限额范围',icon:'none'});
    const { outward_amount, fee, currency } = await dispatch({ type:'withdraw/withdrawPre', payload: this.preForm })
    this.setState({
      popupData: {
        list: [
          { name: '预计到账', value: outward_amount },
          { name: '手续费', value: fee },
          { name: '订单信息', value: '提现至银行卡' },
          { name: '收款银行', value: bank_names },
        ],
        msg: `${outward_amount}${currency}`,
      },
      popupVisiable:true
    })

    this.preForm.withdraw_bank_account_id = id;
  }
  onPaymentSubmit = async value => {
    const { dispatch } = this.props;
    this.preForm.pay_password = value;
    await dispatch({ type: 'withdraw/withdraw', payload: this.preForm });
    this.setState({ paymentVisiable: false })
  }
  onCancel = visiableName => {
    this.setState({
      [visiableName]: false
    })
  }
  onForget = () => {
    this.setState({paymentVisiable:false})
    Taro.navigateTo({url:'/pages/password/password-getBack/index'})
  }
  onInputChange = ({ target: { value } }) => {
    this.preForm.amount = value;
  }
  onCurrencyChange = ({value}) => {
    this.preForm.currency = value;
    const { balances } = this.props;
    let current = {};
    balances.some( balance => balance.currency === value && (current = balance))
    this.initBank(current);
  }
  onBankChange = ({value}) => {
    const { dispatch } = this.props;
    const { current } = this.state;
    this.setState({
      current: {
        ...current,
        bank:value
      }
    })
    dispatch({ 
      type: 'withdraw/limitAmount', 
      payload: { 
        currency: value.currency, 
        businessType: 'WITHDRAW', 
        bank_account_id: value.id,
      } 
    });
    this.currentBank = value;
  }
  onPopupSubmit = () => {
    this.setState({
      paymentVisiable: true,
      popupVisiable: false,
    })
  }
  goAddBank = () => {
    const { dispatch } = this.props;
    dispatch({ type:'router/navigateTo', payload: { url: '/pages/bank/index' } })
  }
  render () {
    const { current, popupVisiable, popupData, paymentVisiable } = this.state;
    const { balances, limitAmount: { max_amount, min_amount }, loading } = this.props;
    return (
      <View class='container'>
        <View class='content'>
          <View class='main'>
            <MformItem label='提现币种' contentWidth={410}>
              <Mpicker 
                onChange={this.onCurrencyChange}
                range={balances}
                value={current.currency}
                rangeKey='currency'
              />
            </MformItem>
            {
              !!current.banks && !!current.banks.length && (
                <View>
                  <MformItem label='银行卡' contentWidth={410}>
                    <Mpicker 
                      onChange={this.onBankChange}
                      range={current.banks}
                      value={current.bank.bank_names}
                      rangeKey='bank_names'
                      full
                    />
                  </MformItem>
                  <MformItem label='提现金额' contentWidth={410} extra={`此卡最高限额:${max_amount|'-'},最低限额:${min_amount|'-'}`} >
                    <Minput
                      placeholder={`余额：${current.amount}`}
                      onChange={this.onInputChange}
                    />
                  </MformItem>
                </View>
              )
            }
            {
              !!current.banks && !current.banks.length && (
                <View class='center'>
                    <View>
                      <View class='tips'>没有此币种的银行卡，点击去添加</View>
                      <Mbutton onClick={this.goAddBank}>添加</Mbutton>
                    </View>
                </View>
              )
            }
          </View>
        </View>
        <View onClick={this.onConfirm} class='footer f40 center'>确认</View>
        <Popup
          title='确认提现'
          submitText='立即提现'
          visiable={popupVisiable}
          onSubmit={this.onPopupSubmit}
          onCancel={this.onCancel.bind(this,'popupVisiable')}
          list={popupData.list}
          renderContent={<View class='center f56 bold'>{popupData.msg}</View>}
        />
        <Payment
          loading={loading.effects['withdraw/withdraw']}
          visiable={paymentVisiable}
          onCancel={this.onCancel.bind(this,'paymentVisiable')}
          onSubmit={this.onPaymentSubmit}
          onForget={this.onForget}
        />
      </View>
    )
  }
}

export default Withdraw;