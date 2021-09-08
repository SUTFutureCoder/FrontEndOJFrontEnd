import {store, storeConst} from "@/store";
import {lab_submit_utils} from "@/utils";
import * as WsConst from "@/constants/ws";

export function handleJudgerResultCallBack(data) {
  // 显示条
  data = data.Data
  store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
    text: "lab:" + data.lab_id + " #" + data.id + " - " + lab_submit_utils.convertStatusId(data.status),
    color: lab_submit_utils.getStatusColor(data.status),
  })
  // trigger update info result status list
  store.dispatch(storeConst.DISPATCH_WS_SEND, {cmd: WsConst.WS_CMD_SUBMIT_LIST_BY_LAB_ID, data: JSON.stringify({lab_id: data.lab_id,})})
}