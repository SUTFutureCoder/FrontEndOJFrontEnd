// module
export const MODULE_MESSAGE = 'message/'
export const MODULE_USER = 'user/'

// actions
export const ACTIONS_SNACKBAR_SHOW = 'showSnackBar'
export const ACTIONS_WS_CONN = 'connWebSocket'

export const ACTIONS_SET_USER_INFO = 'setUserInfo'

// dispatch
export const DISPATCH_SNACKBAR_SHOW = MODULE_MESSAGE + ACTIONS_SNACKBAR_SHOW

export const DISPATCH_WS_CONN = MODULE_MESSAGE + ACTIONS_WS_CONN

export const DISPATCH_SET_USER_INFO = MODULE_USER + ACTIONS_SET_USER_INFO

// mutation
export const SNACKBAR_SHOW = 'snackbar_show'
export const SNACKBAR_HIDE = 'snackbar_hide'
export const WEBSOCKET_CONN = 'websocket_conn'

export const USER_INFO_SET = 'set_user_info'

