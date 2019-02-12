import modelExtend from 'dva-model-extend';
import { exchangeService, baseService } from '~/services';
import imgs from '~/utils/imgs'
import base from './base';

export default modelExtend(base, {
  namespace: 'exchange',
  state: {
    current: { },
    currentRate: { },
    exchangeRateCurrent: [],
    balances: [],
    businessDatetime: {},
    exchangeRates: []
  },
  effects: {
    *init(_,{put, all}){
      yield put({type:"businessDatetime"});
      const [res, exchangeRateCurrent, availableCurrencies] = yield all([
        put.resolve({type:'global/balances'}),
        put.resolve({type:'exchangeRateCurrent'}),
        put.resolve({type:'availableCurrencies'})
      ]);
      let balances = res.filter( item => availableCurrencies.some(val => val === item.currency));
      if(balances.length) {
        let currentRate = {};
        exchangeRateCurrent.some( val => val.sell_currency === balances[0].currency && (currentRate = val) )
        yield put({type:'save',payload:{
          balances,
          current: balances[0],
          currentRate
        }})
      }
      return balances[0].currency;
    },
    *exchangeRateCurrent(_,{call,put}){
      const { data } = yield call(exchangeService.exchangeRateCurrent);
      yield put({type:'saveRate', payload: { exchangeRateCurrent: data }});
      return data;
    },
    *businessDatetime(_,{call,put}){
      const { data } = yield call(exchangeService.businessDatetime);
      yield put({type:'save',payload: { businessDatetime: data }})
      return data;
    },
    *availableCurrencies(_,{call}){
      const { data } = yield call(baseService.availableCurrencies, { type:'EXCHANGE' });
      return data;
    },
    *exchange({payload},{call, put}){
      try{
        yield call(exchangeService.exchange, payload);
        yield put({type:'router/navigateBack', payload: { title: '结汇成功', url: '/pages/home/index' }})
      }catch(e){
        return Promise.resolve();
      }
    },
    *exchangeRates({payload},{call, put}){
      const { data } = yield call(exchangeService.exchangeRates, payload);
      yield put({type:'save',payload:{ exchangeRates:data } })
    }
  },
  reducers: {
    saveCurrent(state, { payload }){
      const { exchangeRateCurrent } = state;
      let currentRate = {};
      exchangeRateCurrent.some( val => val.sell_currency === payload.current.currency && (currentRate = val) )
      return Object.assign({}, state, { ...payload, currentRate })
    },
    saveRate(state, { payload }){
      let exchangeRateCurrent = payload.exchangeRateCurrent.map(rate => {
        rate.buy_currency_pic = imgs[`${rate.buy_currency}c`]
        rate.sell_currency_pic = imgs[`${rate.sell_currency}c`]
        return rate;
      })
      return Object.assign({}, state, { exchangeRateCurrent })
    }
  }
})