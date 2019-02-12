import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Mbutton } from '~/components';
import './index.less';

class FormLayout extends Component {
  render() {
    const { onSubmit, loading, submitText } = this.props
    return (
      <View class='container'>
        <View class='content'>
          {this.props.children}
        </View>
        <View class='submit'>
          <Mbutton loading={loading} onClick={onSubmit} type='primary' width='381rpx'>{submitText}</Mbutton>
        </View>
      </View>
    );
  }
}

export default FormLayout;

FormLayout.defaultProps = {
  onSubmit: () => {},
  type: 'primary',
  loading:false,
  submitText: '确认'
}