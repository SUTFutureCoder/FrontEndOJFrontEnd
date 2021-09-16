<template>
  <v-container>
    <v-toolbar-title class="grey--text text--darken-4 ma-2">竞赛{{this.contest_name}}绑定的实验室列表
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
              medium
              v-bind="attrs"
              v-on="on"
          >
            mdi-help-circle-outline
          </v-icon>
        </template>
        <span>可拖拽排序</span>
      </v-tooltip>
    </v-toolbar-title>

        <v-simple-table>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">
                题号
              </th>
              <th class="text-left">
                LabId
              </th>
              <th class="text-left">
                名称
              </th>
              <th class="text-left">
                操作
              </th>
            </tr>
            </thead>
            <draggable v-model="contest_labs" tag="tbody">
              <tr
                v-for="(contest_lab, k) in contest_labs" :key="contest_lab.id"
              >
                <td>{{ String.fromCharCode(65 + k)}}</td>
                <td>{{ contest_lab.id }}</td>
                <td>{{ contest_lab.lab_name }}</td>
                <td>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                          medium
                          class="mr-2"
                          @click.stop="removeContestLab(contest_lab, k)"
                          v-bind="attrs"
                          v-on="on"
                      >
                        mdi-playlist-remove
                      </v-icon>
                    </template>
                    <span>删除</span>
                  </v-tooltip>
                </td>
              </tr>
            </draggable>
          </template>
        </v-simple-table>

    <v-toolbar-title class="grey--text text--darken-4 pt-16">实验室列表检索</v-toolbar-title>
    <LabList :contestChooseMode="true" :showTitle="false" :jumpToLab="false" @addContestLab="addContestLab"></LabList>

    <v-btn
        class="ma-2"
        color="success"
        block
        @click.native="submit"
    >
      提交列表
    </v-btn>
  </v-container>
</template>

<script>
import {apiContest} from "@/api";
import draggable from 'vuedraggable'
import LabList from "@/components/public/lab/LabList";
import {store, storeConst} from "@/store";
import * as colors from "@/constants/color";
import * as RouterPath from "@/constants/router_path";

export default {
  name: "ContestBind",
  data: () => ({
    contest_id: 0,
    contest_name: "",
    contest_labs: [
    ],
    contest_labs_headers: [{
      text: 'LabId',
      value: 'id',
      align: 'start',
      sortable: false,
    }, {
      text: 'Name',
      value: 'lab_name'
    }

    ]
  }),
  methods: {
    addContestLab: function(item) {
      let repeatIdx = this.contest_labs.findIndex(x => x.id === item.lab_info.id)
      if (repeatIdx !== -1) {
        this.contest_labs.splice(repeatIdx, 1)
      }
      this.contest_labs.push(item.lab_info)
    },
    removeContestLab: function (item, key) {
      this.contest_labs.splice(key, 1)
    },
    submit: function() {
      // get lab ids
      let ids = []
      for (let k in this.contest_labs) {
        ids.push(this.contest_labs[k].id)
      }
      apiContest.manageLabs({
        contest_id: this.contest_id,
        lab_ids: ids,
      }).then(() => {
        // 没问题就发消息&跳回到竞赛列表
        store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
          text: "竞赛绑定实验室成功",
          color: colors.GREEN,
        })
        this.$router.push({path: RouterPath.CONTEST_LIST, query:{adminMode:true}})
      }).catch()
    }
  },
  components: {
    draggable,
    LabList,
  },
  mounted() {
    this.contest_id = !isNaN(parseInt(this.$route.query.contestId)) ? parseInt(this.$route.query.contestId) : 0
    this.contest_name = this.$route.query.contestName
    if (this.contest_id !== 0) {
      apiContest.getContestBind({contest_id: this.contest_id}).then((item) => {
        if (item.data.data.contest_labs == null) {
          return
        }
        this.contest_labs = item.data.data.contest_labs
      }).catch()
    }
  },
}
</script>

<style scoped>
</style>