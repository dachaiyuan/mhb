import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { FormLayout } from '~/components';
import { connect } from '@tarojs/redux';
import imgs from '~/utils/imgs';
import './index.less';

@connect(({loading}) => ({loading}))
class AuthCompanyHK extends Component {
  
  config = {
    navigationBarTitleText: '企业认证（香港）',
  }

  state = {
    gszcdjs: {
      url: '',
      text: '拍摄／上传公司注册登记书',
      color: '#574F5F',
    },
    fontHK: {
      url: '',
      text: '拍摄／上传身份证正面照片',
      color: '#574F5F',
    },
    sydjs: {
      url: '',
      text: '拍摄／上传商业登记书',
      color: '#574F5F',
    },
    backHK: {
      url: '',
      text: '拍摄／上传身份证反面照片',
      color: '#574F5F',
    },
    nnc1: {
      url: '',
      text: '拍摄／上传NNC1股东列表页',
      color: '#574F5F',
    },
  }

  form = {
    type: 'COMPANY',
    region: 'HK',
    verification_images: new Array(5).fill('')
  }

  setImage = async imageType => {
    const { dispatch } = this.props;
    const { tempFilePaths } = await Taro.chooseImage({ count: 1, sizeType: ['compressed']});
    Taro.showLoading({title:'上传识别中...'})
    const res = await dispatch({
      type: 'auth/uploadAuth',
      payload:{
        filePath:tempFilePaths[0],
        imageType
      }
    })
    setTimeout(() => {
      Taro.hideLoading();
    }, 500);
    this.setState({ [imageType]: res })
    imageType === 'fontHK' && (this.form.verification_images[0] = res.url);
    imageType === 'backHK' && (this.form.verification_images[1] = res.url);
    imageType === 'gszcdjs' && (this.form.verification_images[2] = res.url);
    imageType === 'sydjs' && (this.form.verification_images[3] = res.url);
    imageType === 'nnc1' && (this.form.verification_images[4] = res.url);
  }

  onSubmit = () => {
    const { dispatch } = this.props;
    const { verification_images } = this.form;
    if(verification_images.every(url => url)){
      dispatch({ type: 'auth/legalentity', payload: this.form })
    }else{
      Taro.showToast({title:'请按要求上传所有证件照片', icon:'none'})
    }
    
  }

  render() {
    const { gszcdjs, fontHK, sydjs, backHK, nnc1 } = this.state;
    const { loading } = this.props;
    return (
      <FormLayout
        onSubmit={this.onSubmit}
        submitText='提交审核'
        loading={loading.effects['auth/legalentity']}
      >
        <View class='container top-line'>
          <View class='top-tips f26'>请确认证件照片完整清晰，信息无误</View>
          <View class='ocrs'>
            <View onClick={this.setImage.bind(this,'gszcdjs')} class='ocr'>
              <View class='image-company' style={{backgroundImage: `url(${gszcdjs.url || imgs.gszcdjs})`}}></View>
              <View style={{color:gszcdjs.color}}>{gszcdjs.text}</View>
            </View>
            <View onClick={this.setImage.bind(this,'fontHK')} class='ocr'>
              <View class='image' style={{backgroundImage: `url(${fontHK.url || imgs.idCardFace})`}}></View>
              <View style={{color:fontHK.color}}>{fontHK.text}</View>
            </View>
            <View onClick={this.setImage.bind(this,'sydjs')}  class='ocr'>
              <View class='image-company' style={{backgroundImage: `url(${sydjs.url || imgs.sydjs})`}}></View>
              <View style={{color:sydjs.color}}>{sydjs.text}</View>
            </View>
            <View onClick={this.setImage.bind(this,'backHK')} class='ocr'>
              <View class='image' style={{backgroundImage: `url(${backHK.url || imgs.idCardBack})`}}></View>
              <View style={{color:backHK.color}}>{backHK.text}</View>
            </View>
            <View onClick={this.setImage.bind(this,'nnc1')} class='ocr'>
              <View class='image-company' style={{backgroundImage: `url(${nnc1.url || imgs.nnc1})`}}></View>
              <View style={{color:nnc1.color}}>{nnc1.text}</View>
            </View>
          </View>
        </View>
      </FormLayout>  
    );
  }
}

export default AuthCompanyHK;