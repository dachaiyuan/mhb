import Taro, { Component } from '@tarojs/taro';
import { WebView } from '@tarojs/components';
import { HOST_WEBVIEW } from '~/utils/constants';

class UserPrivacy extends Component {
  config = {
    navigationBarTitleText: '用户协议和隐私政策',
  }
  render() {
    return <WebView src={`${HOST_WEBVIEW}/service.html`} />
  }
}

export default UserPrivacy;