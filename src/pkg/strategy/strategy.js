import * as StrategyConst from '@/constants/strategy'
import * as StrategySubmitResult from '@/pkg/strategy/strategy_submit_result'
import * as StrategySubmitListByLabId from '@/pkg/strategy/strategy_submit_list_by_lab_id'

let strategyMap = new Map([
  [StrategyConst.STRATEGY_RESULT_CALLBACK, StrategySubmitResult.handleJudgerResultCallBack],
  [StrategyConst.STRATEGY_SUBMIT_LIST_BY_LAB_ID, StrategySubmitListByLabId.handleSubmitListByLabIds],
])

export function execStrategy(type, data) {
  if (!strategyMap.has(type)) {
    return null
  }
  return strategyMap.get(type)(data)
}
