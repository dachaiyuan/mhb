import Taro, { Component } from '@tarojs/taro';
import { View, Input } from '@tarojs/components';
import sha256 from 'crypto-js/sha256';
import Modal from '~/components/modal';
import './index.less';

class Payment extends Component {
  state = {
    error: false,
  }
  value = '';
  onSubmit = () => {
    const { onSubmit } = this.props;
    if(!this.value){
      this.setState({error:true})
    }else{
      onSubmit(sha256(this.value).toString())
    }
  }
  onChange = ({ detail: { value } }) => {
    this.value = value;
    if(value) {
      this.setState({error:false})
    }else{
      this.setState({error:true})
    }
  }
  render() {
    const { title, visiable, onCancel, submitText, loading, onForget } = this.props;
    const { error } = this.state;
    return (
      <View>
        <Modal
          title={title}
          loading={loading}
          visiable={visiable}
          onSubmit={this.onSubmit}
          onCancel={onCancel}
          submitText={submitText}
        >
          <View class='content'>
            { visiable && <Input onInput={this.onChange} class={error && 'error'} password placeholder='请输入支付密码' /> }
            <View onClick={onForget} class='forget'>忘记密码</View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default Payment;

Payment.defaultProps = {
  visiable: false,
  title: '安全验证',
  submitText: '支付',
  onSubmit: () => {},
  onCancel: () => {},
  onForget: () => {},
  loading:false,
}
