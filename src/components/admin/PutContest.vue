<template>
  <v-container>
    <v-form
        ref="form"
    >
      <v-text-field
          v-model="contest_name"
          label="比赛名称"
          required
      ></v-text-field>

      <quill-editor
          class="editor"
          ref="myTextEditor"
          v-model="contest_desc"
          :content="contest_desc"
          :options="editorOption"
      />

      <v-datetime-picker label="比赛开始时间" v-model="contest_start_time">
        <template slot="dateIcon">
          <v-icon>mdi-calendar</v-icon>
        </template>
        <template slot="timeIcon">
          <v-icon>mdi-clock-outline</v-icon>
        </template>
      </v-datetime-picker>
      <v-datetime-picker label="比赛结束时间" v-model="contest_end_time">
        <template slot="dateIcon">
          <v-icon>mdi-calendar</v-icon>
        </template>
        <template slot="timeIcon">
          <v-icon>mdi-clock-outline</v-icon>
        </template>
      </v-datetime-picker>
      <v-datetime-picker label="报名开始时间" v-model="signup_start_time">
        <template slot="dateIcon">
          <v-icon>mdi-calendar</v-icon>
        </template>
        <template slot="timeIcon">
          <v-icon>mdi-clock-outline</v-icon>
        </template>
      </v-datetime-picker>
      <v-datetime-picker label="报名结束时间" v-model="signup_end_time">
        <template slot="dateIcon">
          <v-icon>mdi-calendar</v-icon>
        </template>
        <template slot="timeIcon">
          <v-icon>mdi-clock-outline</v-icon>
        </template>
      </v-datetime-picker>
      <v-col>
        <v-btn
            class="ma-2"
            color="primary"
            @click.native="submit"
            v-if="contest_id === 0"
        >
          提交
        </v-btn>
        <v-btn
            class="ma-2"
            color="primary"
            @click.native="update"
            v-if="contest_id !== 0"
        >
          更新
        </v-btn>
        <v-btn
            class="ma-2"
            :color="colors.GREEN"
            @click.native="bindlabs"
            v-if="contest_id !== 0"
        >
          绑定竞赛实验室
        </v-btn>
      </v-col>
    </v-form>
  </v-container>
</template>

<script>
import Vue from 'vue'
import DatetimePicker from 'vuetify-datetime-picker'
Vue.use(DatetimePicker)

import { quillEditor, Quill } from 'vue-quill-editor'
import { container, ImageExtend, QuillWatch } from 'quill-image-extend-module'

// import theme style
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import * as config from "@/constants/config";
import * as api from "@/api/api_const";
import {apiContest} from "@/api";
import * as colors from "@/constants/color"
import {store, storeConst} from "@/store";
import * as RouterPath from "@/constants/router_path";
Quill.register('modules/ImageExtend', ImageExtend)


export default {
  name: "PutContest",
  data: () => ({
    contest_id: 0,

    contest_name: "",
    contest_desc: "",
    contest_start_time: "",
    contest_end_time: "",
    signup_start_time: "",
    signup_end_time: "",

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
      placeholder: "比赛描述",
    },
  }),
  methods: {
    checkInput: function() {
      if (this.contest_name === "") {
        store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
          text: "请输入竞赛名称",
          color: colors.RED,
        })
        return false
      }
      if (this.contest_start_time === "") {
        store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
          text: "请选择竞赛开始时间",
          color: colors.RED,
        })
        return false
      }
      if (this.contest_end_time === "") {
        store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
          text: "请选择竞赛结束时间",
          color: colors.RED,
        })
        return false
      }
      if (this.signup_start_time === "") {
        store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
          text: "请选择竞赛报名开始时间",
          color: colors.RED,
        })
        return false
      }
      if (this.signup_end_time === "") {
        store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
          text: "请选择竞赛报名结束时间",
          color: colors.RED,
        })
        return false
      }
      return true
    },
    submit: function () {
      if (!this.checkInput()) {
        return
      }
      apiContest.createContest({
        contest_name: this.contest_name,
        contest_desc: this.contest_desc,
        contest_start_time: this.contest_start_time.getTime(),
        contest_end_time: this.contest_end_time.getTime(),
        signup_start_time: this.signup_start_time.getTime(),
        signup_end_time: this.signup_end_time.getTime(),
      }).then(response => {
        this.contest_id = response.data.data
        store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
          text: "创建竞赛成功，请继续绑定实验室",
          color: colors.GREEN,
        })
      }).catch(err => {
        console.log(err)
      })
    },
    update: function () {
      if (!this.checkInput()) {
        return
      }
      apiContest.modifyContest({
        id: this.contest_id,
        contest_name: this.contest_name,
        contest_desc: this.contest_desc,
        contest_start_time: this.contest_start_time.getTime(),
        contest_end_time: this.contest_end_time.getTime(),
        signup_start_time: this.signup_start_time.getTime(),
        signup_end_time: this.signup_end_time.getTime(),
      }).then(response => {
        response
        store.dispatch(storeConst.DISPATCH_SNACKBAR_SHOW, {
          text: "修改竞赛成功",
          color: colors.GREEN,
        })
      }).catch(err => {
        console.log(err)
      })
    },
    bindlabs: function () {
      this.$router.push({path: RouterPath.ADMIN_CONTEST_BIND_LABS, query: {contestId: this.contest_id, contestName: this.contest_name}})
    }
  },
  components: {
    quillEditor,
  },
  mounted() {
    this.contest_id = !isNaN(parseInt(this.$route.query.contestId)) ? parseInt(this.$route.query.contestId) : 0
    if (this.contest_id !== 0) {
      apiContest.getContestInfo({contest_id: this.contest_id}).then((item) => {
        this.contest_name = item.data.data.contest_info.contest_name
        this.contest_desc = item.data.data.contest_info.contest_desc
        this.contest_start_time = new Date(item.data.data.contest_info.contest_start_time)
        this.contest_end_time = new Date(item.data.data.contest_info.contest_end_time)
        this.signup_start_time = new Date(item.data.data.contest_info.signup_start_time)
        this.signup_end_time = new Date(item.data.data.contest_info.signup_end_time)
      }).catch()
    }
  }
}
</script>

<style scoped>
</style>