<template>
  <v-container>
    <v-form
        ref="form"
    >
      <v-select
          v-model="lab_type"
          label="实验室类型"
          :items="lab_type_maps"
          item-text="name"
          item-value="type"
          return-object
      >
      </v-select>

      <v-text-field
          v-model="lab_name"
          label="实验室名称"
          required
      ></v-text-field>

      <quill-editor
          class="editor"
          ref="myTextEditor"
          :value="lab_desc"
          :options="editorOption"
          @change="onEditorChange"
      />

      <v-toolbar-title class="grey--text text--darken-4 ma-2">正确答案代码【用于试跑校验，对外隐藏】</v-toolbar-title>
      <MMonacoEditor v-model="lab_sample" mode="html" :syncInput=true theme="vs" width="100%" height="600px" @init="initSample"/>

      <v-toolbar-title class="grey--text text--darken-4 ma-2">代码模板【用于辅助答题，对外显示】</v-toolbar-title>
      <MMonacoEditor v-model="lab_template" mode="html" :syncInput=true theme="vs" width="100%" height="600px" @init="initTemplate"/>

      <v-col>
        <v-btn
            class="ma-2"
            color="primary"
            @click.native="submit"
            v-if="lab_id === 0"
        >
          提交
        </v-btn>
        <v-btn
            class="ma-2"
            color="primary"
            @click.native="update"
            v-if="lab_id !== 0"
        >
          更新
        </v-btn>
        <v-btn
            class="ma-2"
            :color="colors.GREEN"
            @click.native="testcase"
            v-if="lab_id !== 0"
        >
          下线实验室并编辑测试用例
        </v-btn>
      </v-col>

    </v-form>
  </v-container>
</template>

<script>
import dedent from 'dedent'
import debounce from 'lodash/debounce'
import { quillEditor, Quill } from 'vue-quill-editor'
import { container, ImageExtend, QuillWatch } from 'quill-image-extend-module'
import MMonacoEditor from 'vue-m-monaco-editor'

// import theme style
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import * as config from "@/constants/config";
import * as api from "@/api/api_const";
import {apiLab} from "@/api";
import * as RouterPath from "@/constants/router_path";
import {store, storeConst} from "@/store";
import * as colors from "@/constants/color";


Quill.register('modules/ImageExtend', ImageExtend)

export default {
  name: "AddLab",
  data: () => ({
    lab_id: 0,

    lab_type: "",
    lab_type_maps: [
      {"name": "HTML", "type": 0,},
      {"name": "CSS", "type":1,},
      {"name": "JavaScript", "type":2,},
      {"name": "Vue", "type":3,},
      {"name": "Complex", "type":4,},
      {"name": "PRD", "type":5,},
      {"name": "imitate", "type":6,},
      {"name": "security", "type":7,},
    ],

    lab_name: "",
    lab_desc: dedent`
    <br><br><br><br><p><h2>Input</h2></p><br><p><br></p><p><br></p><h2>Output</h2><p><br></p><p><br></p><p><br></p><h2>Example</h2><h3>Input</h3><pre class="ql-syntax" spellcheck="false"><br/></pre><p><br></p><h3>Output</h3><pre class="ql-syntax" spellcheck="false"><br></pre><p><br></p><p><br></p><p><br></p><h2>Note</h2><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p>
    `,

    lab_sample: "",
    lab_sample_buffer: "",
    lab_template: "",
    lab_template_buffer: "",

    colors: colors,

    editorOption: {
      modules: {
        ImageExtend: {
          loading: true,
          name: 'file',
          action: config.BASE_BACKEND + api.TOOL_UPLOAD_FILE,
          response: (res) => {
            return config.BASE_BACKEND + api.TOOL_GET_FILE + "?file=" + res.data
          },
          headers: (xhr) => {
            xhr.withCredentials = true
          }
        },
        toolbar: {
          container: container,
          handlers: {
            'image': function () {
              QuillWatch.emit(this.quill.id)
            }
          }
        },
      },
      placeholder: "实验室描述"
    },
  }),
  components: {
    quillEditor,
    MMonacoEditor,
  },
  methods: {
    onEditorChange: debounce(function(value) {
      this.content = value.html
    }, 466),
    submit: function () {
      apiLab.addLab({
        lab_name: this.lab_name,
        lab_desc: this.lab_desc,
        lab_sample: this.lab_sample,
        lab_template: this.lab_template,
        lab_type: this.lab_type.type,
      }).then(response => {
        this.lab_id = response.data.data
        store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
          text: "创建成功，请继续创建测试用例",
          color: colors.GREEN,
        })
      }).catch(err => {
        console.log(err)
      })
    },
    update: function () {
      apiLab.updateLab({
        lab_id: this.lab_id,
        lab_name: this.lab_name,
        lab_desc: this.lab_desc,
        lab_sample: this.lab_sample,
        lab_template: this.lab_template,
        lab_type: this.lab_type,
      }).then(response => {
        response
      }).catch(err => {
        console.log(err)
      })
    },
    testcase: function () {
      // 变更实验室为建造中
      apiLab.constructingLab({"lab_id": this.lab_id,}).then((data) => {
        data
        this.$router.push({path: RouterPath.ADMIN_LAB_TESTCASE_PUT, query: {labId: this.lab_id}})
      }).catch()

    },
    initSample: function () {
      this.lab_sample = this.lab_sample_buffer
    },
    initTemplate: function () {
      this.lab_template = this.lab_template_buffer
    },
  },
  mounted() {
    this.lab_id = !isNaN(parseInt(this.$route.query.labId)) ? parseInt(this.$route.query.labId) : 0
    if (this.lab_id !== 0) {
      apiLab.getLabInfo({id: this.lab_id}).then((item) => {
        this.lab_type = item.data.data.LabInfo.lab_type
        this.lab_name = item.data.data.LabInfo.lab_name
        this.lab_desc = item.data.data.LabInfo.lab_desc
        this.lab_sample_buffer = item.data.data.LabInfo.lab_sample
        this.lab_template_buffer = item.data.data.LabInfo.lab_template
      }).catch()
    }
  }
}
</script>

<style scoped>

</style>