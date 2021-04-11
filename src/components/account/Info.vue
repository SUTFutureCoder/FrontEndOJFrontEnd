<template>
  <v-container>
    <h1 id="info_user_name">{{this.user.name}}</h1>
    <h3 class="ma-5" id="info_user_type">{{this.user.user_type_str}} | {{this.user.id}}</h3>
    <h3 class="ma-5" id="info_user_summary"><a style="color: green">{{this.user_summary.count_ac}}</a><a>/</a><a style="color: lightcoral">{{this.user_summary.count_fail}}</a><a>/</a><a style="color: cornflowerblue">{{ this.user_summary.count_sum === 0 ? '0%' : (this.user_summary.count_ac / this.user_summary.count_sum * 100).toFixed(2) + '%'}}</a></h3>
    <v-row class="ma-5"><div class="mx-auto"><v-btn class="info mx-2" @click="showUpdatePwdDialog">修改密码</v-btn><v-btn class="mx-2" @click="logout">退出</v-btn></div></v-row>
    <calendar-heatmap @day-click="clickHeatMap" :values="calendar_heatmap_data" :endDate="end_date"/>
    <v-data-table
        v-if="this.submitStatus.length > 0"
        :headers="heatmapTableHeaders"
        :items="submitStatus"
        hide-default-footer
        class="elevation-1 ma-2"
    >
      <template v-slot:item.lab_id="{ item }">
        <a @click="labinfo(item.lab_id)">{{item.lab_id}}</a>
      </template>
      <template v-slot:item.lab_name="{ item }">
        <a @click="labinfo(item.lab_id)">{{item.lab_name}}</a>
      </template>
      <template v-slot:item.status="{ item }">
        <v-btn :color="getStatusColor(item.status)" class="status_word_color" @click="showSubmitResult(item)">{{convertStatusId(item.status)}}</v-btn>
      </template>
      <template v-slot:item.create_time="{ item }">
        {{convertTime(item.create_time)}}
      </template>
      <template v-slot:item.update_time="{ item }">
        {{convertTime(item.update_time)}}
      </template>
    </v-data-table>
    <SubmitResult :submit_result="submit_result"/>





    <template>
      <v-row justify="center">
        <v-dialog
            v-model="updatePwdDialog"
            max-width="600px"
        >
          <v-card>
            <v-card-title>
              <span class="headline">修改密码</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                        label="Old Password"
                        type="password"
                        required
                        v-model="updatePwdData.old_password"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                        label="New Password"
                        type="password"
                        required
                        v-model="updatePwdData.new_password"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                        label="Confirm New Password"
                        type="password"
                        required
                        v-model="updatePwdData.new_password_confirm"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="primary"
                  block
                  @click="confirmUpdatePwd"
              >
                提交
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>



  </v-container>
</template>

<script>
import { CalendarHeatmap } from 'vue-calendar-heatmap'
import {apiUser} from "@/api"
import {lab_submit_utils, time_utils} from "@/utils";
import SubmitResult from "@/components/submit/SubmitResult";
import * as RouterPath from "@/constants/router_path";
import * as user from "@/constants/user";
import {store, storeConst} from "@/store";
import * as colors from "@/constants/color";

