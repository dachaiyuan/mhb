import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { connect } from '@tarojs/redux'
import imgs from '~/utils/imgs'
import './index.less'

@connect(({ user, global }) => ({ ...user, ...global }))
export default class User extends Component {

  config = {
    navigationBarTitleText: '我的',
    navigationStyle: 'custom',
  }

  componentDidShow(){
    const { dispatch } = this.props;
    dispatch({type:'user/init'})
  }

  render () {
    const { account: { avatar, name, mobile, legal_entity_status, legal_name }, balances } = this.props;
    return (
      <View class='container'>
        <View class='header-bg' style={{backgroundImage:`url(${imgs.userHeaderBg})`}}></View>
        <View class='header'>
          <View class='title'>
            <Text class='f20'>{legal_entity_status === 'CONFIRMED'?legal_name:''}</Text>
            {
              !legal_entity_status && (
                <View class='no-auth f22'
                  onClick={this.props.dispatch.bind(this, { type: 'router/navigateTo', payload: { url: '/pages/auth/index' } })}
                >
                  未认证
                </View>
              )
            }
            {
              legal_entity_status === 'REJECTED' && (
                <View class='false-auth f22'
                  onClick={this.props.dispatch.bind(this, { type: 'router/navigateTo', payload: { url: '/pages/auth/index' } })}
                >
                  认证失败
                </View>
              )
            }
            {
              legal_entity_status === 'VERIFYING' && (
                <View class='authing f22'>
                  认证中
                </View>
              )
            }
            {
              legal_entity_status === 'CONFIRMED' && (
                <View class='auth f22'>
                  已认证
                </View>
              )
            }
          </View>
          <View class='content'>
            <Image class='avatar' src={!!avatar?avatar:imgs.defaultAvatar} />
            <View class='flex1'>
              <View class='f36'>{name}</View>
              <Text class='f20'>{mobile}</Text>
            </View>
            <View onClick={this.props.dispatch.bind(this, { type: 'router/navigateTo', payload: { url: '/pages/user/personal/index' } })} class='set'>
              <AtIcon prefixClass='icon' value='shezhi'  color='#574F5E'></AtIcon>
            </View>
          </View>
        </View>
        <View class='main'>
          <View onClick={this.props.dispatch.bind(this, { type: 'router/navigateTo', payload: { url: '/pages/bank/index' } })} >
            <Image src={imgs.yhk} />
            <View>银行卡</View>
          </View>
          <View onClick={this.props.dispatch.bind(this, { type: 'router/navigateTo', payload: { url: '/pages/safety/index' } })}>
            <Image src={imgs.aqzx} />
            <View>安全中心</View>
          </View>
          <View onClick={this.props.dispatch.bind(this, { type: 'router/navigateTo', payload: { url: '/pages/transaction/index' } })}>
            <Image src={imgs.zd} />
            <View>账单</View>
          </View>
        </View>
        <View class='more'>
          <View class='title f32'>资产</View>
          <View class='content f30'>
            {
              balances.map( (balance, index) => (
                <View key={index}>
                  <View class='amount'><Text style={{backgroundColor:`${balance.color}`}}></Text>{balance.symbol}{balance.amount}</View>
                  <View class='currency f20' style={{color:`${balance.color}`}}>{balance.currency}</View>
                </View>
              ))
            }
          </View>
        </View>
      </View>
    )
  }
}