import modelExtend from 'dva-model-extend';
import { globalService, authService } from '~/services';
import base from './base';

export default modelExtend(base, {
  namespace: 'auth',
  state: { },
  effects: {
    *uploadAuth({ payload }, {put, call, select }){
      yield put.resolve({ type: 'global/account' })
      const { account: { id:accountId } } = yield select(state => state.global);
      const params = {
        ...payload,
        accountId
      }
      const url = yield call(globalService.upload, params);
      if(payload.imageType === 'font' || payload.imageType === 'back' || payload.imageType === 'company'){
        try{
          const { data } = yield call(authService[`${payload.imageType}OCR`], { image_url: url })
          return {
            data,
            url,
            text: '识别成功',
            color: '#2960EB'
          }
        }catch(e){
          return {
            url,
            text: '识别失败',
            color: '#f5222d'
          }
        }
      }else{
        return {
          url,
          text: '识别成功',
          color: '#2960EB'
        }
      }
    },
    *legalentity({ payload }, { call, put }){
      try{
        yield call(authService.legalentity, payload);
        yield put({ type:'router/navigateBack', payload: { title: '提交审核成功', url: '/pages/home/index' } })
      }catch(e){
        return Promise.resolve();
      }
    }
  },
})