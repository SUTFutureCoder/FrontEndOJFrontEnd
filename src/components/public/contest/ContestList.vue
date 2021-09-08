<template>
  <v-container>
    <v-card-title v-if="showTitle">
      竞赛列表
    </v-card-title>
    <v-row>
      <v-col>
        <v-text-field
            v-model="searchContestId"
            append-icon="mdi-magnify"
            label="Search ID"
            single-line
            hide-details
            @keydown.enter="searchByContestId"
            @click:append="searchByContestId"
        ></v-text-field>
      </v-col>
      <v-col cols="4" v-if="adminMode">
        <v-btn block x-large class="primary" @click="putContest">创建比赛</v-btn>
      </v-col>
    </v-row>

    <v-data-table
        :headers="adminMode || contestChooseMode ? headersAdmin : headers"
        :items="contestList"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        hide-default-footer
        class="lab_list_table"
        @click:row="clickTableRow"
    >
      <template v-slot:item.actions="{ item }">
        <v-container v-if="isInSigninTime(item)">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  medium
                  class="mr-2"
                  @click.stop="signinContest(item)"
                  v-bind="attrs"
                  v-on="on"
              >
                mdi-login
              </v-icon>
            </template>
            <span>报名</span>
          </v-tooltip>
        </v-container>
        <v-container v-if="adminMode" >
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  medium
                  class="mr-2"
                  @click.stop="editContest(item)"
                  v-bind="attrs"
                  v-on="on"
              >
                mdi-pencil
              </v-icon>
            </template>
            <span>编辑</span>
          </v-tooltip>


          <v-tooltip top v-if="item.contest_info.status === 1">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  medium
                  class="mr-2"
                  @click.stop="modifyContestStatus(item, StatusMap.STATUS_DISABLE)"
                  v-bind="attrs"
                  v-on="on"
              >
                mdi-test-tube-off
              </v-icon>
            </template>
            <span>禁用</span>
          </v-tooltip>


          <v-tooltip top v-if="item.contest_info.status !== 1">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  medium
                  class="mr-2"
                  @click.stop="modifyContestStatus(item, StatusMap.STATUS_ENABLE)"
                  v-bind="attrs"
                  v-on="on"
              >
                mdi-test-tube
              </v-icon>
            </template>
            <span v-if="item.contest_info.status === StatusMap.STATUS_DISABLE">可用</span>
          </v-tooltip>
        </v-container>
      </template>

    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount" :total-visible="7" @input="clickPagination"></v-pagination>
    </div>
  </v-container>
</template>

<script>
import * as RouterPath from "@/constants/router_path";
import {apiContest} from "@/api";
import {store, storeConst} from "@/store";
import * as colors from "@/constants/color";
import * as StatusMap from "@/constants/status";
import {time_utils} from "@/utils";

