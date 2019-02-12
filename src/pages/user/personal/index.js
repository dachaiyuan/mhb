import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtIcon } from 'taro-ui';
import imgs from '~/utils/imgs'
import './index.less';

@connect(({global})=>({...global}))
class Personal extends Component {
  config = {
    navigationBarTitleText: '个人中心',
  }
  componentDidShow(){
    const { dispatch } = this.props;
    dispatch({
      type: 'global/account'
    })
  }
  loginOut = async () => {
    const { confirm } = await Taro.showModal({
      title: '提示',
      content: '您确定要退出登录吗?'
    })
    if (confirm) {
      await Taro.clearStorage();
      await Taro.reLaunch({ url: '/pages/start/index' });
    }
  }
  onUpdateAvatar = async () => {
    const { dispatch } = this.props;
    const { tempFilePaths } = await Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
    });
    dispatch({
      type: 'user/uploadAvatar',
      payload:{
        filePath:tempFilePaths[0]
      }
    })
  }
  render() {
    const { account: { avatar, name, mobile } } = this.props;
    return (
      <View class='container'>
        <View class='item flex'>
          <View class='f30 bold'>头像</View>
          <View onClick={this.onUpdateAvatar} class='content f26'>
            <Image class='avatar' src={!!avatar?avatar:imgs.defaultAvatar} />
            <AtIcon value='chevron-right' size='20' color='rgba(87,79,95,.5)'></AtIcon>
          </View>
        </View>
        <View class='item flex' onClick={this.props.dispatch.bind(this, { type: 'router/navigateTo', payload: { url: '/pages/user/nickname/index' } })} >
          <View class='f30 bold'>昵称</View>
          <View class='content f26'>
            <Text>{name}</Text>
            <AtIcon value='chevron-right' size='20' color='rgba(87,79,95,.5)'></AtIcon>
          </View>
        </View>
        <View class='item flex'>
          <View class='f30 bold'>妙汇宝账号</View>
          <View class='content f26'>
            {mobile}
          </View>
        </View>
        <View class='item flex'>
          <View class='f30 bold'>客服邮箱</View>
          <View class='content f26'>
            support@acornwallet.com
          </View>
        </View>
        <View onClick={this.loginOut} class='item flex'>
          <View class='f30 bold'>退出登录</View>
        </View>
      </View>
    );
  }
}

export default Personal;