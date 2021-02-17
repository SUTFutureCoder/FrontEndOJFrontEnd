<template>
  <v-container>
    <v-card-title>
      用户列表
    </v-card-title>
    <v-row>
      <v-col>
        <v-text-field
            v-model="searchUserIdOrName"
            append-icon="mdi-magnify"
            label="Search ID or Name"
            single-line
            hide-details
            @keydown.enter="searchByUserId"
            @click:append="searchByUserId"
        ></v-text-field>
      </v-col>
      <v-col cols="4">
        <v-btn block x-large class="primary" @click="putUser">创建用户</v-btn>
      </v-col>
    </v-row>
    <v-data-table
        :headers="headersAdmin"
        :items="userList"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        hide-default-footer
        class="user_list_table"
    >
      <template v-slot:item.actions="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
                medium
                class="mr-2"
                @click.stop="editUser(item)"
                v-bind="attrs"
                v-on="on"
            >
              mdi-account-edit
            </v-icon>
          </template>
          <span>编辑</span>
        </v-tooltip>


        <v-tooltip top v-if="item.user_info.status === 1">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
                medium
                class="mr-2"
                @click.stop="disableUser(item)"
                v-bind="attrs"
                v-on="on"
            >
              mdi-account-cancel
            </v-icon>
          </template>
          <span>禁用</span>
        </v-tooltip>


        <v-tooltip top v-if="item.user_info.status === 0">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
                medium
                class="mr-2"
                @click.stop="enableUser(item)"
                v-bind="attrs"
                v-on="on"
            >
              mdi-account-check
            </v-icon>
          </template>
          <span>可用</span>
        </v-tooltip>

      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount" :total-visible="7" @input="clickPagination"></v-pagination>
    </div>


    <template>
      <v-row justify="center">
        <v-dialog
            v-model="createDialog"
            max-width="600px"
        >
          <v-card>
            <v-card-title>
              <span class="headline">User Profile</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                        label="User Name"
                        required
                        v-model="createUserReq.user_name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                        label="Password"
                        type="password"
                        required
                        v-model="createUserReq.user_password"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                        :items="usertypeItem"
                        label="User Type"
                        required
                        v-model="createUserReq.user_type"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="primary"
                  block
                  @click="confirmPutUser"
              >
                提交
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>


    <template>
      <v-row justify="center">
        <v-dialog
            v-model="modifyDialog"
            max-width="600px"
        >
          <v-card>
            <v-card-title>
              <span class="headline">Edit User #{{modifyUserReq.user_id}}</span>
              <small>* 如不修改，留空即可</small>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                        label="User Name"
                        required
                        v-model="modifyUserReq.user_name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                        label="Password"
                        type="password"
                        required
                        v-model="modifyUserReq.user_password"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                        :items="usertypeItem"
                        label="User Type"
                        required
                        v-model="modifyUserReq.user_type"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="primary"
                  block
                  @click="confirmEditUser"
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
import {apiUser} from "@/api";
import * as RouterPath from "@/constants/router_path";
import * as StatusMap from "@/constants/status";
import {store, storeConst} from "@/store";
import * as colors from "@/constants/color";
import * as user from "@/constants/user";

