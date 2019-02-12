import Taro from '@tarojs/taro';
import fly from '~/utils/fly';
import api from '~/utils/api';
import { aliOssParams } from '~/utils';
import { HOST_UPLOAD, region, bucket } from '~/utils/constants';

export default {
  async loginSMS(data) {
    return fly.post(api.loginSMS, data);
  },
  async login (data) {
    const res = await fly.post(api.login, data, { headers: { ['x-acorn-client']: '', } });
    Taro.setStorageSync('loginUserinfo', '1')
    return res;
  },
  async loginWeiXin ({code, encrypted_data, iv}) {
    Taro.showLoading({title:'登录中'});
    try{
      const res = await fly.post(api.login, { code, encrypted_data, iv });
      Taro.setStorageSync('loginUserinfo', '1')
      Taro.hideLoading();
      return res;
    }catch(e){
      Taro.hideLoading();
    }
  },
  async account() {
    const res = await fly.get(api.account);
    const { data: { legal_entity_status } } = res;
    legal_entity_status === 'CONFIRMED' && Taro.setStorageSync('authStatus','1')
    legal_entity_status === 'REJECTED' && Taro.setStorageSync('authStatus','-1')
    legal_entity_status === 'VERIFYING' && Taro.setStorageSync('authStatus','-2')
    !legal_entity_status  && Taro.setStorageSync('authStatus','0')
    return res;
  },
  async constants() {
    return fly.get(api.constants);
  },
  async upload({accountId, filePath, imageSrc = 'identity', imageType = ''} = {}) {
    const imageSrcs = {
      avatar: 'avatar',
      identity: 'legal-entity',
    }
    const { data: { access_key_id, access_key_secret, security_token } } = await fly.get(api.sts);
    const { policy, signature } = aliOssParams(access_key_id, access_key_secret);
    const key = `${imageSrcs[imageSrc]}/${accountId}-${imageType}-${new Date().getTime()}${filePath.slice(filePath.lastIndexOf('.'))}`;
    await Taro.uploadFile({
      url: HOST_UPLOAD,
      filePath,
      name: 'file',
      formData: {
        key,
        region,
        OSSAccessKeyId: access_key_id,
        bucket,
        success_action_status: '200',
        policy: policy,
        signature: signature,
        'x-oss-security-token': security_token,
      },
    });
    return HOST_UPLOAD + key;
  },
  
}