<template>
  <v-container>
    <v-text-field
        v-model="this.testcase_desc"
        label="测试用例说明"
        required
    ></v-text-field>

    <v-text-field
        v-model="this.testcase_url"
        label="URL"
        required
    ></v-text-field>

    <v-toolbar-title class="grey--text text--darken-4 ma-2">控制</v-toolbar-title>

    <v-row>
      <v-col cols="12" sm="4" md="4">
        <v-text-field
            label="宽度"
            v-model="this.testcase_width"
            placeholder="1920"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="4" md="4">
        <v-text-field
            label="高度 默认0为自适应"
            v-model="this.testcase_height"
            placeholder="0"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="4" md="4">
        <v-text-field
            label="从运行起延时ms"
            placeholder="0"
            v-model="this.wait_before"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-btn block color="success" @click="testRun(idx - 1)">运行测试用例</v-btn>
    <v-divider/>

    <v-container class="ma-5">
    <img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.soutu123.com%2Fback_pic%2F04%2F03%2F92%2F1058091ea68a193.jpg%21%2Ffw%2F700%2Fquality%2F90%2Funsharp%2Ftrue%2Fcompress%2Ftrue&refer=http%3A%2F%2Fpic.soutu123.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1616380956&t=70d8635e1a7717d01fdbbce90c94358c">
    </v-container>

    <v-divider/>
    <v-col cols="12">
      <v-col cols="6" class="d-inline-flex"><v-btn class="mt-4 mb-4" block color="success" @click="submitTestCases">保存</v-btn></v-col>
      <v-col cols="6" class="d-inline-flex"><v-btn class="mt-4 mb-4" block color="success" @click="saveAndEnableLab">保存并上线实验室</v-btn></v-col>
    </v-col>
  </v-container>
</template>

<script>
import {apiLab} from "@/api";
import {store, storeConst} from "@/store";
import * as colors from "@/constants/color";
import * as RouterPath from "@/constants/router_path";

export default {
  name: "PutComplexLabTestcase",
  data: () => ({
    testcase_num: 1,
    lab_id: 0,
    lab_type: 0,
    testcase_desc: "",
    testcase_url: "",
    testcase_width: "",
    testcase_height: "",
    wait_before: "",

    // 待组装
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
    testRun: function (idx) {
      let testcase = {}
      testcase.lab_id = this.lab_id
      testcase.lab_testcase = this.testcases[idx]
      apiLab.runLabTestcase(testcase).then(response => {
        this.testcases[idx].output = response.data.data.SubmitOutput
      }).catch()
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
  },
  mounted() {
    this.lab_id = parseInt(this.$route.query.labId)
    apiLab.getLabTestList({
      lab_id: this.lab_id,
    }).then(response => {
      this.testcase_num = 0
      this.testcases = []
      for (let i in response.data.data) {
        this.testcases.push({
          testcase_desc: response.data.data[i].testcase_desc,
          testcase_code: "",
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
}
</script>

<style scoped>

</style>