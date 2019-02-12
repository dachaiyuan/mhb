import Taro, { Component } from '@tarojs/taro';
import { AtIcon } from 'taro-ui';
import { connect } from '@tarojs/redux';
import { View, Text } from '@tarojs/components';
import './index.less';


@connect(() => ({}))
class Safety extends Component {
  render() {
    return (
      <View class='container top-line'>
        <View class='item flex f30' onClick={this.props.dispatch.bind(this, { type: 'router/navigateTo', payload: { url: '/pages/password/password-update/index' } })} >
          <View>设置支付密码</View>
          <View class='content'>
            <Text>修改密码</Text>
            <AtIcon value='chevron-right' size='20' color='rgba(87,79,95,.5)'></AtIcon>
          </View>
        </View>
      </View>
    );
  }
}

export default Safety;