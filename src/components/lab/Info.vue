<template>
  <v-container>
    <v-row style="width: 100%">

      <v-col
          cols="6"
          class="flex-grow-1 flex-shrink-0"
      >
        <v-card
            class="d-flex pa-1"
            outlined
            absolute
            style="height: 100%; word-wrap:break-word; word-break:break-all; overflow: hidden;"
            v-html="this.LabInfo.lab_desc"
        >
        </v-card>
      </v-col>

      <v-col
          cols="6"
          class="flex-grow-0 flex-shrink-0"
      >
        <v-card
            class="mx-auto"
            outlined
        >
          <v-card-subtitle class="pb-0">提交代码</v-card-subtitle>

          <v-card-text class="text--primary">
            <div>
              <v-textarea outlined auto-grow v-model="this.LabInfo.lab_sample"></v-textarea>
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn
                color="primary"
            >
              上传zip包
            </v-btn>

            <v-btn
                color="primary"
                @click="submitLab"
            >
              提交
            </v-btn>

            <v-btn
                color="primary"
                @click="showSubmitListTable"
                right
            >
              提交结果
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-bottom-sheet v-model="submitSheet" scrollable inset>
        <v-data-table
            :headers="submitSheetTableHeaders"
            :items="submitStatus"
            hide-default-footer
            class="elevation-1"
            style="overflow-y: auto; overflow-x: hidden; display: block;"
        ></v-data-table>
    </v-bottom-sheet>
    </v-container>
</template>

<script>
import axios from "axios";
import * as config from "@/constants/config";
import * as api from "@/constants/api";
import qs from 'qs'

export default {
  name: "info",
  data: () => ({
    id: 0,
    LabInfo: {},
    submitIds: [],

    submitStatus: [],
    submitSheet: false,
    submitSheetTableHeaders: [
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
    submitSubmitInterval: null,
  }),
  mounted() {
    this.id = parseInt(this.$route.query.labId)
    axios.post(
        config.BASE_BACKEND + api.LAB_INFO, {
          id: this.id,
        }
    ).then(response => {
      this.LabInfo = response.data['data'].LabInfo
      this.LabInfo.lab_desc = this.LabInfo.lab_desc.replace(/\n/g, "<br />")
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    submitLab() {
      axios.post(
          config.BASE_BACKEND + api.LAB_SUBMIT, qs.stringify({
            lab_id: this.id,
            submit_data: this.LabInfo.lab_sample,
          })
      ).then(response => {
        this.submitIds.push(response.data['data'])
        this.submitSheet = true
        this.showSubmitListTable()
        // this.LabInfo = response.data['data'].LabInfo
      }).catch(err => {
        console.log(err)
      })
    },
    showSubmitListTable() {
      this.initSubmitList()
      this.submitSheet = true
      if (this.submitSubmitInterval != null) {
        return
      }
      this.submitSubmitInterval = setInterval(
          () => {this.initSubmitList()}
          , 5000
      )

    },
    initSubmitList() {
      axios.post(
          config.BASE_BACKEND + api.LAB_SUBMIT_LIST_BY_LAB_ID, qs.stringify({
            lab_id: this.id,
          })
      ).then(response => {
        this.submitStatus = response.data['data']
        // 重新渲染
        for (let i in this.submitStatus) {
          // status处理
          switch (this.submitStatus[i].status) {
            case 1:
              this.submitStatus[i].status = "PENDING"
              break;

          }

          // update处理
          // let updateDate = new Date(this.submitStatus[i].update_time)
          // this.submitStatus[i].update_time = this.submitStatus[i].update_time === 0 ? "-" : updateDate.getFullYear() + "-" + updateDate.getMonth() + ""
        }
        console.log(this.submitStatus)
      }).catch(err => {
        console.log(err)
      })
    }

  }
}
</script>

<style scoped>
</style>