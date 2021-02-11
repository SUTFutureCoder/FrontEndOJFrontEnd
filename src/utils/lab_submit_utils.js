import * as color from "@/constants/color";

export function convertStatusId(status) {
  switch (status) {
    case 1:
      return "PENDING"
    case 2:
      return "ERROR"
    case 3:
      return "COMPILING"
    case 4:
      return "JUDING"
    case 5:
      return "ACCEPTED"
    case 6:
      return "PRESENTATION_ERROR"
    case 7:
      return "WRONG_ANSWER"
    case 8:
      return "TIME_LIMIT_EXCEEDED"
    case 9:
      return "MEMORY_LIMIT_EXCEEDED"
    case 10:
      return "OUPUT_LIMIT_EXCEED"
    case 11:
      return "RUNTIME_ERROR"
    case 12:
      return "COMPILE_ERROR"
    case 13:
      return "COMPILE_OK"
    case 14:
      return "TEST"
    case 15:
      return "OTHER_ERROR"
    case 16:
      return "SYSTEM_ERROR"
    case 17:
      return "NO_TESTCASE"
  }
}

export function getStatusColor(status) {
  if (status === 1 || status === 4) {
    return "primary"
  }
  if (status === 5) {
    return "success"
  }
  if (status === 6) {
    return "warning"
  }
  return color.RED
}

export function parseSubmitResult(strResult) {
  let resultList = []
  if (!strResult) {
    return resultList
  }
  for (let resultItem of JSON.parse(strResult)) {
    resultItem.statusName = convertStatusId(resultItem.Status)
    resultItem.statusColor = getStatusColor(resultItem.Status)
    resultList.push(resultItem)
  }
  return resultList
}