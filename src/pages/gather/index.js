import Taro, { Component } from '@tarojs/taro';
import { View, Image, Canvas } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import QRCode from '~/utils/weapp-qrcode';
import './index.less';

@connect(({global}) => ({...global}))
class Gather extends Component {
  config = {
    navigationBarTitleText: '收款',
    navigationBarBackgroundColor: '#574F5F',
    navigationBarTextStyle: 'white',
  }
  componentDidShow(){
    const { dispatch } = this.props;
    dispatch({type:'global/account'})
    const { params: { content } } = this.$router;
    this.qr = new QRCode('myQrcode', {
      width: 160,
      height: 160,
      text: content,
    });
  }
  onSave = () => {
    this.qr.exportImage((path) => {
      Taro.saveImageToPhotosAlbum({
        filePath: path,
      });
    });
  }
  render() {
    const { params: { amount, currency } } = this.$router;
    const { account: { name, mobile, avatar, legal_name }, currencys } = this.props;
    return (
      <View class='container'>
        <View class='content'>
          <View class='title center f30'>打开妙汇宝[付款]</View>
          <Canvas class='code'  canvas-id='myQrcode'></Canvas>
          <View class='user'>
            <Image src={avatar} />
            <View>
              <View class='f32'>{name}</View>
              <View class='f26'>{`${mobile.slice(0, 3)}****${mobile.slice(-4)}`}(*{legal_name.slice(-1)})</View>
            </View>
          </View>
          <View class='amount tip-bg center'>
            <View class='f26'>{currency}({currencys[currency].symbol})</View>
            <View class='f56 primary-color bold'>{amount}</View>
          </View>
          <View class='opt primary-color f32'>
            <View onClick={this.onSave} class='left'>保存图片</View>
            <View class='primary-bg'></View>
            <View onClick={this.props.dispatch.bind(this,{type:'router/redirectTo',payload:{url:'/pages/gather/gather-set/index',params:{redirectTo:true}}})} class='right'>设置金额</View>
          </View>
        </View>
      </View>
    );
  }
}

export default Gather;