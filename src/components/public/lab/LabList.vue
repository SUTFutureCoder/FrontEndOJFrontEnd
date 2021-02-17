<template>
  <v-container>
    <v-card-title>
      实验室列表
    </v-card-title>
    <v-row>
      <v-col>
        <v-text-field
            v-model="searchLabId"
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
        :headers="adminMode ? headersAdmin : headers"
        :items="labList"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        hide-default-footer
        class="lab_list_table"
        @click:row="clickTableRow"
    >
      <template v-if="adminMode" v-slot:item.actions="{ item }">
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


        <v-tooltip top v-if="item.lab_info.status === 0">
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
          <span>可用</span>
        </v-tooltip>
      </template>


    </v-data-table>
    <div class="text-center pt-2">
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
    headers: [
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
    page: 1,
    itemsPerPage: 9,
    pageCount: 1,
    searchLabId: "",

    adminMode: false,
  }),
  mounted() {
    this.page = !isNaN(parseInt(this.$route.query.page)) ? parseInt(this.$route.query.page) : 1
    this.adminMode = this.$route.query.adminMode ? this.$route.query.adminMode : false
    this.getLabListByPage(this.page, this.itemsPerPage)
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
    }
  }
}
</script>

<style lang="css" scoped>
.lab_list_table >>> tbody tr :hover {
  cursor: pointer;
}
</style>