import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View } from '@tarojs/components';
import { Minput, FormLayout } from '~/components';
import './index.less';

@connect(({global, loading}) => ({...global, loading}))
class Nickname extends Component {
  config = {
    navigationBarTitleText: '修改昵称',
  }
  form = {
    name: this.props.account.name,
  }
  onSubmit = () => {
    if(!this.form.name){
      return Taro.showToast({title: '用户名不能为空', icon: 'none'})
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'user/accountName',
      payload:this.form
    })
  }
  onInputChange = ({ target: { value } }) => {
    this.form.name = value;
  }
  render() {
    const { account: { name }, loading } = this.props;
    return (
      <FormLayout onSubmit={this.onSubmit} loading={loading.effects['user/accountName']}>
        <View class='container top-line'>
            <View class='input'>
              <Minput onChange={this.onInputChange} defaultValue={name} placeholder='4至30个字符，包含中英文、数字' />
            </View>
        </View>
      </FormLayout>
    );
  }
}

export default Nickname;