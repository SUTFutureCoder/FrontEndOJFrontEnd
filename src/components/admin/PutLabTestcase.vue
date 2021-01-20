<template>
  <v-container>
    <div class="mt-2" v-for="idx in testcase_num" :key="idx">
      <a>第{{idx}}个测试用例</a>
      <v-text-field
          v-model="testcases[idx - 1].testcase_desc"
          label="测试用例说明"
          required
      ></v-text-field>

      <v-toolbar-title class="grey--text text--darken-4 ma-2">控制台执行代码</v-toolbar-title>
      <editor v-model="testcases[idx - 1].testcase_code" @init="editorInit" lang="javascript" theme="chrome" width="100%" height="200px" ></editor>

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
            filled
            label="请点击【运行测试用例】按钮获取输出"
            v-model="testcases[idx - 1].output"
            auto-grow
            disabled
        ></v-textarea>

      </v-row>
      <v-btn block color="success" @click="testRun(idx - 1)">运行测试用例</v-btn>
    </div>
    <v-btn class="mt-4 mb-4" block color="primary" @click="addTestCase">添加测试用例</v-btn>
    <v-btn class="mt-4 mb-4" block color="success" @click="submitTestCases">提交</v-btn>
  </v-container>
</template>

<script>

import hljs from "highlight.js";
import * as axios from "axios";
import * as config from "@/constants/config";
import * as api from "@/api/api_const";

export default {
  name: "AddLabTestcase",
  data: () => ({
    testcase_num: 1,
    lab_id: 0,
    testcases: [{
      testcase_desc: "",
      testcase_code: "",
      input: "",
      output: "",
      time_limit: 0,
      mem_limit: 0,
      wait_before: 0,
    }],
  }),
  methods: {
    addTestCase: function () {
      this.testcases.push({
        testcase_desc: "",
        testcase_code: "",
        input: "",
        output: "",
        time_limit: 0,
        mem_limit: 0,
        wait_before: 0,
      })
      this.testcase_num++
    },
    editorInit: function () {
      require('brace/ext/language_tools') //language extension prerequsite...
      require('brace/mode/html')
      require('brace/mode/javascript')    //language
      require('brace/mode/less')
      require('brace/theme/chrome')
      require('brace/snippets/javascript') //snippet
    },
    testRun: function (idx) {
      console.log(this.testcases[idx])
    },
    submitTestCases: function () {

    },
  },
  mounted() {
    this.lab_id = parseInt(this.$route.query.labId)
    axios.post(
        config.BASE_BACKEND + api.LAB_TESTCASE_LIST, {
          lab_id: this.lab_id,
        }
    ).then(response => {
      this.testcase_num = 0
      this.testcases = []
      for (let i in response.data.data) {
        this.testcases.push({
          testcase_desc: response.data.data[i].testcase_desc,
          testcase_code: response.data.data[i].testcase_code,
          input: response.data.data[i].input,
          output: response.data.data[i].output,
          time_limit: response.data.data[i].time_limit,
          mem_limit: response.data.data[i].mem_limit,
          wait_before: response.data.data[i].wait_before,
        })
        this.testcase_num++
      }
      console.log(response.data)
      console.log(this.testcases)
    }).catch(err => {
      console.log(err)
    })
  },
  components: {
    editor: require('vue2-ace-editor'),
  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill
    },
    contentCode() {
      return hljs.highlightAuto(this.content).value
    }
},
}
</script>

<style scoped>

</style>