export default {
  name: "UserList",
  data: () => ({
    userList: [],
    headersAdmin: [
      {
        text: 'id',
        align: 'start',
        sortable: false,
        value: 'user_info.id',
      },
      {
        text: '用户名',
        sortable: false,
        value: 'user_info.creator',
      },
      {
        text: 'AC/ER/PEND/SUM',
        sortable: false,
        value: 'summary_str',
      },
      {
        text: '用户类别',
        sortable: false,
        value: 'type_str',
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
    page: 1,
    itemsPerPage: 9,
    pageCount: 1,
    searchUserIdOrName: "",

    createDialog: false,
    modifyDialog: false,
    createUserReq: {
      user_name: "",
      user_password: "",
      user_type: "",
    },
    modifyUserReq: {
      user_id: "",
      user_name: "",
      user_password: "",
      user_type: "",
    },
    usertypeItem: [...user.USERTYPE_STR_MAP.keys()],
    usertypeItemMap: user.USERTYPE_INT_MAP
  }),
  mounted() {
    this.page = !isNaN(parseInt(this.$route.query.page)) ? parseInt(this.$route.query.page) : 1
    this.getUserListByPage(this.page, this.itemsPerPage)
  },
  methods: {
    putUser() {
      this.createUserReq = {
        user_name: "",
        user_password: "",
        user_type: "",
      }
      this.createDialog = true
    },
    confirmPutUser() {
      this.createUserReq.user_type = user.USERTYPE_STR_MAP.get(this.createUserReq.user_type)
      apiUser.createUser(this.createUserReq).then(() => {
            this.createUserReq = {
              user_name: "",
              user_password: "",
              user_type: "",
            }
            this.getUserListByPage(this.page, this.itemsPerPage)
            this.createDialog = false
        }
      ).catch()
    },
    editUser(item) {
      this.modifyUserReq = {
        user_id: item.user_info.id,
        user_name: item.user_info.creator,
        user_password: "",
        user_type: this.usertypeItemMap.get(item.user_info.user_type),
      }
      this.modifyDialog = true
    },
    confirmEditUser() {
      this.modifyUserReq.user_type = user.USERTYPE_STR_MAP.get(this.modifyUserReq.user_type)
      apiUser.editUser(this.modifyUserReq).then(() => {
        this.modifyUserReq = {
          user_id: "",
          user_name: "",
          user_password: "",
          user_type: "",
        }
        this.getUserListByPage(this.page, this.itemsPerPage)
        this.modifyDialog = false
        store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
          text: "修改成功",
          color: colors.GREEN,
        })
      }).catch()
    },
    disableUser(item) {
      apiUser.disableUser({user_id: item.user_info.id}).then(() => {
        item.user_info.status = StatusMap.STATUS_DISABLE
        item.status_str = StatusMap.STATUSMAP.get(StatusMap.STATUS_DISABLE)
        store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
          text: "禁用成功",
          color: colors.GREEN,
        })
      }).catch()
    },
    enableUser(item) {
      apiUser.enableUser({user_id: item.user_info.id}).then(() => {
        item.user_info.status = StatusMap.STATUS_ENABLE
        item.status_str = StatusMap.STATUSMAP.get(StatusMap.STATUS_ENABLE)
        store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
          text: "启用成功",
          color: colors.GREEN,
        })
      }).catch()
    },
    clickTableRow: function (value) {
      this.$router.push({path: RouterPath.LAB_INFO, query: {labId: value.lab_info.id}})
    },
    clickPagination(page) {
      this.page = page
      this.getUserListByPage(this.page, this.itemsPerPage)
    },
    searchByUserId() {
      this.getUserListByPage(this.page, this.itemsPerPage)
    },
    getUserListByPage(page, itemsPerPage) {
      let reqData = {
        page: page,
        page_size: itemsPerPage,
        user_search: {},
      }
      if (this.searchUserIdOrName !== ""){
        reqData.user_search.user_id_or_name = this.searchUserIdOrName
      }
      apiUser.getUserSummaryList(reqData).then(response => {
        if (response.data.data.user_list == null) {
          this.userList = []
          return
        }
        this.userList = response.data.data.user_list
        for (let i in this.userList) {
          let summary = this.userList[i].summary
          this.userList[i].summary_str = summary.count_ac + "/" + summary.count_fail + "/" + summary.count_juding + "/" + summary.count_sum
          this.userList[i].status_str = StatusMap.STATUSMAP.get(this.userList[i].user_info.status)
          this.userList[i].type_str = user.USERTYPE_INT_MAP.get(this.userList[i].user_info.user_type)
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
.user_list_table >>> tbody tr :hover {
  cursor: pointer;
}
</style>