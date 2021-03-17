import {store, storeConst} from "@/store";

export function handleSubmitListByLabIds(data) {
  store.dispatch(storeConst.DISPATCH_WS_MSG, data)
}