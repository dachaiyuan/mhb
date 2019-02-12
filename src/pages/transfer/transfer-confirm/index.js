import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux'
import { View, Text, Image } from '@tarojs/components';
import { Minput, Popup, Payment } from '~/components';
import './index.less'

@connect(({ transfer, user, loading }) => ({...transfer, ...user, loading}))
class TransferConfirm extends Component {
  config = {
    navigationBarTitleText: '转账',
    navigationBarBackgroundColor: "#2960EB",
    navigationBarTextStyle: "white",
  }
  state = {
    popupVisiable: false,
    paymentVisiable: false,
    formShow: {
      amount: '',
      currency: ''
    }
  }
  componentDidShow(){
    const { dispatch } = this.props;
    const { params } = this.$router;
    this.form = {...this.form, ...params}
    dispatch({type:'user/save',payload:{findUsers:{}}})
    dispatch({ type:"user/recentTransfer" });
  }
  form = {
    amount: 0,
    currency: '',
    mobile: '',
  }
  formRefs = {
    mobile: '',
  }
  onInputChange = async ({ target: { value } }) => {
    const { dispatch } = this.props;
    dispatch({type:'user/save',payload:{findUsers:{}}})
    if(value.toString().length === 11){
      Taro.showLoading({title:'获取实名信息...'})
      setTimeout( async () => {
        await dispatch({type:'user/accounts', payload: { mobile:value }})
        Taro.hideLoading();
      }, 500);
      
    }
  }
  InputRef = (node, type) => {
    this.formRefs[type] = node;
  }
  onPopupSubmit = () => {
    this.setState({
      paymentVisiable: true,
      popupVisiable: false,
    })
  }
  onPaymentSubmit = async value => {
    this.form.pay_password = value;
    const { dispatch } = this.props;
    await dispatch({
      type: 'transfer/transfers',
      payload: this.form
    })
    this.setState({paymentVisiable:false})
  }
  onSubmitBtn = () => {
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
    if(isSubmit){
      const { findUsers } = this.props;
      this.form.to_account_id = findUsers.id;
      this.setState({popupVisiable:true})
    }
  }
  onSelectRecentUser = user => {
    const { dispatch } = this.props;
    dispatch({type:'user/save',payload:{ findUsers:user }})
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
  render() {
    const { popupVisiable, paymentVisiable, formShow } = this.state;
    const { findUsers, loading, recentUser } = this.props;
    this.form.mobile = findUsers.mobile;
    return (
      <View>
        <View class='container'>
          <View class='content'>
            <View class='form'>
              <View class='item'>
                <Text class='f32'>账号：</Text>
                <Minput
                  placeholder='请输入手机号'
                  type='number'
                  value={findUsers.mobile}
                  ref={node => this.InputRef(node, 'mobile')}
                  onChange={this.onInputChange}
                />
              </View>
              <View class='item'>
                <Text class='f32'>实名：</Text>
                <Minput
                  value={findUsers.legal_name}
                  disabled
                  placeholder='请输入妙汇宝实名信息'
                />
              </View>
            </View>
            <View class='friends'>
              <View class='title f30 bold'>最近转账伙伴</View>
              <View class='f-content f30'>
                {
                  recentUser.map( (user,index) => (
                    <View onClick={this.onSelectRecentUser.bind(this,user)} key={index} class='friend'>
                      <Image src={user.avatar} />
                      <View>
                        <View class='f-name bold'>{user.name}（{user.legal_name}）</View>
                        <View class='f-phone'>{user.mobile}</View>
                      </View>
                    </View>
                  ))
                }
              </View>
            </View>
          </View>
          <View onClick={this.onSubmitBtn} class='footer center f40 active'>确认</View>
        </View>
        <Popup
          title='确认付款'
          submitText='立即支付'
          visiable={popupVisiable}
          onSubmit={this.onPopupSubmit}
          onCancel={this.onCancel.bind(this,'popupVisiable')}
          list={[
            { name: '收款信息', value: '转账' },
            { name: '收款方', value: findUsers.legal_name },
          ]}
          renderContent={<View class='center f56 bold'>{formShow.amount}{formShow.currency}</View>}
        />
        <Payment
          loading={loading.effects['transfer/transfers']}
          visiable={paymentVisiable}
          onCancel={this.onCancel.bind(this,'paymentVisiable')}
          onSubmit={this.onPaymentSubmit}
          onForget={this.onForget}
        />
      </View>
    );
  }
}

export default TransferConfirm;