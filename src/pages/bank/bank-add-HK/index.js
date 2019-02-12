import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View } from '@tarojs/components';
import { FormLayout, MformItem, Minput, Mpicker } from '~/components'
import './index.less';

@connect(({bank,loading})=>({...bank,loading}))
class BankAddHK extends Component {

  config = {
    navigationBarTitleText: '添加银行卡（香港）',
  }
  state = {
    currency: '',
  }

  async componentDidShow (){
    const { dispatch } = this.props;
    const res = await dispatch({type:'bank/initHK'});
    this.form.currency = !!res.length && res[0].currency;
    this.setState({ currency: res[0].currency })
  }
  onPickerChange = ({value}) => {
    this.form.currency = value;
  }
  form = {
    region: 'HK',
    bank_account_type: 'COMPANY',
    currency: '',
    account_holder_name: '',
    bank_name: '',
    bic_number: '',
    account_number: '',
  }
  formRefs = {
    account_holder_name: '',
    bank_name: '',
    bic_number: '',
    account_number: '',
  }
  InputRef = (node, type) => {
    this.formRefs[type] = node;
  }
  onInputChange = (type, e) => {
    this.form[type] = e.target.value
  }
  onSubmit = async () => {
    const { dispatch } = this.props;
    let isSubmit = true;
    Object.keys(this.formRefs).map( key => {
      if(!this.form[key]){
        isSubmit = false;
        this.formRefs[key].setWarns(true)
      }else{
        this.formRefs[key].setWarns(false)
      }
    })
    if(isSubmit){
      await dispatch({
        type: 'bank/bankAdd',
        payload: this.form
      })
      await dispatch({ type: 'router/navigateBack', payload: { title: '添加成功' } })
    }
  }
  render() {
    const { loading, balances } = this.props;
    const { currency } = this.state;
    return (
      <FormLayout
        onSubmit={this.onSubmit}
        loading={loading.effects['bank/bankAdd']}
      >
        <View class='container top-line'>
          <MformItem label='币种'>
            <Mpicker onChange={this.onPickerChange} range={balances} value={currency} rangeKey='currency' />
          </MformItem>
          <MformItem label='账户名'>
            <Minput
              ref={node => this.InputRef(node, 'account_holder_name')}
              onChange={this.onInputChange.bind(this,'account_holder_name')}
              placeholder='请输入账户名'
            />
          </MformItem>
          <MformItem  label='开户行'>
            <Minput
              ref={node => this.InputRef(node, 'bank_name')}
              onChange={this.onInputChange.bind(this,'bank_name')}
              placeholder='例如: 招商银行'
            />
          </MformItem>
          <MformItem label='SWIFT Code'>
            <Minput
              ref={node => this.InputRef(node, 'bic_number')}
              onChange={this.onInputChange.bind(this,'bic_number')}
              placeholder='例如: HSBCHKHHHKH'
            />
          </MformItem>
          <MformItem label='账户号'>
            <Minput
              ref={node => this.InputRef(node, 'account_number')}
              onChange={this.onInputChange.bind(this,'account_number')}
              placeholder='请输入账户号'
              type='number'
            />
          </MformItem>
          <View class='tips tip-bg'>
            请添加本人香港账户，
            避免充值/提现无法到账
          </View>
        </View>
      </FormLayout>  
    );
  }
}

export default BankAddHK;