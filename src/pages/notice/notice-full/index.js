import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.less';

@connect(({notice}) => ({...notice}))
class NoticeFull extends Component {

  config = {
    navigationStyle: 'custom',
  }

  componentDidShow(){
    const { dispatch } = this.props;
    dispatch({ type:'notice/acornPublicNotifications' })
  }

  goHome = () => {
    Taro.reLaunch({url:'/pages/home/index'})
  }

  onError = () => {
    Taro.reLaunch({url:'/pages/home/index'})
  }

  render() {
    const { acornPublicNotifications: { images } } = this.props;
    return (
      <View class='container'>
        <View onClick={this.goHome} class='back'>返回首页</View>
        <Image onError={this.onError} src={images.mobile_image} />
      </View>
    );
  }
}

export default NoticeFull;