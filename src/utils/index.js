import base64 from "base-64";
import { Crypto } from "./crypto.js"

module.exports = {
  aliOssParams(aid,aky) {
    var policyText = {
            "expiration": "2032-01-01T12:00:00.000Z",//上传的文件失效日期自己定义
            "conditions": [
              ["content-length-range", 0, 10485760000]//上传的内容大小，自己定义
            ]
    };
    var policy = base64.encode(JSON.stringify(policyText));//生成的加密策略
    var bytes = Crypto.util.HMAC(Crypto.util.SHA1, policy, aky, { asBytes: true }) ;
    var signature = Crypto.util.bytesToBase64(bytes);//生成的签名
    return {
      policy,
      signature,
      aid,
    }
  },
}