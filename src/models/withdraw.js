import Taro from '@tarojs/taro';
import modelExtend from 'dva-model-extend';
import { withdrawService, baseService } from '~/services';
import base from './base';


export default modelExtend(base, {
  namespace: 'withdraw',
  state: {
    balances: [],
    limitAmount: {}
  },
  effects: {
    *init(_,{put, all}){
      const [ res, availableCurrencies, resBanks ] = yield all([
        put.resolve({type:'global/balances'}),
        put.resolve({type:'availableCurrencies'}),
        put.resolve({type:'bank/banks'})
      ]);
      let banks = resBanks.map( resBank => ({...resBank,  bank_names: `${resBank.bank_name}（${resBank.account_number.slice(-4)}）` }) )
      let balances = res.filter( item => availableCurrencies.some(val => val === item.currency)).map(v => ({...v, banks:[]}));
      banks.map( bank => balances.some( balance => bank.currency === balance.currency && balance.banks.push(bank) ) )
      yield put({
        type:'save',
        payload: {
          balances
        }
      })
      return !!balances.length?balances[0]:{ banks: [] }
    },
    *availableCurrencies(_,{call}){
      const { data } = yield call(baseService.availableCurrencies, { type:'WITHDRAW' });
      return data;
    },
    *limitAmount({payload},{call,put}){
      const { data } = yield call(withdrawService.limitAmount, payload);
      yield put({type:'save', payload: { limitAmount: data }})
    },
    *withdrawPre({payload},{call}){
      Taro.showLoading({title:'处理中'});
      const { data } = yield call(withdrawService.withdrawPre, payload);
      Taro.hideLoading();
      return data;
    },
    *withdraw({payload},{call, put}){
      try{
        yield call(withdrawService.withdraw, payload)
        yield put({type:'router/navigateBack', payload: { title: '提现成功' }})
      }catch(e){
        return Promise.resolve();
      }
    }
  },
})