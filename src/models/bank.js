import modelExtend from 'dva-model-extend';
import { bankService, baseService } from '~/services';
import base from './base';

export default modelExtend(base, {
  namespace: 'bank',
  state: {
    banks: [],
    balances: [],
    availableCurrencies: []
  },
  effects: {
    *banks(_,{call, put}){
      const { data: banks } = yield call(bankService.banks);
      yield put({type:'save',payload:{banks}})
      return banks;
    },
    *bankAddSMS({payload},{call}){
      return yield call(bankService.bankAddSMS,payload);
    },
    *bankAdd({payload},{call}){
      return yield call(bankService.bankAdd,payload);
    },
    *initHK(_,{call, put, all}){
      const [res, { data: availableCurrencies  }] = yield all([
        put.resolve({type:'global/balances'}),
        call(baseService.availableCurrencies, { region: 'HK', type:'BINDBANK' })
      ]);
      let balances = res.filter( item => availableCurrencies.some(val => val === item.currency));
      yield put({type:'save', payload:{ balances }});
      return balances;
    },
  },
})