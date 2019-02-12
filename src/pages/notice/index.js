import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { kong } from '~/utils/imgs';
import { connect } from '@tarojs/redux';
import './index.less';

@connect(({notice, loading}) => ({...notice, loading}))
class Notice extends Component {

  config = {
    navigationBarTitleText: '通知',
    enablePullDownRefresh: true,
    backgroundColor: '#574F5F',
    onReachBottomDistance: '200',
  }

  state = {
    loadingText: '',
    blank: false,
  }
  componentDidShow(){
    const { dispatch } = this.props;
    dispatch({ type:'notice/todoRead' })
  }

  async componentDidMount(){
    const { dispatch } = this.props;
    Taro.showLoading({title:'加载中'})
    await dispatch({type:'notice/init'})
    this.setState({ blank: true })
    Taro.hideLoading();
  }

  async onPullDownRefresh() {
    const { dispatch } = this.props;
    this.setState({loadingText:''})
    Taro.showNavigationBarLoading();
    await dispatch({type:'notice/init'})
    Taro.stopPullDownRefresh();
    Taro.hideNavigationBarLoading();
  }

  async onReachBottom() {
    const { dispatch, pagination: { page, size, last } } = this.props;
    this.setState({loadingText:''})
    Taro.showNavigationBarLoading();
    if(!last){
      this.setState({ loadingText:'加载中...' });
      setTimeout(async () => {
        await dispatch({ type: 'notice/todos', payload: { page: page+1, size } })
        this.setState({ loadingText:'' });
      }, 500);
    }else{
      this.setState({ loadingText:'已经没有更多了' })
    }
    Taro.hideNavigationBarLoading();
  }

  goPage = async ({ url }) => {
    const { dispatch } = this.props;
    switch (url) {
      case '/pages/auth/index':
        {
          const { legal_entity_status } = await dispatch({type:"global/account"});
          legal_entity_status === 'VERIFYING' && Taro.showToast({title:'正在认证中，请您耐心等待',icon:'none'})
          legal_entity_status === 'CONFIRMED' && Taro.showToast({title:'您已认证通过',icon:'none'})
          (!legal_entity_status || legal_entity_status === 'REJECTED') && dispatch({ type: 'router/navigateTo', payload: { url } })
          break;
        }
      case '/pages/safety/index':
        {
          const { pay_password_initialized } = await dispatch({type:"global/account"});
          pay_password_initialized && Taro.showToast({title:'交易密码已经设置',icon:'none'});
          !pay_password_initialized && dispatch({ type: 'router/navigateTo', payload: { url } });
          break;
        }
      default:
        dispatch({ type: 'router/navigateTo', payload: { url } });
        break;
    }
  }

  render() {
    const { todos } = this.props;
    const { loadingText, blank } = this.state;
    return (
      <View class='container top-line'>
        {
          todos.map( todo => (
            <View key={todo.id} class='notice'>
              <View class='title bold f32'>
                <View>妙汇宝官方客服</View>
                { !!todo.url && <View onClick={this.goPage.bind(this,todo)} class='go'>前往</View> }
              </View>
              <View class='content f30'>
                {todo.content}
                {
                  !!todo.payload && (
                    <View class='bank-info'>
                      <View>汇款金额：{todo.payload.ampunt || ''}{todo.payload.currency || ''}</View>
                      <View>附言/备注：{todo.payload.account_name || ''}({todo.payload.deposit_code || ''})</View>
                      <View>账号：{todo.payload.account_number || ''}</View>
                      <View>银行：{todo.payload.bank_name || ''}</View>
                      <View>开户行：{todo.payload.bank_deposit || ''}</View>
                      <View>银行地址：{todo.payload.bank_address || ''}</View>
                      <View>SWIFT代码：{todo.payload.bank_swift || ''}</View>
                      <View>银行代码：{todo.payload.bank_code || ''}</View>
                      <View>支行代码：{todo.payload.bank_branch_code || ''}</View>
                    </View>
                  )
                }
              </View>
              <View class='text-right info-color f26'>{todo.gmt_create}</View>
            </View>
          ))
        }
        {
          blank && !todos.length && (
            <View class='kong f26'>
              <Image src={kong} />
              <View>暂无通知</View>
            </View>
          )
        }
        <View class='loading center'>{loadingText}</View>
      </View>
    );
  }
}

export default Notice;