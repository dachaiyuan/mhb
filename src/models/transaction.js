import modelExtend from 'dva-model-extend';
import { transactionService } from '~/services';
import base from './base';

export default modelExtend(base, {
  namespace: 'transaction',
  state: {
    transactions: [],
    pagination: {
      page: 0,
      size:10
    },
    transaction: {}
  },
  effects: {
    *init(_,{put}){
      yield put.resolve({ type:'transactions', payload: { page: 0, size: 10 } })
    },
    *transactionDetail({ payload }, { call, put }){
      const { data } = yield call(transactionService.transactionDetail, payload);
      console.log(data);
      yield put({ type: 'saveTransaction', payload: { ...payload.params, ...data } })
    },
    *transactions({ payload },{call,put, select}){
      const { transactions, pagination, regions } = yield select( state => state.transaction);
      payload = { size:pagination.size, page:pagination.page+1, ...payload }
      const { data, pagination: { number, size, last } } = yield call(transactionService.transactions, payload);
      const t = data.map( item =>{
        let res = {};
        switch (item.type) {
          case "DEPOSIT_STORE":
            {
              res.transactionType = 'transactions_deposit_virtual';
              res.region = regions[item.region];
              res.type = "境";
              res.title = "境外账户收款";
              res.from = `来自：${res.region}  ${item.purpose}`;
              break;
            }
          case "DEPOSIT_NORMAL":
            {
              res.transactionType = 'transactions_deposit_normal';
              res.type = "贸";
              res.title = "外贸收款";
              if(item.trade_type === 'GOODS'){
                res.from = `类型：货物贸易`;
              }else if(item.trade_type === 'SERVICE'){
                res.from = `类型：服务贸易`;
              }else{
                res.from = `类型：其它`;
              }
              break;
            }
          case "TRANSFER_IN":
            {
              res.transactionType = 'transactions_transfer_in';
              res.type = "妙";
              res.title = "妙汇宝收款";
              res.from = `来自账号：${item.account_name}`;
              break;
            }
          case "TRANSFER_SCAN_IN":
            {
              res.transactionType = 'transactions_transferscan_in';
              res.type = "二";
              res.title = "二维码收款";
              res.from = `来自账号：${item.account_name}`;
              break;
            }
          case "TRANSFER_OUT":
            {
              res.transactionType = 'transactions_transfer_out';
              res.type = "妙";
              res.title = "妙汇宝转账";
              res.from = `收款账号：${item.to_account_name}`;
              break;
            }
          case "TRANSFER_SCAN_OUT":
            {
              res.transactionType = 'transactions_transferscan_out';
              res.type = "二";
              res.title = "二维码付款";
              res.from = `收款账号：${item.to_account_name}`;
              break;
            }
          case "EXCHANGE":
            {
              res.transactionType = 'transactions_exchange';
              res.type = "结";
              res.title = "结汇";
              res.from = `${item.currency}兑${item.outward_currency}`;
              break;
            }
          case "WITHDRAW":
            {
              res.transactionType = 'transactions_withdraw';
              res.type = "提";
              res.title = "提现";
              res.from = `到账账号：${item.to_bank_name}(${item.to_account_number.slice(-4)})`;
              break;
            }
          case "PAYMENT":
            {
              res.transactionType = 'transactions_payment';
              res.type = "卡";
              res.title = "转账至银行卡";
              res.from = `收款账号：${item.to_bank_name}(${item.to_account_number.slice(-4)})`;
              break;
            }
          default:
            {
              res.type = "-";
              res.title = "-";
              res.from = "-";
            }
        }
        switch (item.status) {
          case "SUCCESS":
            {
              res.info = "交易成功";
              res.infoColor = "#32DEC4";
              break;
            }
          case "PENDING":
            {
              res.info = "交易中...";
              res.infoColor = "#574F5F";
              break;
            }
          case "FAILED":
            {
              res.info = "交易失败";
              res.infoColor = "#ed4014";
              break;
            }
          default:
            {
              res.info = "-";
              res.infoColor = ""
            }
        }
        res.id = item.id;
        res.gmt_create = item.gmt_create;
        res.show_amount = item.show_amount;
        res.data = item;
        return res;
      })
      yield put({
        type: 'save',
        payload: {
          transactions: payload.page == 0?t:transactions.concat(t),
          pagination: {
            page:number,
            size,
            last
          }
        }
      })
    }
  },
  reducers: {
    saveTransaction(state, { payload }) {
      const { regions } = state;
      let res = { };
      switch (payload.status) {
        case "SUCCESS":
          {
            res.info = "完成";
            res.infoColor = "#32DEC4";
            res.icon = "wancheng";
            if(payload.verify_status === 'PASSED'){
              res.pload_dto = payload.pload_dto;
            }
            break;
          }
        case "PENDING":
          {
            res.info = "交易中";
            res.infoColor = "#574F5F";
            res.icon = "zhihangzhong";
            if(payload.verify_status){
              if(payload.verify_status === 'PASSED'){
                res.info = "汇款中";
                res.pload_dto = payload.pload_dto;
              }else{
                res.info = "审核中";
              }
            }
            break;
          }
        case "FAILED":
          {
            res.info = "失败";
            res.infoColor = "#ed4014";
            res.icon = "delete"
            break;
          }
        default:
          {
            res.info = "-";
            res.infoColor = ""
          }
      }
      switch (payload.type){
        // 境外账户收款
        case 'DEPOSIT_STORE': {
          res.list = [
            { label: '境外账号', text: payload.to_account_number },
            { label: '地域', text: regions[payload.region] },
            { label: '平台', text: payload.purpose },
            { label: '到账时间', text: payload.gmt_create },
          ]
          break;
        }
        // 外贸收款
        case 'DEPOSIT_NORMAL': {
          if(res.info == "审核中"){
            res.list = [
              { label: '汇款币种', text: payload.currency },
              { label: '汇款金额', text: payload.amount },
              { label: '发起时间', text: payload.gmt_create },
            ]
          }else{
            res.list = [
              { label: '汇款币种', text: payload.currency },
              { label: '汇款金额', text: payload.amount },
              { label: '手续费', text: payload.fee },
              { label: '到账金额', text: payload.inward_amount },
              { label: '发起时间', text: payload.gmt_create },
            ]
          }

          break;
        }
        // 二维码收款 完成
        case "TRANSFER_SCAN_IN": {
          res.list = [
            { label: '币种', text: payload.currency },
            { label: '收款金额', text: payload.amount },
            { label: '付款账户', text: payload.account_name },
            { label: '备注', text: payload.comment },
            { label: '发起时间', text: payload.gmt_create },
          ]
          break;
        }
        // 二维码付款 完成
        case "TRANSFER_SCAN_OUT": {
          res.list = [
            { label: '币种', text: payload.currency },
            { label: '付款金额', text: payload.amount },
            { label: '收款账户', text: payload.to_account_name },
            { label: '备注', text: payload.comment },
            { label: '付款时间', text: payload.gmt_create },
          ]
          break;
        }
        // 妙汇宝收款 完成
        case "TRANSFER_IN": {
          res.list = [
            { label: '币种', text: payload.currency },
            { label: '收款金额', text: payload.amount },
            { label: '汇出账户', text: payload.account_name },
            { label: '到账时间', text: payload.gmt_create },
          ]
          break;
        }
        // 妙汇宝转账 完成
        case "TRANSFER_OUT": {
          res.list = [
            { label: '币种', text: payload.currency },
            { label: '出账金额', text: payload.amount },
            { label: '到账账户', text: payload.to_account_name },
            { label: '发起时间', text: payload.gmt_create },
          ]
          break;
        }
        // 结汇 完成
        case "EXCHANGE": {
          res.list = [
            { label: '卖出币种', text: payload.currency },
            { label: '出账金额', text: payload.amount },
            { label: '买入币种', text: payload.outward_currency },
            { label: '入账金额', text: payload.outward_amount },
            { label: '发起时间', text: payload.gmt_create },
          ]
          break;
        }
        // 提现 完成
        case "WITHDRAW": {
          res.list = [
            { label: '提现币种', text: payload.currency },
            { label: '提现金额', text: payload.amount },
            { label: '手续费', text: payload.fee },
            { label: '到账金额', text: payload.outward_amount },
            { label: '到账银行卡', text: payload.to_bank_account_number },
            { label: '发起时间', text: payload.gmt_create },
          ]
          break;
        }
        // 银行卡转账 完成
        case "PAYMENT": {
          res.list = [
            { label: '转账币种', text: payload.currency },
            { label: '转账金额', text: payload.amount },
            { label: '转账手续费', text: payload.fee },
            { label: '收款账号', text: payload.to_account_number },
            { label: '发起时间', text: payload.gmt_create },
          ]
          break;
        }
        default: res.list = [];
      }
      return Object.assign({}, state, { transaction: res })
    },
  }
})