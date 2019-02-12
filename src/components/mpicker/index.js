import Taro, { Component } from '@tarojs/taro';
import { View, Picker } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import './index.less';

class Mpicker extends Component {
  state = {
    value: ''
  }
  componentDidMount(){
    this.init(this.props);
  }
  componentWillReceiveProps(nextProps){
    this.init(nextProps);
  }
  init(nextProps){
    const { value, range, rangeKey } = nextProps;
    if(!!value){
      range.some((item) => {
        if(item[rangeKey] === value){
          this.setState({
            value
          })
        }
        return item[rangeKey] === value
      })
    }
  }
  nativeChange = ({ detail: { value } }) => {
    const { onChange, rangeKey, range, full } = this.props;
    this.setState({
      value:range[value][rangeKey]
    })
    if(full){
      onChange({ value: range[value] })
    }else{
      onChange({ value: range[value][rangeKey]})
    }
  }
  render() {
    const { range, rangeKey, disabled } = this.props;
    const { value } = this.state;
    return (
      <View class='container'>
        <Picker onChange={this.nativeChange} range={range} range-key={rangeKey} class='picker'  disabled={disabled}>
          <View class='content'>
            <View>{value}</View>
            <AtIcon prefixClass='icon' value='webicon215' size='20'></AtIcon>
          </View>
        </Picker>
      </View>
    );
  }
}

export default Mpicker;

Mpicker.defaultProps = {
  disabled: false,
  value: '',
  range: [],
  rangeKey: '',
  onChange: () => {},
  full: false,
}