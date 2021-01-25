/**
 * api接口的统一出口
 */
import {user} from './user/user'
import {submit} from './lab/submit'
import {lab} from './lab/lab'

export const apiUser = user
export const apiSubmit = submit
export const apiLab = lab