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
            <input id="zip-submit-file-upload" type="file" accept=".zip" style="display: none" @change="onFileChange"/>
            <v-btn
                color="primary"
                @click.native="openFileDialog"
            >
              上传zip包
            </v-btn>

            <v-btn
                color="primary"
                :loading="loading"
                :disabled="loading"
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
        >
          <template v-slot:item.status="{ item }">
            <v-chip text-color="white" :color="getStatusColor(item)">{{convertStatusId(item.status)}}</v-chip>
          </template>
          <template v-slot:item.create_time="{ item }">
            {{convertTime(item.create_time)}}
          </template>
          <template v-slot:item.update_time="{ item }">
            {{convertTime(item.update_time)}}
          </template>
        </v-data-table>
    </v-bottom-sheet>
    </v-container>
</template>

<script>
import axios from "axios";
import * as config from "@/constants/config";
import * as api from "@/constants/api";
import * as LabSubmitUtils from "@/utils/LabSubmitUtils"
import * as TimeUtils from "@/utils/TimeUtils"
import qs from 'qs'

export default {
  name: "info",
  data: () => ({
    id: 0,
    LabInfo: {},
    submitIds: [],
    formData: new FormData(),
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

    loading: false,
    loader: null,
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
      this.loader = 'loading'
      const l = this.loader
      this[l] = !this[l]
      setTimeout(() => (this[l] = false), 3000)
      this.loader = null
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
      }).catch(err => {
        console.log(err)
      })
    },
    getStatusColor(item) {
      return LabSubmitUtils.getStatusColor(item.status)
    },
    convertStatusId(status) {
      return LabSubmitUtils.convertStatusId(status)
    },
    convertTime(time) {
      return TimeUtils.convertMicroToDate(time)
    },
    openFileDialog() {
      document.getElementById('zip-submit-file-upload').click()
    },
    onFileChange(e) {
      let self = this;
      let files = e.target.files || e.dataTransfer.files;

      if(files.length > 0){
        for(let i = 0; i< files.length; i++){
          self.formData.append("file", files[i], files[i].name);
        }
      }
    }

  }
}
</script>

<style scoped>
</style>