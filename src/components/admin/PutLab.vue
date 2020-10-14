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
      <editor v-model="lab_sample" @init="editorInit" lang="html" theme="chrome" width="100%" height="600px" ></editor>

      <v-toolbar-title class="grey--text text--darken-4 ma-2">代码模板【用于辅助答题，对外显示】</v-toolbar-title>
      <editor v-model="lab_template" @init="editorInit" lang="html" theme="chrome" width="100%" height="600px" ></editor>

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
      </v-col>

    </v-form>
  </v-container>
</template>

<script>
import dedent from 'dedent'
import hljs from 'highlight.js'
import debounce from 'lodash/debounce'
import { quillEditor, Quill } from 'vue-quill-editor'
import { container, ImageExtend, QuillWatch } from 'quill-image-extend-module'


// highlight.js style
import 'highlight.js/styles/tomorrow.css'

// import theme style
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import * as axios from "axios";
import * as config from "@/constants/config";
import * as api from "@/constants/api";
import qs from "qs";
import * as RouterPath from "@/constants/router_path";


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
    <p><br></p><p><br></p><p><br></p><p><br></p><h2>Input</h2><p><br></p><p><br></p><p><br></p><h2>Output</h2><p><br></p><p><br></p><p><br></p><h2>Example</h2><h3>Input</h3><pre class="ql-syntax" spellcheck="false"><br/></pre><p><br></p><h3>Output</h3><pre class="ql-syntax" spellcheck="false"><br></pre><p><br></p><p><br></p><p><br></p><h2>Note</h2><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p>
    `,

    lab_sample: "",
    lab_template: "",

    editorOption: {
      modules: {
        ImageExtend: {
          loading: true,
          name: 'file',
          action: config.BASE_BACKEND + api.TOOL_UPLOAD_FILE,
          response: (res) => {
            return config.BASE_BACKEND + api.TOOL_GET_FILE + "?file=" + res.data
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
        syntax: {
          highlight: text => hljs.highlightAuto(text).value
        },
      },
      placeholder: "实验室描述"
    },
  }),
  components: {
    quillEditor,
    editor: require('vue2-ace-editor'),
  },
  methods: {
    onEditorChange: debounce(function(value) {
      this.content = value.html
    }, 466),
    editorInit: function () {
      require('brace/ext/language_tools') //language extension prerequsite...
      require('brace/mode/html')
      require('brace/mode/javascript')    //language
      require('brace/mode/less')
      require('brace/theme/chrome')
      require('brace/snippets/javascript') //snippet
    },
    submit: function () {
      axios.post(
          config.BASE_BACKEND + api.LAB_ADD, qs.stringify({
            lab_name: this.lab_name,
            lab_desc: this.lab_desc,
            lab_sample: this.lab_sample,
            lab_template: this.lab_template,
            lab_type: this.lab_type,
          })
      ).then(response => {
        this.lab_id = response.data
      }).catch(err => {
        console.log(err)
      })
    },
    update: function () {
      axios.post(
          config.BASE_BACKEND + api.LAB_UPDATE, qs.stringify({
            lab_id: this.lab_id,
            lab_name: this.lab_name,
            lab_desc: this.lab_desc,
            lab_sample: this.lab_sample,
            lab_template: this.lab_template,
            lab_type: this.lab_type,
          })
      ).then(response => {
        response
      }).catch(err => {
        console.log(err)
      })
    }
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