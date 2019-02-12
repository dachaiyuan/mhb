import Taro, { Component } from '@tarojs/taro';
import { View, Button, Text } from '@tarojs/components';
import './index.less';

class mButton extends Component {
  state = {
    second:0,
    loadings: false,
  }
  set = null;
  onClick = () => {
    const { mode, timer, onClick } = this.props;
    if(mode==='timer'){
      new Promise( resolve => {
        onClick(resolve);
        this.setState({
          loadings:true
        })
      }).then( res => {
        if( res ){
          Taro.showToast({title:'验证码已发送'});
          clearInterval(this.set);
          this.set = null;
          this.setState({second:timer})
          this.set = setInterval(() => {
            const { second } = this.state;
            if( second == 0 ) {
              clearInterval(this.set);
              this.set = null;
              return;
            } 
            this.setState({
              second: second-1
            })
          }, 1000);
        }
        this.setState({
          loadings:false
        })
      })
    }else{
      onClick();
    }
  }
  render() {
    const { type, styles, width, disabled, mode, loading} = this.props;
    const { second, loadings } = this.state;
    const disableds = disabled || (mode === 'timer' && second > 0);
    const blankSpace = ' ';
    return (
      <View style={styles} class='container'>
        <Button loading={loading || loadings} onClick={this.onClick} class={(disableds || loading || loadings)?'disabled':type} style={{width}} disabled={disableds}>
          {
            loading === true && <Text>{blankSpace}</Text>
          }
          {
            mode === 'timer' && second > 0 ? second:this.props.children
          }
          {
            mode === 'normal' && this.props.children
          }
        </Button>
      </View>
    );
  }
}

export default mButton;

mButton.defaultProps = {
  styles: {},
  type: 'primary',
  timer: 120,
  mode: 'normal',
  width: 'auto',
  disabled: false,
  loading:false,
}