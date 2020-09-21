import Vue from 'vue'

//消息总线也继承了全局的Vue
export default Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()

export const SHOW_SUBMIT_RESULT_EVENT = "SHOW_SUBMIT_RESULT_EVENT"
