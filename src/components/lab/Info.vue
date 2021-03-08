<template>
  <v-container>
    <v-row style="width: 100%" id="info-editor-row">

      <v-col
          v-if="showDesc"
          cols="6"
          class="flex-grow-1 flex-shrink-0"
      >
<!--        <v-card-->
<!--            -->
<!--            outlined-->
<!--            absolute-->
<!--            -->
<!--        >-->
          <div id="lab_desc-card" v-html="LabInfo.lab_desc">
          </div>
<!--        </v-card>-->
      </v-col>

      <v-col
          :cols="editCols"
          class="flex-grow-0 flex-shrink-0"
      >
        <v-card
            class="mx-auto"
            id="edit-card"
            outlined
        >
          <v-card-subtitle class="pb-0">提交代码</v-card-subtitle>

          <MMonacoEditor v-model="code" mode="html" :syncInput=true
                  theme="vs" :style="{ height: (editorHeight - 92) + 'px',  minHeight: (editorHeight - 92) + 'px', width: '100%'}" @init="initCode"/>

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

<!--            <v-btn-->
<!--                color="primary"-->
<!--                @click="editorFullScreen"-->
<!--                right-->
<!--            >-->
<!--              全屏-->
<!--            </v-btn>-->
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
            <v-progress-circular
                indeterminate
                color="info"
                v-if="item.update_time == ''"
                class="mx-2"
            ></v-progress-circular>
            <v-btn :color="getStatusColor(item.status)" class="status_word_color" @click="showSubmitResult(item)">
              {{convertStatusId(item.status)}}
            </v-btn>
          </template>
          <template v-slot:item.create_time="{ item }">
            {{convertTime(item.create_time)}}
          </template>
          <template v-slot:item.update_time="{ item }">
            {{convertTime(item.update_time)}}
            <v-progress-circular
                indeterminate
                color="info"
                v-if="item.update_time === ''"
            ></v-progress-circular>
          </template>
        </v-data-table>
    </v-bottom-sheet>

    <SubmitResult :submit_result="submit_result"/>
    </v-container>
</template>

<script>
import {lab_submit_utils, time_utils} from "@/utils"
import SubmitResult from "@/components/submit/SubmitResult";
import {apiLab, apiSubmit} from '@/api'
import MMonacoEditor from 'vue-m-monaco-editor'

export default {
  name: "info",
  data: () => ({
    id: 0,
    editorHeight: window.innerHeight - 90,
    editCols: 6,
    code: "",
    codeBuffer: "",
    LabInfo: {
    },
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

    showDesc: true,

    submit_result: {
      id: 0,
      statusColor: "",
      statusName: "",
      resultList: [],
    },
  }),
  components: {
    SubmitResult,
    MMonacoEditor,
  },
  mounted() {
    this.loadLabInfo(false)
    // document.getElementById("lab_desc-card").style.maxHeight = this.editorHeight + "px"
    this.editorHeight = (window.innerHeight - 90)
    // 设置大小
    document.getElementById("lab_desc-card").style.maxHeight = this.editorHeight + "px"
    document.getElementById("lab_desc-card").style.minHeight = this.editorHeight + "px"
  },
  methods: {
    loadLabInfo(rewrite) {
      this.id = parseInt(this.$route.query.labId)
      apiLab.getLabInfo({
        id: this.id,
      }).then(response => {
        this.LabInfo = response.data.data.lab_info
        this.LabInfo.lab_desc = this.LabInfo.lab_desc.replace(/\n/g, "<br /><br />")
        this.codeBuffer = this.LabInfo.lab_template
        if (rewrite) {
          this.code = this.codeBuffer
        }
      }).catch(() => {})
    },
    submitLab() {
      apiSubmit.submitLab({
        lab_id: this.id,
        submit_data: this.code,
      }).then(response => {
        this.submitIds.push(response.data.data)
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
    initCode() {
      if (this.codeBuffer === "") {
        this.loadLabInfo(true)
      }
      this.code = this.codeBuffer
    },
    showSubmitListTable() {
      this.submitSheet = true
      this.initSubmitList()
      if (this.submitSubmitInterval != null) {
        return
      }
      this.submitSubmitInterval = setInterval(
          () => {this.initSubmitList()}
          , 5000
      )

    },
    initSubmitList() {
      // 如果面板没有展开，则忽略
      if (!this.submitSheet) {
        return ;
      }
      apiSubmit.submitListByLabId({
        lab_id: this.id,
      }).then(response => {
        if (response.data.data != null && response.data.data.length > 0) {
          this.submitStatus = response.data.data
        }
      }).catch(err => {
        console.log(err)
      })
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
    openFileDialog() {
      document.getElementById('zip-submit-file-upload').click()
    },
    showSubmitResult(item) {
      this.submit_result = {
        id: item.id,
        statusColor: this.getStatusColor(item.status),
        statusName: this.convertStatusId(item.status),
        resultList: lab_submit_utils.parseSubmitResult(item.submit_result),
      }
    },
    onFileChange(e) {
      let self = this;
      let files = e.target.files || e.dataTransfer.files;

      if(files.length > 0){
        for(let i = 0; i< files.length; i++){
          self.formData.append("file", files[i], files[i].name);
        }
      }
    },
  }
}
</script>

<style scoped>
#lab_desc-card{
  overflow: auto;
  height: 40%;
  position: relative;
}
#edit-card {
  height: 100%;
  position: relative;
  overflow: auto;
}
#info-editor-row {
  display: flex;
  height: 100%;
}
.status_word_color {
  color: white;
}
</style>