<template>
  <v-container>
    <v-text-field
        v-model="testcase_desc"
        label="测试用例说明"
        required
    ></v-text-field>

    <v-select
        v-model="testcase_img_type"
        label="测试标准用例图 上传/URL"
        :items="testcase_img_type_maps"
        item-text="name"
        item-value="type"
        return-object
    >
    </v-select>

    <div v-if="testcase_img_type.type === TYPE_UPLOAD">
      <input id="testcase-img-upload" type="file" accept="image/jpeg,image/jpg,image/png,image/svg" style="display: none" @change="onFileChange"/>
      <!--      预览图    -->
      <v-btn
          color="primary"
          @click.native="openFileDialog"
      >
        上传标准用例图
      </v-btn>
    </div>

    <div v-if="testcase_img_type.type === TYPE_SNAPSHOT">
      <v-text-field
          v-model="testcase_url"
          label="模仿对象URL"
          required
      ></v-text-field>
      <v-text-field
          v-model="testcase_url_cookies"
          label="携带cookies"
      ></v-text-field>
      <v-btn block color="success" @click="testRun()">运行测试用例</v-btn>
    </div>

    <v-container class="ma-5">
      <img style="width: 100%" v-if="imgurl !== ''" :src="imgurl">
    </v-container>

    <v-divider/>

    <v-toolbar-title class="grey--text text--darken-4 ma-2">运行设备控制</v-toolbar-title>
    <v-row>
      <v-col cols="12" sm="3" md="3">
        <v-text-field
            label="宽度"
            v-model="testcase_width"
            placeholder="1920"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="3" md="3">
        <v-text-field
            label="高度 默认0为自适应"
            v-model="testcase_height"
            placeholder="0"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="3" md="3">
        <v-text-field
            label="从运行起延时ms"
            placeholder="0"
            v-model="wait_before"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="3" md="3">
        <v-text-field
            label="通过百分比"
            placeholder="0"
            v-model="ac_similarity_rate"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-col cols="12">
      <v-col cols="6" class="d-inline-flex"><v-btn class="mt-4 mb-4" block color="success" @click="submitTestCases">保存</v-btn></v-col>
      <v-col cols="6" class="d-inline-flex"><v-btn class="mt-4 mb-4" block color="success" @click="saveAndEnableLab">保存并上线实验室</v-btn></v-col>
    </v-col>
  </v-container>
</template>

<script>
import {apiLab,} from "@/api";
import {store, storeConst} from "@/store";
import * as colors from "@/constants/color";
import * as RouterPath from "@/constants/router_path";
import * as config from "@/constants/config";
import * as api from "@/api/api_const";

export default {
  name: "PutComplexLabTestcase",
  data: () => ({
    testcase_img_type: {"type": 0,},
    TYPE_UPLOAD: 0,
    TYPE_SNAPSHOT: 1,
    testcase_img_type_maps: [
      {"name": "上传", "type":0,},
      {"name": "快照", "type":1,},
    ],
    formData: new FormData(),
    haveFormData: false,
    imgurl: "",

    testcase_num: 1,
    lab_id: 0,
    lab_type: 0,
    testcase_desc: "",
    testcase_url: "",
    testcase_url_cookies: "",
    testcase_width: "",
    testcase_height: "",
    wait_before: "",
    ac_similarity_rate: 0,

    // 待组装
    testcases: [{
      testcase_desc: "",
      testcase_code: "",
      testcase_code_buffer: "",
      input: "",
      output: "",
      time_limit: 0,
      mem_limit: 0,
      width: 0,
      height: 0,
      wait_before: 0,
      ac_similarity_rate: 0,
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
    testRun: function () {
      let testcase = {}
      testcase.lab_id = this.lab_id
      this.buildTasecases()
      testcase.lab_testcase = this.testcases[0]
      apiLab.runLabTestcase(testcase).then(response => {
        this.imgurl = config.BASE_BACKEND + api.TOOL_GET_FILE + "?file=" + response.data.data.SubmitOutput
      }).catch()
    },
    openFileDialog() {
      if (this.haveFormData) {
        this.formData.delete("file")
        this.haveFormData = false
      }
      document.getElementById('testcase-img-upload').click()
    },
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;

      if(files.length > 0){
        for(let i = 0; i< files.length; i++){
          this.formData.set("file", files[i], files[i].name);
          this.haveFormData = true
        }
      }
      e.target.value = ''

      // upload
      apiLab.uploadTestcaseImg(this.formData, {
        headers: {'Content-Type':'multipart/form-data', 'data':this.lab_id,}
      }).then(response => {
        this.imgurl = config.BASE_BACKEND + api.TOOL_GET_FILE + "?file=" + response.data.data
      }).catch(err => {
        store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
          text: "上传失败，请重试 - " + err,
          color: colors.RED,
        })
      })
      return false
    },
    submitTestCases: function () {
      // 判断测试用例类型
      this.buildTasecases()
      console.log(this.testcases)
      apiLab.setLabTestcase({"lab_id": this.lab_id, "testcases":this.testcases}).then(() => {
        store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
          text: "创建成功，请手动上线实验室",
          color: colors.GREEN,
        })
      }).catch()
    },
    saveAndEnableLab: function () {
      this.buildTasecases()
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
    buildTasecases: function () {
      this.testcases = []
      this.testcases.push({
        testcase_desc: this.testcase_desc,
        testcase_code: this.imgurl,
        input: JSON.stringify({testcase_img_type: this.testcase_img_type.type, testcase_width: parseInt(this.testcase_width, 10), testcase_height: parseInt(this.testcase_height, 10), testcase_url: this.testcase_url, testcase_url_cookies: this.testcase_url_cookies }),
        output: JSON.stringify({ac_similarity_rate: parseInt(this.ac_similarity_rate, 10)}),
        time_limit: 0,
        mem_limit: 0,
        wait_before: parseInt(this.wait_before, 10),
      })
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
        this.testcase_desc = response.data.data[i].testcase_desc
        this.imgurl = response.data.data[i].testcase_code
        let inputJson = JSON.parse(response.data.data[i].input)
        this.testcase_width = inputJson.testcase_width
        this.testcase_height = inputJson.testcase_height
        this.testcase_img_type = {"type": inputJson.testcase_img_type,}
        this.testcase_url = inputJson.testcase_url
        this.testcase_url_cookies = inputJson.testcase_url_cookies
        let outputJson = JSON.parse(response.data.data[i].output)
        this.ac_similarity_rate = outputJson.ac_similarity_rate
        this.wait_before = response.data.data[i].wait_before,
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