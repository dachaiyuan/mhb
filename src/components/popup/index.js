import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import './index.less';

export default class Popup extends Component {
  render() {
    const { visiable, title, submitText, list } = this.props;
    return (  
        <View>
          {
            visiable && (
              <View class='container'>
                <View class='block'>
                  <View class='header'>
                    <View>{title}</View>
                    <Text onClick={this.props.onCancel}>取消</Text>
                  </View>
                  <View class='content'>
                    { this.props.renderContent }
                  </View>
                  <View class='list'>
                    {
                      list.length && list.map( (item,index) => (
                        <View class='item' key={index}>
                          <Text>{item.name}</Text>
                          <Text>{item.value}</Text>
                        </View>
                        )
                      )
                    }
                  </View>
                  <View class='footer'>
                    <Button onClick={this.props.onSubmit}>{submitText || '确认'}</Button>
                  </View>
                </View>
              </View>  
            )
          }  
        </View>
    );
  }
}