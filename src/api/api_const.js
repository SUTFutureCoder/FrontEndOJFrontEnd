// 后端接口列表

export const USER_LOGIN = "/user/login"

export const USER_REG = "/user/reg"

export const USER_LOGOUT = "/user/logout"

export const USER_WHOAMI = "/user/whoami"

export const USER_SUMMARY = "/user/summary"

export const INFO_YEAR_SUMMARY = "/user/year_submit_summary"

export const USER_DAY_SUBMITS = "/user/day_submits"

export const LAB_LIST = "/lab/list"

export const LAB_INFO = "/lab/info"

export const LAB_SUMMARY_LIST = "/lab/list_with_summary"

export const LAB_GET_BY_IDS = "/lab/get_by_ids"

export const LAB_GET_BY_IDS_WITH_USER_SUMMARY = "/lab/get_by_ids_with_user_summary"

export const LAB_SUBMIT = "/lab_submit/submit"

export const LAB_SUBMIT_WITH_FILE = "/lab_submit/submit_with_file"

export const LAB_SUBMIT_LIST_BY_LAB_ID = "/lab_submit/submit_list_by_lab_id"

export const TOOL_UPLOAD_FILE = "/tool/uploadfile"

export const TOOL_GET_FILE = "/tool/getfile"

export const JUDGER_TEST_RUN = "/judger/testrun"

export const CONTEST_LIST_WITH_SUMMARY = "/contest/list_with_summary"

export const CONTEST_INFO = "/contest/info"

export const CONTEST_SIGN = "/contest/sign"

export const CONTEST_GET_SIGN_STATUS = "/contest/get_contests_sign_status"

export const CONTEST_GET_USER_CONTEST_AC_LABIDS = "/contest/get_user_contest_ac_labids"

export const CONTEST_TRY_ACCESS = "/contest/try_access"

export const CONTEST_DASHBOARD = "/contest/dashboard"

export const CONTEST_USERS = "/contest/users"

// 管理员
export const LAB_ADD = "/admin/lab/add"

export const LAB_MODIFY = "/admin/lab/modify"

export const LAB_TESTCASE_SET = "/admin/lab_testcase/set"

export const LAB_TESTCASE_LIST = "/admin/lab_testcase/list"

export const LAB_TESTCASE_RUN = "/admin/lab_testcase/run"

export const LAB_ENABLE = "/admin/lab/enable"

export const LAB_DISABLE = "/admin/lab/disable"

export const LAB_CONSTRUCTING = "/admin/lab/constructing"

export const USER_CREATE = "/admin/user/create"

export const USER_DISABLE = "/admin/user/disable"

export const USER_ENABLE = "/admin/user/enable"

export const USER_CHANGE_PWD = "/user/change_pwd"

export const USER_LIST = "/admin/user/list"

export const USER_GRANT = "/admin/user/grant"

export const USER_MODIFY = "/admin/user/modify"

export const CONTEST_CREATE = "/admin/contest/create"

export const CONTEST_MODIFY = "/admin/contest/modify"

export const CONTEST_STATUS_MODIFY = "/admin/contest/status_modify"

export const CONTEST_MANAGE_LABS = "/admin/contest/manage_labs"

export const CONTEST_GET_LABS = "/admin/contest/get_labs"

export const CONTEST_ADD_USERS = "/admin/contest/add_users"

export const CONTEST_USERS_STATUS_MODIFY = "/admin/contest/users_status_modify"
