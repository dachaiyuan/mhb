import Taro from '@tarojs/taro';
import sha256 from 'crypto-js/sha256';
import fly from '~/utils/fly';
import api from '~/utils/api';

export default {
  passwordResetSMS(){
    return fly.post(api.passwordResetSMS)
  },
  passwordReset(body){
    let bodys = JSON.parse(JSON.stringify(body))
    bodys.new_password = sha256(body.new_password).toString();
    delete bodys.r_password
    return fly.put(api.passwordReset, bodys);
  },
  passwordUpdate(data){
    let datas = JSON.parse(JSON.stringify(data))
    datas.old_password = sha256(data.old_password).toString();
    datas.new_password = sha256(data.new_password).toString();
    delete datas.r_password
    return fly.put(api.password,datas)
  }
}