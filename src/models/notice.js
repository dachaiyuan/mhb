import modelExtend from 'dva-model-extend';
import { noticeService } from '~/services';
import base from './base';

export default modelExtend(base, {
  namespace: 'notice',
  state: {
    todos: [],
    pagination: {
      page: 0,
      size:10
    },
    todoNum: 0,
    acornPublicNotifications: {
      request: false,
      images: []
    }
  },
  effects: {
    *init(_,{put}){
      yield put.resolve({ type:'todos', payload: { page: 0, size: 10 } })
    },
    *todos({payload},{call,put, select}){
      const { todos, pagination } = yield select( state => state.notice);
      payload = { size:pagination.size, page:pagination.page+1, ...payload };
      const { data, pagination: { number, size, last } } = yield call(noticeService.todos, payload);
      const t = data.map( item => {
        let res = { };
        switch (item.type) {
          case 'LEGAL_INIT':{
            res.content = '您好！您尚未进行实名审核，请前往实名认证';
            res.url = '/pages/auth/index';
            break;
          }
          case 'LEGAL_NOPASS':{
            res.content = '您好！您的实名未通过，请重新提交材料';
            res.url = '/pages/auth/index';
            break;
          }
          case 'LEGAL_PASS':{
            res.content = '您好！您的实名已通过。';
            res.url = '';
            break;
          }
          case 'PAYPASSWORD_INIT':{
            res.content = '您好！您尚未设置交易密码，请前往安全中心。';
            res.url = '/pages/safety/index';
            break;
          }
          case 'VBAA_DEPOSIT_SUCCESS':{
            res.content = `您有一笔『境外收款账户』的收款已到账，金额：${item.payload.amount}${item.payload.currency}。`;
            res.url = '';
            break;
          }
          case 'VBAA_FAIL':{
            res.content = `您好！您的『境外收款账户』审核未通过`;
            res.url = '';
            break;
          }
          case 'VBAA_SUCCESS':{
            res.content = `您好！您的『境外收款账户』审核已通过`;
            res.url = '';
            break;
          }
          case 'VIRTUALBANK_MATERIAL_NOPASS':{
            res.content = `您有一笔『境外收款账户』的入账需补充材料`;
            res.url = '';
            break;
          }
          case 'DEPOSIT_MATERIAL_NOPASS':{
            res.content = `您好！您的『外贸收款』审核未通过。`;
            res.url = '';
            res.payload = item.payload;
            break;
          }
          case 'DEPOSIT_MATERIAL_PASS':{
            res.content = `您好！您的『外贸收款』审核已通过，请在3个工作日内，将资金汇款至（如有疑问请联系客户经理）：`;
            res.url = '';
            res.payload = item.payload;
            break;
          }
          case 'TRANSFER_SCAN_SUCCESS':{
            res.content = `您收到一笔二维码转账，收款${item.payload.amount}${item.payload.currency}。`;
            res.url = '';
            break;
          }
          case 'TRANSFER_SUCCESS':{
            res.content = `您收到一笔来自${item.payload.name}的转账，金额：${item.payload.amount}${item.payload.currency}。`;
            res.url = '';
            break;
          }
          default:
            res.content = '';
            break;
        }
        res.gmt_create = item.gmt_create;
        res.id = item.id;
        res.source = item;
        return res;
      })
      yield put({
        type: 'save',
        payload: {
          todos: payload.page == 0?t:todos.concat(t),
          pagination: {
            page:number,
            size,
            last
          }
        }
      })
      
    },
    *todoNum(_, { call, put }){
      const { data } =  yield call(noticeService.todoNum);
      yield put({ type:'save', payload: { todoNum: data } })
    },
    *todoRead(_, { call }){
      try{
        yield call(noticeService.todoRead)
      }catch(e){}
    },
    *acornPublicNotifications(_, { call, put }){
      const { data } = yield call(noticeService.acornPublicNotifications);
      yield put({ type:'save', payload: { acornPublicNotifications: { request: true, images: data } } });
      return data;
    }
  },
})