export default {
  name: "Info",
  data: () => ({
    user: {
      id: "",
      name: "",
      user_type: "",
      user_type_str: "",
    },

    user_summary: {
      count_ac: 0,
      count_fail: 0,
      count_juding: 0,
      count_sum: 0,
    },
    user_summary_str: "",

    calendar_heatmap_data: [],
    calendar_heatmap_day_submit: [],

    heatmapTableHeaders: [
      {
        text: '提交id',
        align: 'start',
        sortable: false,
        value: 'id',
      },
      {
        text: '状态',
        sortable: false,
        value: 'status',
      },
      {
        text: '实验室id',
        sortable: false,
        value: 'lab_id',
      },
      {
        text: '实验室名称',
        sortable: false,
        value: 'lab_name',
      },
      {
        text: '提交时间',
        sortable: false,
        value: 'create_time',
      },
      {
        text: '判题时间',
        sortable: false,
        value: 'update_time',
      }
    ],
    submitStatus: [],
    submit_result: {
      id: 0,
      statusColor: "",
      statusName: "",
      resultList: [],
    },

    end_date: time_utils.convertMicroToDate(new Date().getTime()),

    updatePwdDialog: false,
    updatePwdData: {
      old_password: "",
      new_password: "",
      new_password_confirm: "",
    }
  }),
  components: {
    CalendarHeatmap,
    SubmitResult,
  },
  mounted() {
    this.getYearSummary()
    this.whoami()
    this.summary()
  },
  methods: {
    getYearSummary() {
      apiUser.yearSummary({}).then(response => {
        this.calendar_heatmap_data = response.data.data.summary_list
      }).catch()
    },
    clickHeatMap(data) {
      this.submitStatus = []
      apiUser.getUserDaySubmits({time: new Date(data.date).getTime()}).then(response => {
        let labNameHash = response.data.data.lab_name_hash
        let submits = response.data.data.submits
        for (let i in submits) {
          submits[i].lab_name = ''
          if (submits[i] !== undefined && submits[i].lab_id !== undefined) {
            submits[i].lab_name = labNameHash[submits[i].lab_id]
          }
          this.submitStatus.push(submits[i])
        }
      }).catch()
    },
    getStatusColor(status) {
      return lab_submit_utils.getStatusColor(status)
    },
    convertStatusId(status) {
      return lab_submit_utils.convertStatusId(status)
    },
    convertTime(time) {
      if (time === 0) {
        return ""
      }
      return time_utils.convertMicroToDate(time)
    },
    showSubmitResult(item) {
      this.submit_result = {
        id: item.id,
        statusColor: this.getStatusColor(item.status),
        statusName: this.convertStatusId(item.status),
        resultList: lab_submit_utils.parseSubmitResult(item.submit_result),
      }
    },
    labinfo(labId) {
      this.$router.push({path: RouterPath.LAB_INFO, query: {labId: labId}})
    },
    whoami() {
      apiUser.whoami().then(response => {
        this.user = response.data.data
        this.user.user_type_str = user.USERTYPE_INT_MAP.get(this.user.user_type)
      }).catch()
    },
    summary() {
      apiUser.summary().then(response => {
        this.user_summary = response.data.data.user_submit_summary
        this.user_summary_str = this.user_summary.count_ac + "/" +  this.user_summary.count_fail + "/" + this.user_summary.count_juding + "/" + this.user_summary.count_sum
      }).catch()
    },
    logout() {
      apiUser.logout().then(() => {
        // reset
        store.dispatch(storeConst.DISPATCH_SET_USER_INFO, {
          id: 0,
          name: "",
          user_type: "",
        })
        store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
          text: "退出成功，请重新登录",
          color: colors.GREEN,
        })
        this.$router.push({path: RouterPath.LOGIN})
      }).catch()
    },
    showUpdatePwdDialog() {
      this.updatePwdDialog = true
    },
    confirmUpdatePwd() {
      if (this.updatePwdData.new_password === '') {
        store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
          text: "新密码不能为空",
          color: colors.RED,
        })
        return
      }
      if (this.updatePwdData.new_password !== this.updatePwdData.new_password_confirm) {
        store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
          text: "两次密码不一致",
          color: colors.RED,
        })
        return
      }
      apiUser.changePwd(this.updatePwdData).then(() => {
        store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
          text: "密码修改成功",
          color: colors.GREEN,
        })
        this.updatePwdDialog = false
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
#info_user_name {
  text-align:center;
  font-size: 100px
}
#info_user_summary, #info_user_type {
  text-align:center;
  font-size: 20px
}
.status_word_color {
  color: white;
}
</style>