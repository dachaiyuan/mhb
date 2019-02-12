import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { FormLayout, MformItem, Minput, Mpicker } from '~/components'
import './index.less';

@connect(({global,loading}) => ({...global,loading}))
class GatherSet extends Component {
  config = {
    navigationBarTitleText: '设置金额',
  }
  state = {
    currency: '',
  }
  form = {
    currency: '',
    amount:'',
  }
  formRefs = {
    amount:'',
  }
  async componentDidMount(){
    const { dispatch } = this.props;
    const balances = await dispatch({type:'global/balances'});
    if(balances.length){
      this.setState({
        currency: balances[0].currency
      })
      this.form.currency = balances[0].currency;
    }
  }
  componentDidShow(){
    const { dispatch } = this.props;
    dispatch({type:'global/balances'})
  }
  InputRef = (node, type) => {
    this.formRefs[type] = node;
  }
  onInputChange = (type, e) => {
    this.form[type] = e.target.value
  }
  onPickerChange = ({value}) => {
    this.form.currency = value;
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
      const { params } = this.$router;
      const res = await dispatch({type:'gather/createCollections',payload:this.form})
      if(params.redirectTo){
        dispatch({ type: 'router/redirectTo', payload: { url: '/pages/gather/index', params: res } })
      }else{
        dispatch({ type: 'router/navigateTo', payload: { url: '/pages/gather/index', params: res } })
      }
    }
  }
  render() {
    const { currency } = this.state;
    const { balances, loading } = this.props;
    return (
      <FormLayout
        onSubmit={this.onSubmit}
        loading={loading.effects['gather/createCollections']}
      >
        <View class='container'>
          <MformItem label='币种'>
            <Mpicker onChange={this.onPickerChange} range={balances} value={currency} rangeKey='currency' />
          </MformItem>
          <MformItem label='金额'>
            <Minput
              type='number'
              ref={node => this.InputRef(node, 'amount')}
              onChange={this.onInputChange.bind(this,'amount')}
              placeholder='请输入金额'
            />
          </MformItem>
        </View>
      </FormLayout>
    );
  }
}

export default GatherSet;