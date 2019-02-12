import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Mbutton } from '~/components';
import './index.less';

class MformItem extends Component {
  render() {
    const { label, extra, mode, onVerify, contentWidth } = this.props;
    return (
      <View class='container'>
        <View class='content'>
          <View class='label'>
            {label}
          </View>
          <View class='formitem' style={{width:`${contentWidth}rpx`}}>
            {
              mode === 'normal' && this.props.children
            }
            {
              mode === 'verify' && (
                <View class='verify'>
                  <View>{this.props.children}</View>
                  <View>
                    <Mbutton onClick={onVerify} type='secondary' width='220rpx' mode='timer'>获取验证码</Mbutton>
                  </View>
                </View>
              )
            }
          </View>
        </View>
        <View class='extra'>
          <View></View>
          <View style={{width:`${contentWidth}rpx`}}>{extra}</View>
        </View>
      </View>
    );
  }
}

export default MformItem;

MformItem.defaultProps = {
  label: '',
  extra: '',
  mode: 'normal',
  contentWidth: 478,
  onVerify: () => {}
}