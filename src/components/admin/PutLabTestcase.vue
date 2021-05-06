<template>
  <v-container>
    <div class="mt-2" v-for="idx in testcase_num" :key="idx">
      <a>第{{idx}}个测试用例</a><v-spacer></v-spacer><v-btn color="warning" @click="deleteTestcase(idx - 1)">删除用例</v-btn>
      <v-text-field
          v-model="testcases[idx - 1].testcase_desc"
          label="测试用例说明"
          required
      ></v-text-field>

      <v-row>
        <v-toolbar-title class="grey--text text--darken-4 ma-2">控制台执行代码</v-toolbar-title>
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
          <span>
            请输入能够在浏览器控制台执行的语句<br/>
            例1：获得id为test的文字<br/>innerText
          </span>
        </v-tooltip>
      </v-row>


      <MMonacoEditor v-model="testcases[idx - 1].testcase_code" mode="javascript" :cdnUrl=configs.MONACO_CDN :syncInput=true
                     theme="vs" width="100%" height="200px" @init="initTestcaseCode(idx - 1)" />

      <v-row>
        <v-col cols="12" sm="4" md="4">
          <v-text-field
              label="时间限制ms"
              v-model="testcases[idx - 1].time_limit"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="4" md="4">
          <v-text-field
              label="内存限制kb"
              v-model="testcases[idx - 1].mem_limit"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="4" md="4">
          <v-text-field
              label="从运行起延时ms"
              placeholder="0"
              v-model="testcases[idx - 1].wait_before"
          ></v-text-field>
        </v-col>

        <v-textarea
            name="input-2-1"
            label="请点击【运行测试用例】按钮获取输出 或 手动输入预期结果"
            v-model="testcases[idx - 1].output"
            auto-grow
        ></v-textarea>

      </v-row>
      <v-btn block color="success" @click="testRun(idx - 1)">运行测试用例</v-btn>
    </div>
    <v-btn class="mt-4 mb-4" block color="primary" @click="addTestCase">添加测试用例</v-btn>
    <v-divider/>
    <v-col cols="12">
      <v-col cols="6" class="d-inline-flex"><v-btn class="mt-4 mb-4" block color="success" @click="submitTestCases">保存</v-btn></v-col>
      <v-col cols="6" class="d-inline-flex"><v-btn class="mt-4 mb-4" block color="success" @click="saveAndEnableLab">保存并上线实验室</v-btn></v-col>
    </v-col>
  </v-container>
</template>

<script>
import {apiLab} from "@/api";
import MMonacoEditor from 'vue-m-monaco-editor'
import {store, storeConst} from "@/store";
import * as colors from "@/constants/color";
import * as configs from "@/constants/config"
import * as RouterPath from "@/constants/router_path";

export default {
  name: "AddLabTestcase",
  data: () => ({
    testcase_num: 1,
    lab_id: 0,
    lab_type: 0,
    manual_mode: false,
    testcases: [{
      testcase_desc: "",
      testcase_code: "",
      testcase_code_buffer: "",
      input: "",
      output: "",
      time_limit: 0,
      mem_limit: 0,
      wait_before: 0,
    }],

    configs: configs,
  }),
  methods: {
    addTestCase: function () {
      this.testcases.push({
        testcase_desc: "",
        testcase_code: "",
        testcase_code_buffer: "",
        input: "",
        output: "",
        time_limit: 0,
        mem_limit: 0,
        wait_before: 0,
      })
      this.testcase_num++
    },
    deleteTestcase: function (idx) {
      this.testcases.splice(idx, 1)
      this.testcase_num--
    },
    testRun: function (idx) {
      let testcase = {}
      testcase.lab_id = this.lab_id
      testcase.lab_testcase = this.testcases[idx]
      apiLab.runLabTestcase(testcase).then(response => {
        if (response.data.data !== undefined && response.data.data.Err !== "") {
          store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
            text: "执行失败，请检查执行代码JS语句是否正确、是否尝试获取不存在的元素",
            color: colors.RED,
          })
          return
        }
        this.testcases[idx].output = response.data.data.SubmitOutput
      }).catch(err => {
        console.log(err)
      })
    },
    submitTestCases: function () {
      apiLab.setLabTestcase({"lab_id": this.lab_id, "testcases":this.testcases}).then(() => {
        store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
          text: "创建成功，请手动上线实验室",
          color: colors.GREEN,
        })
      }).catch()
    },
    saveAndEnableLab: function () {
      apiLab.setLabTestcase({"lab_id": this.lab_id, "testcases":this.testcases}).then(() => {
        apiLab.enableLab({"lab_id": this.lab_id,}).then(() => {
          // 没问题就发消息&跳回到管理列表
          store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
            text: "上线实验室成功",
            color: colors.GREEN,
          })
          this.$router.push({path: RouterPath.LAB_LIST, query:{adminMode:true}})
        }).catch()
      }).catch()
    },
    initTestcaseCode: function (id) {
      this.testcases[id].testcase_code = this.testcases[id].testcase_code_buffer
    }
  },
  mounted() {
    document.documentElement.scrollTop = document.body.scrollTop = 0
    this.lab_id = parseInt(this.$route.query.labId)
    this.lab_type = parseInt(this.$route.query.labType)
    apiLab.getLabTestList({
      lab_id: this.lab_id,
    }).then(response => {
      this.testcase_num = 0
      this.testcases = []
      for (let i in response.data.data) {
        this.testcases.push({
          testcase_desc: response.data.data[i].testcase_desc,
          testcase_code: response.data.data[i].testcase_code,
          testcase_code_buffer: response.data.data[i].testcase_code,
          input: response.data.data[i].input,
          output: response.data.data[i].output,
          time_limit: response.data.data[i].time_limit,
          mem_limit: response.data.data[i].mem_limit,
          wait_before: response.data.data[i].wait_before,
        })
        this.testcase_num++
      }
    }).catch(err => {
      console.log(err)
    })
  },
  components: {
    MMonacoEditor,
  },
}
</script>

<style scoped>

</style>