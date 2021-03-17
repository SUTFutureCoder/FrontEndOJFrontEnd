// module
export const MODULE_MESSAGE = 'message/'
export const MODULE_USER = 'user/'
export const MODULE_WS = 'ws/'

// actions
export const ACTIONS_SNACKBAR_SHOW = 'showSnackBar'
export const ACTIONS_WS_CONN = 'connWebSocket'
export const ACTIONS_WS_SEND = 'sendWebSocket'
export const ACTIONS_WS_MSG = 'getWebSocketMsg'

export const ACTIONS_SET_USER_INFO = 'setUserInfo'

// dispatch
export const DISPATCH_SNACKBAR_SHOW = MODULE_MESSAGE + ACTIONS_SNACKBAR_SHOW

export const DISPATCH_WS_CONN = MODULE_WS + ACTIONS_WS_CONN
export const DISPATCH_WS_SEND = MODULE_WS + ACTIONS_WS_SEND
export const DISPATCH_WS_MSG = MODULE_WS + ACTIONS_WS_MSG

export const DISPATCH_SET_USER_INFO = MODULE_USER + ACTIONS_SET_USER_INFO

// mutation
export const SNACKBAR_SHOW = 'snackbar_show'
export const SNACKBAR_HIDE = 'snackbar_hide'
export const WEBSOCKET_CONN = 'websocket_conn'
export const WEBSOCKET_SEND = 'websocket_send'
export const WEBSOCKET_MSG = 'websocket_msg'

export const USER_INFO_SET = 'set_user_info'

