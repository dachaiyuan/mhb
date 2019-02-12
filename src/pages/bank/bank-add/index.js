import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Radio, RadioGroup, Label } from '@tarojs/components';
import { FormLayout, MformItem, Minput } from '~/components'
import './index.less';

@connect(({loading})=>({loading}))
class BankAdd extends Component {

  config = {
    navigationBarTitleText: '添加银行卡（大陆）',
  }
  state = {
    checked: 'PERSON'
  }
  form = {
    region: 'CN',
    currency: 'CNY',
    account_holder_name: '',
    bank_account_type: 'PERSON',
    bank_name: '',
    bank_branch_name: '',
    account_number: '',
    mobile: '',
    verification_code: '',
  }
  formRefs = {
    account_holder_name: '',
    bank_name: '',
    bank_branch_name: '',
    account_number: '',
    mobile: '',
    verification_code: '',
  }
  InputRef = (node, type) => {
    this.formRefs[type] = node;
  }
  onVerify = async resolve => {
    const { dispatch } = this.props;
    const { mobile } = this.form;
    if(!mobile){
      this.formRefs.mobile.setWarns(true);
    }else{
      //发送验证码
      try{  await dispatch({ type: 'bank/bankAddSMS',payload: {mobile} })
      }catch(e){
        resolve(false);
      }
      resolve(true);
    }
    resolve(false);
  }
  onInputChange = (type, e) => {
    this.form[type] = e.target.value
  }
  onRadioChange = ({detail:{value}}) => {
    this.form.bank_account_type = value;
    this.setState({checked:value})
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
    const { loading } = this.props;
    const { checked } = this.state;
    return (
      <FormLayout
        onSubmit={this.onSubmit}
        loading={loading.effects['bank/bankAdd']}
      >
        <View class='container top-line'>
          <MformItem label='币种'>
            <Minput defaultValue='CNY' disabled />
          </MformItem>
          <MformItem label='类型'>
            <RadioGroup onChange={this.onRadioChange} class='radio'>
              <Label>
                <Radio checked={checked === 'PERSON'} value='PERSON' color='#2960EB'>个人银行卡</Radio>
              </Label>
              <Label>
                <Radio checked={checked === 'COMPANY'} value='COMPANY' color='#2960EB' >企业银行卡</Radio>
              </Label> 
            </RadioGroup>
          </MformItem>
          <MformItem label='开户地'>
            <Minput
              ref={node => this.InputRef(node, 'bank_location')}
              onChange={this.onInputChange.bind(this,'bank_location')}
              placeholder='例如：北京市'
            />
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
          <MformItem label='开户分行'>
            <Minput
              ref={node => this.InputRef(node, 'bank_branch_name')}
              onChange={this.onInputChange.bind(this,'bank_branch_name')}
              placeholder='例如: 望京分行'
            />
          </MformItem>
          <MformItem label='开户号'>
            <Minput
              ref={node => this.InputRef(node, 'account_number')}
              onChange={this.onInputChange.bind(this,'account_number')}
              placeholder='请输入银行卡号'
              type='number'
            />
          </MformItem>
          <MformItem label='手机号'>
            <Minput
              ref={node => this.InputRef(node, 'mobile')}
              onChange={this.onInputChange.bind(this,'mobile')}
              placeholder='请输入银行预留手机号'
              type='number'
            />
          </MformItem>
          <MformItem onVerify={this.onVerify} mode='verify' label='验证码' extra='验证码将发送至银行预留手机号'>
            <Minput
              ref={node => this.InputRef(node, 'verification_code')}
              onChange={this.onInputChange.bind(this,'verification_code')}
              placeholder='请输入验证码'
            />
          </MformItem>
        </View>
      </FormLayout>  
    );
  }
}

export default BankAdd;