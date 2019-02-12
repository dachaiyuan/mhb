import Taro, { Component } from '@tarojs/taro';
import { View, Image, Textarea } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { FormLayout, Payment } from '~/components'
import './index.less';

@connect(({transfer, loading}) => ({...transfer, loading}))
class Scan extends Component {
  config = {
    navigationBarTitleText: '付款',
  }
  state = {
    paymentVisiable: false,
  }
  componentDidShow(){
    const { dispatch } = this.props;
    const { params: { qrCodeData } } = this.$router;
    console.log(this.$router);
    const id = qrCodeData.slice(qrCodeData.lastIndexOf('/') + 1);
    dispatch({ type: 'transfer/getCollections', payload: { id } });
  }
  form = {
    collection_id: '',
    comment: '',
    pay_password: ''
  }
  onTextArea = ({detail: { value }}) => {
    this.form.comment = value;
  }
  onSubmit = () => {
    const { payee: { id } } = this.props
    this.form.collection_id = id;
    this.setState({ paymentVisiable:true })
  }
  onPaymentCancel = () => {
    this.setState({ paymentVisiable:false })
  }
  onPaymentSubmit = async value => {
    this.form.pay_password = value;
    const { dispatch } = this.props;
    await dispatch({
      type: 'transfer/scanTransfers',
      payload: this.form
    })
    this.setState({paymentVisiable:false})
  }
  onForget = () => {
    this.setState({paymentVisiable:false})
    Taro.navigateTo({url:'/pages/password/password-getBack/index'})
  }
  render() {
    const { currencys, loading, payee: { account_avatar, account_name, amount, currency, legal_name, mobile  } } = this.props;
    const { paymentVisiable } = this.state;
    return (
      <FormLayout
        onSubmit={this.onSubmit}
      >
        <View class='container top-line'>
          <View class='user'>
            <Image src={account_avatar} />
            <View>
              <View class='f32'>{account_name}</View>
              <View class='f26'>{`${mobile.slice(0, 3)}****${mobile.slice(-4)}`}(*{legal_name.slice(-1)})</View>
            </View>
          </View>
          <View class='title'>转账金额</View>
          <View class='amount tip-bg center'>
            <View class='f26'>{currency}({currencys[currency].symbol})</View>
            <View class='f56 primary-color bold'>{amount}</View>
          </View>
          <View class='line tip-bg'></View>
          <View class='opt'>
            <View class='bold'>添加备注</View>
            <Textarea disabled={paymentVisiable} onInput={this.onTextArea} class='textarea tip-bg' />
          </View>
        </View>
        <Payment
          loading={loading.effects['transfer/scanTransfers']}
          visiable={paymentVisiable}
          onCancel={this.onPaymentCancel}
          onSubmit={this.onPaymentSubmit}
          onForget={this.onForget}
        />
      </FormLayout>  
    );
  }
}

export default Scan;