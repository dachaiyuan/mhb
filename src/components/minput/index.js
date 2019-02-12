import Taro, { Component } from '@tarojs/taro';
import { View, Input } from '@tarojs/components';
import './index.less';

class Minput extends Component {
  state = {
    warns:false
  }
  onChange = e => {
    const { target: { value } } = e
    const { onChange, trim } = this.props;
    if(trim){
      e.target.value = value.trim()
    }
    if(e.target.value){
      this.setState({
        warns:false
      })
    }
    onChange(e);
  }
  setWarns = warns => {
    this.setState({
      warns
    })
  }
  render() {
    const { warns } = this.state;
    const { placeholder, password, defaultValue, value,  disabled, type, warn } = this.props;
    return (
      <View class='container'>
        <Input
          onInput={this.onChange}
          class={`content ${warn && 'error-border'} ${warns && 'error-border'}`}
          value={!!value?value:defaultValue}
          placeholder={placeholder}
          password={password}
          disabled={disabled}
          type={type}
        />
      </View>
    );
  }
}

export default Minput;

Minput.defaultProps = {
  placeholder: '',
  disabled: false,
  password: false,
  defaultValue: '',
  value: '',
  type: 'text',
  warn: false,
  trim: true,
  pattern: null,
  onChange: () => {}
}