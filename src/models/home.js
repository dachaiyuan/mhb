import modelExtend from 'dva-model-extend';
import { homeService } from '~/services';
import base from './base';

export default modelExtend(base, {
  namespace: 'home',
  state: {
    accounts: {
      list: [],
      totalElements: 0,
      size: 10,
      page: 0,
    },
    activities:[]
  },
  effects: {
    *init(_,{put}){
      yield put({type:'global/account'});
      yield put({type:'activities'});
      yield put({type:'notice/todoNum'});
    },
    *activities(_, { call, put }){
      const { data: activities } = yield call(homeService.activities);
      yield put({
        type: 'save',
        payload: {
          activities
        }
      })
    }
  },
})