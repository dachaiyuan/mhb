import Taro from '@tarojs/taro';
import fly from '~/utils/fly';
import api from '~/utils/api';

export default {
  todoNum(){
    return fly.get(api.todoNum);
  },
  todos(params){
    return fly.get(api.todos, params)
  },
  todoRead(){
    return fly.put(api.todoRead)
  },
  acornPublicNotifications(){
    return fly.get(api.acornPublicNotifications);
  }
}