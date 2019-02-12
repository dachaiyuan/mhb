import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Image, Text, Swiper, SwiperItem } from '@tarojs/components'
import { AtBadge, AtIcon } from 'taro-ui'
import imgs from '~/utils/imgs'
import './index.less'

@connect(({ home, global, notice }) => ({ ...home, ...global, ...notice }))
class Home extends Component {
  config = {
    navigationBarTitleText: '首页',
    navigationStyle: 'custom',
  }
  state = {
    current: 0
  }
  componentDidShow(){
    const { dispatch } = this.props;
    dispatch({type:'home/init'})
  }
  onSwiperChange = ({ detail: { current } }) => {
    this.setState({
      current
    })
  }
  onScan = async () => {
    const { dispatch } = this.props;
    const flag = await dispatch({ type: 'router/AuthLimit' })
    if(flag){
      const { result: qrCodeData } = await Taro.scanCode({ scanType: ['qrCode'] });
      const id = qrCodeData.slice(qrCodeData.lastIndexOf('/') + 1);
      await dispatch({ type: 'transfer/getCollections', payload: { id } });
      dispatch({ type: 'router/navigateTo', payload: { url: '/pages/transfer/scan/index', params: { qrCodeData } } })
    }
  }
  render () {
    const { account: { avatar, name, mobile }, activities, todoNum  } = this.props;
    const { current } = this.state;
    return (
      <View class='container'>
        <View class='header-bg' style={{backgroundImage:`url(${imgs.homeHeaderBg})`}}></View>
        <View class='header'>
          <View class='avatar'>
            <Image src={!!avatar?avatar:imgs.defaultAvatar} />
          </View>
          <View>
            <View>
              <View>{name}</View>
              <Text>{mobile}</Text>
            </View>
          </View>
          <View onClick={this.props.dispatch.bind(this, { type: 'router/navigateTo', payload: { url: '/pages/notice/index' } })} >
            <AtBadge value={todoNum == '0'?'':todoNum} >
              <AtIcon prefixClass='icon' value='notice'  color='#FFF'></AtIcon>
            </AtBadge>
          </View>
        </View>
        <View class='main-content'>
          <View class='main'>
            <View 
              class='center'
              style={{backgroundImage:`url(${imgs.transferBg})`}}
              onClick={this.props.dispatch.bind(this, { type: 'router/navigateTo', payload: { url: '/pages/transfer/index' } })} 
            >
              <View class-='content flex'>
                <AtIcon prefixClass='icon' value='zhuanzhang'  color='#FFF'></AtIcon>
                <View>
                  <View class='f26'>转账</View>
                  <Text class='f20'>快速转账</Text>
                </View>
              </View>
            </View>
            <View
              class='center'
              style={{backgroundImage:`url(${imgs.withdrawBg})`}}
              onClick={this.props.dispatch.bind(this, { type: 'router/navigateTo', payload: { url: '/pages/withdraw/index' } })}
            >
              <View class='content flex'>
                <AtIcon prefixClass='icon' value='tixian1'  color='#FFF'></AtIcon>
                <View>
                  <View class='f26'>提现</View>
                  <Text class='f20'>免手续费</Text>
                </View>
              </View>
            </View>
          </View>
          <View class='more'>
            <View onClick={this.props.dispatch.bind(this, { type: 'router/navigateTo', payload: { url: '/pages/rate/index' } })} >
              <Image src={imgs.hl} />
              <View>汇率</View>
            </View>
            <View onClick={this.props.dispatch.bind(this, { type: 'router/navigateTo', payload: { url: '/pages/exchange/index' } })} >
              <Image src={imgs.jh} />
              <View>结汇</View>
            </View>
            <View onClick={this.onScan}>
              <Image src={imgs.fk} />
              <View>付款</View>
            </View>
            <View onClick={this.props.dispatch.bind(this, { type: 'router/navigateTo', payload: { url: '/pages/gather/gather-set/index' } })}  >
              <Image src={imgs.sk} />
              <View>收款</View>
            </View>
          </View>
        </View>
        <View class='activity-content'>
          <View class='title'>
            <Text class='f32'>特色活动</Text>
            <Text class='f30'>{current+1}/{activities.length}</Text>
          </View>
          <View>
            <Swiper
              className='swiper'
              circular
              autoplay
              onChange={this.onSwiperChange}
              previous-margin='18px'
              next-margin='18px'
            >
              {
                activities.map( (activity,index) => (
                  <SwiperItem key={index} class='swiper-image'>
                    <Image src={activity.image_url} />
                  </SwiperItem>
                ))
              }
            </Swiper>
          </View>
        </View>
      </View>
    )
  }
}

export default Home;
