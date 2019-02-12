import modelExtend from 'dva-model-extend';
import { gatherService } from '~/services';
import base from './base';

export default modelExtend(base, {
  namespace: 'gather',
  state: {
    
  },
  effects: {
    *createCollections({payload},{call}){
      const { data: { id, url_prefix } } = yield call(gatherService.createCollections, payload);
      return {
        ...payload,
        content: `${url_prefix}${id}`
      }
      // yield put({type:'router/navigateTo', payload: { url:'/pages/gather/index', params: { ...payload, content: `${url_prefix}${id}` } }})
    }
  },
})