const API = '/api'

export default {
  sts: `${API}/aliyun/sts`,
  // sms验证码
  loginSMS: `${API}/sms/login`,
  // 手机号登录
  login: `${API}/auth/login`,

  // 用户相关
  // 用户信息
  account: `${API}/account`,
  // 查询用户列表
  accounts: `${API}/accounts`,
  // 更新用户昵称
  accountName: `${API}/account/name`,
  // 更新用户头像
  accountAvatar: `${API}/account/avatar`,
  // 获取最近转账好友信息
  recentTransfer: `${API}/recent_transfer_accounts`,

  // 活动列表
  activities: `${API}/activities`,
  // 常量相关
  constants: `${API}/constants/amazon/mws`,
  // 余额相关
  balances: `${API}/balances`,
  // 银行卡相关
  bank: `${API}/bank_accounts`,
  // 添加银行卡验证码
  bankAddSMS: `${API}/sms/bank_account`,
  // 创建收款
  createCollections: `${API}/collections`,
  // 查询收款/api/collections/{collection_id}
  getCollections: `${API}/collections/:collection_id`,
  // 付款
  scanTransfers: `${API}/scanTransfers`,
  // 转账到妙汇宝账户
  transfers: `${API}/transfers`,

  // password 相关
  // sms 重置密码验证码
  passwordResetSMS:`${API}/sms/reset_pay_password`,
  // /api/account/pay_password/reset
  passwordReset:`${API}/account/pay_password/reset`,
  // 更新当前密码 /api/account/pay_password
  password:`${API}/account/pay_password`,

  //transactions 交易记录相关
  transactions: `${API}/transactions`,
  ///api/transactions_deposit_normal/{transactionId} 交易记录详情
  transactionDetail: `${API}/:transactionType/:transactionId`,

  // 换汇相关
  // 当前汇率查询/api/exchange_rates/current
  exchangeRateCurrent: `${API}/exchange_rates/current`,
  // 汇率查询-图表相关/api/exchange_rates
  exchangeRates: `${API}/exchange_rates`,
  // 可以换汇的币种/api/available_currencies
  availableCurrencies: `${API}/available_currencies`,
  // 当前是否可交易/api/business_datetime
  businessDatetime: `${API}/business_datetime`,
  // 结汇/api/exchanges
  exchange: `${API}/exchanges`,


  // 提现相关
  // 限额/api/limit
  limitAmount: `${API}/limit`,
  // 提现预览/api/withdrawals/preview
  withdrawPre: `${API}/withdrawals/preview`,
  // 提现/api/withdrawals
  withdraw: `${API}/withdrawals`,

  // 身份认证相关
  // 个人正面OCR
  fontOCR: `${API}/imageocrs/person_front`,
  // 个人反面OCR
  backOCR: `${API}/imageocrs/person_back`,
  // 企业营业执照OCR
  companyOCR: `${API}/imageocrs/company`,
  // 上传实名认证
  legalentity: `${API}/legalentity`,

  // 处理信息 todo
  todoNum: `${API}/todos_num`,
  // 信息列表 /api/todos
  todos: `${API}/todos`,
  // 读取用户所有消息/api/todos_read/all
  todoRead: `${API}/todos_read/all`,
  // 公告通知
  acornPublicNotifications: `${API}/acornPublicNotifications`,
}