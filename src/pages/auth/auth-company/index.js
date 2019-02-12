import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { FormLayout } from '~/components';
import { connect } from '@tarojs/redux';
import imgs from '~/utils/imgs';
import './index.less';

@connect(({loading}) => ({loading}))
class AuthCompany extends Component {
  
  config = {
    navigationBarTitleText: '企业认证',
  }

  state = {
    font: {
      url: '',
      text: '拍摄/上传身份证正面照片',
      color: '#574F5F'
    },
    back: {
      url: '',
      text: '拍摄/上传身份证反面照片',
      color: '#574F5F'
    },
    company: {
      url: '',
      text: '拍摄/上传营业执照正面照片',
      color: '#574F5F'
    },
  }

  form = {
    type: 'COMPANY',
    region: 'CN',
    verification_images: new Array(3).fill('')
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
    imageType === 'company' && (this.form.verification_images[0] = res.url);
    imageType === 'font' && (this.form.verification_images[1] = res.url);
    imageType === 'back' && (this.form.verification_images[2] = res.url);
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
    const { font, back, company } = this.state;
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
            <View onClick={this.setImage.bind(this,'font')} class='ocr'>
              <View class='image' style={{backgroundImage: `url(${font.url || imgs.idCardFace})`}}></View>
              <View style={{color:font.color}}>{font.text}</View>
            </View>
            <View onClick={this.setImage.bind(this,'company')}  class='ocr'>
              <View class='image-company' style={{backgroundImage: `url(${company.url || imgs.idCompany})`}}></View>
              <View style={{color:company.color}}>{company.text}</View>
            </View>
            <View onClick={this.setImage.bind(this,'back')} class='ocr'>
              <View class='image' style={{backgroundImage: `url(${back.url || imgs.idCardBack})`}}></View>
              <View style={{color:back.color}}>{back.text}</View>
            </View>

          </View>
          <View class='form'>
            <View class='item'>
              <View>姓名</View>
              <View class={!!font.data && 'primary-color'}>{ font.data && font.data.name || '未识别'}</View>
            </View>
            <View class='item'>
              <View>身份证号</View>
              <View class={!!font.data && 'primary-color'}>{ font.data && font.data.identification_value || '未识别'}</View>
            </View>
            <View class='item'>
              <View>身份证有效期</View>
              <View class={!!back.data && 'primary-color'}>{ back.data && back.data.expiry_date || '未识别'}</View>
            </View>
            <View class='item'>
              <View>统一社会信用代码</View>
              <View class={!!company.data && 'primary-color'}>{ company.data && company.data.identification_value || '未识别'}</View>
            </View>
          </View>
        </View>
      </FormLayout>  
    );
  }
}

export default AuthCompany;