export default {
  name: "ContestList",
  data: () => ({
    contestList: [],
    headersAdmin: [
      {
        text: 'id',
        align: 'start',
        sortable: false,
        value: 'contest_info.id',
      },
      {
        text: '比赛名称',
        sortable: false,
        value: 'contest_info.contest_name',
      },
      {
        text: 'AC/ER/PEND/SUM',
        sortable: false,
        value: 'summary_str',
      },
      {
        text: '比赛时间',
        sortable: false,
        value: 'contest_time_range',
      },
      {
        text: '报名比赛时间',
        sortable: false,
        value: 'contest_signin_time_range',
      },
      {
        text: '实验室数',
        sortable: false,
        value: 'contest_lab_count',
      },
      {
        text: '报名人数',
        sortable: false,
        value: 'contest_user_count',
      },
      {
        text: '状态',
        sortable: false,
        value: 'status_str',
      },
      {
        text: '操作',
        sortable: false,
        value: 'actions',
      }
    ],
    headers: [
      {
        text: 'id',
        align: 'start',
        sortable: false,
        value: 'contest_info.id',
      },
      {
        text: '比赛名称',
        sortable: false,
        value: 'contest_info.contest_name',
      },
      {
        text: '比赛时间',
        sortable: false,
        value: 'contest_time_range',
      },
      {
        text: '报名比赛时间',
        sortable: false,
        value: 'contest_signin_time_range',
      },
      {
        text: '操作',
        sortable: false,
        value: 'actions',
      },
      {
        text: '实验室数',
        sortable: false,
        value: 'contest_lab_count',
      },
      {
        text: '报名人数',
        sortable: false,
        value: 'contest_user_count',
      },
    ],
    page: 1,
    itemsPerPage: 9,
    pageCount: 1,
    searchContestId: "",

    StatusMap: StatusMap,
    adminMode: false,
  }),
  watch: {
    '$route' (to, from) {
      // react to route changes...
      if (to !== from) {
        console.log(from)
        this.adminMode = this.$route.query.adminMode ? this.$route.query.adminMode : false
      }
    }
  },
  mounted() {
    this.page = !isNaN(parseInt(this.$route.query.page)) ? parseInt(this.$route.query.page) : 1
    this.adminMode = this.$route.query.adminMode ? this.$route.query.adminMode : false
    this.getContestListByPage(this.page, this.itemsPerPage)
  },
  methods: {
    putContest() {
      this.$router.push({path: RouterPath.ADMIN_CONTEST_PUT})
    },
    editContest(item) {
      this.$router.push({path: RouterPath.ADMIN_CONTEST_PUT, query: {contestId: item.contest_info.id}})
    },
    modifyContestStatus(item, toStatus) {
      apiContest.modifyStatus({contest_id: item.contest_info.id, status: toStatus}).then(() => {
        item.contest_info.status = toStatus
        store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
          text: "操作成功",
          color: colors.GREEN,
        })
      }).catch()
    },
    clickTableRow: function (value) {
      if (!this.jumpToContest) {
        return
      }
      // 检查是否已经报名
      let reqData = {
        contest_id: value.contest_info.id,
      }
      apiContest.tryAccess(reqData).then(response => {
        if (response.data.data !== true) {
          console.log(response)
          store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
            text: "请先报名比赛",
            color: colors.RED,
          })
          return
        }
        // 进行跳转
        this.$router.push({path: RouterPath.CONTEST_INFO, query: {contestId: value.contest_info.id}})
      }).catch(err => {
        console.log(err)
      })
    },
    clickPagination(page) {
      this.page = page
      this.getContestListByPage(this.page, this.itemsPerPage)
    },
    searchByContestId() {
      this.getContestListByPage(this.page, this.itemsPerPage)
    },
    getContestListByPage(page, itemsPerPage) {
      let reqData = {
        page: page,
        page_size: itemsPerPage,
      }
      if (this.searchContestId !== ""){
        reqData.contest_id = parseInt(this.searchContestId, 10)
      }
      apiContest.contestWithSummary(reqData).then(response => {
        if (response.data.data.contest_list == null) {
          return
        }
        this.contestList = response.data.data.contest_list
        for (let i in this.contestList) {
          let summary = this.contestList[i].contest_submit_summary
          this.contestList[i].summary_str = summary.count_ac + "/" + summary.count_fail + "/" + summary.count_juding + "/" + summary.count_sum
          this.contestList[i].status_str = StatusMap.STATUSMAP.get(this.contestList[i].contest_info.status)
          this.contestList[i].contest_time_range = time_utils.convertMicroToDate(this.contestList[i].contest_info.contest_start_time) + "~" + time_utils.convertMicroToDate(this.contestList[i].contest_info.contest_end_time)
          this.contestList[i].contest_signin_time_range = time_utils.convertMicroToDate(this.contestList[i].contest_info.signup_start_time) + "~" + time_utils.convertMicroToDate(this.contestList[i].contest_info.signup_end_time)
        }
        this.pageCount = Math.ceil(response.data.data.count / itemsPerPage)
      }).catch(err => {
        console.log(err)
      })
    },
    signinContest(item) {
      // 检查是否在报名时间之内

      console.log(item);
    },
    isInSigninTime(item) {
      let currentTime = new Date().getTime()
      if (item.contest_info.signup_start_time <= currentTime && currentTime <= item.contest_info.signup_end_time) {
        return true
      }
    },
   },
  props:{
    contestChooseMode: {
      type: Boolean,
      default: false,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    jumpToContest: {
      type: Boolean,
      default: true,
    },
  },
}
</script>

<style scoped>

</style>