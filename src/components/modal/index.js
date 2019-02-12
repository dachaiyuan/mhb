import Taro, { Component } from '@tarojs/taro';
import { View, Button, Text } from '@tarojs/components';
import { AtIcon } from 'taro-ui'
import './index.less';

class Modal extends Component {
  state = {
    cls: 'none',
  }
  componentWillReceiveProps(nextProps){
    const { visiable } = nextProps;
    const { visiable: visiables } = this.props;
    let timer = null;
    if(visiable){
      this.setState({cls:''})
    }else if(visiables && !visiable){
      this.setState({cls:'aim'})
      timer = setTimeout(() => {
        this.setState({cls:'none'})
        clearTimeout(timer);
      }, 400);
    }
  }
  render() {
    const { title, submitText, onSubmit, onCancel, loading, top } = this.props;
    const { cls } = this.state;
    const blankSpace = ' '
    return (
      <View catchtouchmove='handleTouchMove'>
        {/* {
          visiable && (
            <View class='container'>
              <View class='block' style={{marginTop: `${top}rpx`}}>
                <View class='header'>
                  <View>{title || ''}</View>
                  <View onClick={onCancel} class='cancel'>
                    <AtIcon  value='close'  color='#574F5F' size='18'></AtIcon>
                  </View>
                </View>
                <View class='content'>
                  {this.props.children}
                </View>
                <Button class={`footer ${loading && 'opacity'}`} loading={loading}  onClick={onSubmit}>
                  { loading === true && <Text>{blankSpace}</Text> }
                  {submitText}
                </Button>
              </View>
            </View>
          )
        } */}
        <View class={`container ${cls}`}>
          <View class='block' style={{marginTop: `${top}rpx`}}>
            <View class='header'>
              <View>{title || ''}</View>
              <View onClick={onCancel} class='cancel'>
                <AtIcon  value='close'  color='#574F5F' size='18'></AtIcon>
              </View>
            </View>
            <View class='content'>
              {this.props.children}
            </View>
            <Button class={`footer ${loading && 'opacity'}`} loading={loading}  onClick={onSubmit}>
              { loading === true && <Text>{blankSpace}</Text> }
              {submitText}
            </Button>
          </View>
        </View>
      </View>  
    );
  }
}

export default Modal;

Modal.defaultProps = {
  visiable: false,
  title: '',
  submitText: '确定',
  onSubmit: () => {},
  onCancel: () => {},
  loading:false,
  top: -180
}