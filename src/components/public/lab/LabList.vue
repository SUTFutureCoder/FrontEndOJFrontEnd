<template>
  <v-container>
    <v-card-title v-if="showTitle">
      实验室列表
    </v-card-title>
    <v-row>
      <v-col>
        <v-text-field
            v-model="searchLabId"
            v-if="!contestMode"
            append-icon="mdi-magnify"
            label="Search ID"
            single-line
            hide-details
            @keydown.enter="searchByLabId"
            @click:append="searchByLabId"
        ></v-text-field>
      </v-col>
      <v-col cols="4" v-if="adminMode">
        <v-btn block x-large class="primary" @click="putLab">创建实验室</v-btn>
      </v-col>
    </v-row>

    <v-data-table
        :headers="showTableHeaders()"
        :items="labList"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        hide-default-footer
        class="lab_list_table"
        @click:row="clickTableRow"
    >
      <template v-slot:item.actions="{ item }">
        <v-container v-if="contestChooseMode" >
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  medium
                  class="mr-2"
                  @click.stop="addContestLab(item)"
                  v-bind="attrs"
                  v-on="on"
              >
                mdi-playlist-plus
              </v-icon>
            </template>
            <span>添加到列表末尾</span>
          </v-tooltip>
        </v-container>

        <v-container v-if="adminMode" >
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  medium
                  class="mr-2"
                  @click.stop="editLab(item)"
                  v-bind="attrs"
                  v-on="on"
              >
                mdi-pencil
              </v-icon>
            </template>
            <span>编辑</span>
          </v-tooltip>


          <v-tooltip top v-if="item.lab_info.status === 1">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  medium
                  class="mr-2"
                  @click.stop="disableLab(item)"
                  v-bind="attrs"
                  v-on="on"
              >
                mdi-test-tube-off
              </v-icon>
            </template>
            <span>禁用</span>
          </v-tooltip>


          <v-tooltip top v-if="item.lab_info.status !== 1">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  medium
                  class="mr-2"
                  @click.stop="enableLab(item)"
                  v-bind="attrs"
                  v-on="on"
              >
                mdi-test-tube
              </v-icon>
            </template>
            <span v-if="item.lab_info.status === -2 || item.lab_info.status === -3">恢复</span>
            <span v-if="item.lab_info.status === 0">可用</span>
          </v-tooltip>
        </v-container>
      </template>


    </v-data-table>
    <div
        class="text-center pt-2"
        v-if="!contestMode"
    >
      <v-pagination v-model="page" :length="pageCount" :total-visible="7" @input="clickPagination"></v-pagination>
    </div>
  </v-container>
</template>

<script>
import {apiLab} from "@/api";
import * as RouterPath from "@/constants/router_path";
import * as StatusMap from "@/constants/status";
import {store, storeConst} from "@/store";
import * as colors from "@/constants/color";

