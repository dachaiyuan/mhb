import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View } from '@tarojs/components';
import { FormLayout, MformItem, Minput } from '~/components';
import './index.less';

@connect(({loading}) => ({loading}))
class PasswordGetBack extends Component {
  config = {
    navigationBarTitleText: '忘记支付密码',
  }
  form = {
    identification_value: '',
    new_password: '',
    r_password: '',
  }
  formRefs = {
    identification_value: '',
    new_password: '',
    r_password: '',
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
      }else if(!!this.formRefs[key].props.pattern && !new RegExp(this.formRefs[key].props.pattern).test(this.form[key])){
        isSubmit = false;
        this.formRefs[key].setWarns(true)
        Taro.showToast({title:'格式不正确',icon:'none'})
      }else{
        this.formRefs[key].setWarns(false)
      }
    })
    if(isSubmit && this.form.new_password !== this.form.r_password){
      isSubmit = false;
      this.formRefs.new_password.setWarns(true)
      this.formRefs.r_password.setWarns(true)
      Taro.showToast({title:'两次密码输入不一致',icon:'none'})
    }
    if(isSubmit){
      await dispatch({
        type: 'password/passwordReset',
        payload: this.form
      })
      await dispatch( { type: 'router/navigateBack', payload: { title: '设置成功' } } )
    }
  }
  render() {
    const { loading } = this.props;
    return (
      <FormLayout
        onSubmit={this.onSubmit}
        loading={loading.effects['password/passwordReset']}
      >
        <View class='container top-line'>
          <MformItem label='身份证号'  >
            <Minput
              placeholder='请输入身份证号'
              type='idcard'
              ref={node => this.InputRef(node, 'identification_value')}
              onChange={this.onInputChange.bind(this,'identification_value')}
            />
          </MformItem>
          <MformItem label='新设密码' extra='包含大、小写英文，数字的组合方式，8位字符'>
            <Minput
              placeholder='请输入新设密码'
              password
              pattern={'^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9]{8,16}$'}
              ref={node => this.InputRef(node, 'new_password')}
              onChange={this.onInputChange.bind(this,'new_password')}
            />
          </MformItem>
          <MformItem label='确认密码' >
            <Minput
              placeholder='请输入确认密码'
              password
              ref={node => this.InputRef(node, 'r_password')}
              onChange={this.onInputChange.bind(this,'r_password')}
            />
          </MformItem>
        </View>
      </FormLayout>
    );
  }
}

export default PasswordGetBack;