export default {
  name: "LabList",
  data: () => ({
    labList: [],
    headersAdmin: [
      {
        text: 'id',
        align: 'start',
        sortable: false,
        value: 'lab_info.id',
      },
      {
        text: '实验室名称',
        sortable: false,
        value: 'lab_info.lab_name',
      },
      {
        text: 'AC/ER/PEND/SUM',
        sortable: false,
        value: 'summary_str',
      },
      {
        text: '测试用例数',
        sortable: false,
        value: 'testcase_count',
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
    normalHeaders: [
      {
        text: 'id',
        align: 'start',
        sortable: false,
        value: 'lab_info.id',
      },
      {
        text: '实验室名称',
        sortable: false,
        value: 'lab_info.lab_name',
      },
      {
        text: 'AC/ER/PEND/SUM',
        sortable: false,
        value: 'summary_str',
      }
    ],
    contestHeaders: [
      {
        text: 'id',
        align: 'start',
        sortable: false,
        value: 'lab_info.contest_show_id',
      },
      {
        text: '实验室名称',
        sortable: false,
        value: 'lab_info.lab_name',
      },
      {
        text: 'AC/ER/PEND/SUM',
        sortable: false,
        value: 'summary_str',
      },
    ],
    page: 1,
    itemsPerPage: 9,
    pageCount: 1,
    searchLabId: "",

    adminMode: false,
  }),
  watch: {
    '$route' (to, from) {
      // react to route changes...
      if (to !== from) {
        console.log(from)
        this.adminMode = this.$route.query.adminMode ? this.$route.query.adminMode : false
      }
    },
    contestLabIds (newVal) {
      if (newVal == null || newVal.length === 0) {
        return
      }
      this.getLabListByIds(newVal)
    }
  },
  mounted() {
    this.page = !isNaN(parseInt(this.$route.query.page)) ? parseInt(this.$route.query.page) : 1
    this.adminMode = this.$route.query.adminMode ? this.$route.query.adminMode : false
    if (!this.contestMode) {
      this.getLabListByPage(this.page, this.itemsPerPage)
    }
    if (this.contestMode) {
      this.getLabListByIds(this.contestLabIds)
    }
  },
  methods: {
    putLab() {
      this.$router.push({path: RouterPath.ADMIN_LAB_PUT})
    },
    editLab(item) {
      this.$router.push({path: RouterPath.ADMIN_LAB_PUT, query: {labId: item.lab_info.id}})
    },
    disableLab(item) {
      apiLab.disableLab({lab_id: item.lab_info.id}).then(() => {
        item.lab_info.status = StatusMap.STATUS_DISABLE
        store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
          text: "下线成功",
          color: colors.GREEN,
        })
      }).catch()
    },
    enableLab(item) {
      apiLab.enableLab({lab_id: item.lab_info.id}).then(() => {
        item.lab_info.status = StatusMap.STATUS_ENABLE
        store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
          text: "上线成功",
          color: colors.GREEN,
        })
      }).catch()
    },
    clickTableRow: function (value) {
      if (!this.jumpToLab) {
        return
      }
      if (this.contestMode && this.contestId !== 0) {
        this.$router.push({path: RouterPath.CONTEST_LAB_INFO, query: {labId: value.lab_info.id, contestId: this.contestId}})
        return
      }
      this.$router.push({path: RouterPath.LAB_INFO, query: {labId: value.lab_info.id}})
    },
    clickPagination(page) {
      this.page = page
      this.getLabListByPage(this.page, this.itemsPerPage)
    },
    searchByLabId() {
      this.getLabListByPage(this.page, this.itemsPerPage)
    },
    getLabListByPage(page, itemsPerPage) {
      let reqData = {
        page: page,
        page_size: itemsPerPage,
      }
      if (this.searchLabId !== ""){
        reqData.lab_id = parseInt(this.searchLabId, 10)
      }
      apiLab.getLabSummaryList(reqData).then(response => {
        if (response.data.data.lab_list == null) {
          return
        }
        this.labList = response.data.data.lab_list
        for (let i in this.labList) {
          let summary = this.labList[i].summary
          this.labList[i].summary_str = summary.count_ac + "/" + summary.count_fail + "/" + summary.count_juding + "/" + summary.count_sum
          this.labList[i].status_str = StatusMap.STATUSMAP.get(this.labList[i].lab_info.status)
        }
        this.pageCount = Math.ceil(response.data.data.count / itemsPerPage)
      }).catch(err => {
        console.log(err)
      })
    },
    getLabListByIds(contestLabIds) {
      let reqData = {
        lab_ids: contestLabIds,
        contest_id: parseInt(this.contestId, 10),
      }
      apiLab.getLabByIdsWithUserSummary(reqData).then(response => {
        if (response.data.data.lab_list == null) {
          return
        }
        let labList = response.data.data.lab_list

        // sort
        let idMaps = []
        for (let i in contestLabIds) {
          idMaps[contestLabIds[i]] = i
        }

        let sortedLabList = []
        for (let i in labList) {
          let idx = parseInt(idMaps[labList[i].lab_info.id], 10)
          labList[i].lab_info.contest_show_id = String.fromCharCode(65 + idx)
          sortedLabList[idx] = labList[i]
        }

        this.labList = sortedLabList
        for (let i in this.labList) {
          let summary = this.labList[i].summary
          this.labList[i].summary_str = summary.count_ac + "/" + summary.count_fail + "/" + summary.count_juding + "/" + summary.count_sum
        }
      }).catch(err => {
        console.log(err)
      })
    },
    addContestLab(item) {
      this.$emit("addContestLab",item);
    },
    showTableHeaders() {
      if (this.adminMode || this.contestChooseMode) {
        return this.headersAdmin
      }
      if (this.contestMode) {
        return this.contestHeaders
      }
      return this.normalHeaders
    }
  },
  props:{
    // 编辑竞赛模式
    contestChooseMode: {
      type: Boolean,
      default: false,
    },
    // 显示标题
    showTitle: {
      type: Boolean,
      default: true,
    },
    // 竞赛模式
    contestMode: {
      type: Boolean,
      default: false,
    },
    // 竞赛id
    contestId: {
      type: Number,
      default: 0,
    },
    // 竞赛用实验室id列表，指定查询，具备顺序
    contestLabIds: {
      type: Array,
      default: function () {
        return []
      },
    },
    // 是否跳转到实验室
    jumpToLab: {
      type: Boolean,
      default: true,
    },
  },
}
</script>

<style lang="css" scoped>
.lab_list_table >>> tbody tr :hover {
  cursor: pointer;
}
</style>