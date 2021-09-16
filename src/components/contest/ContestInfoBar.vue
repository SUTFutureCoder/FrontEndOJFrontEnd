<template>
  <v-container>
    <v-card
        id="contest_info_card"
        flat
        tile
    >
      <v-toolbar
          floating
      >
        <v-row
            align="center"
            justify="space-around"
        >
          <v-btn depressed v-if="contest_ac_lab_ids.length !== contest_lab_ids.length" @click="jumpToContest()">
            AC {{contest_ac_lab_ids.length}} / {{contest_lab_ids.length}}
          </v-btn>
          <v-btn depressed :color="colors.RED" v-if="contest_lab_ids.length !== 0 && contest_ac_lab_ids.length === contest_lab_ids.length"  @click="jumpToContest()">
            AK! Congrats! {{contest_ac_lab_ids.length}} / {{contest_lab_ids.length}}
          </v-btn>

          <v-text-field
              class="ml-1"
              hide-details
              outlined
              readonly
              :value=this.left_contest_end_time
          ></v-text-field>

          <v-btn depressed class="ml-1" @click="jumpToDashBoard()">
            DASHBOARD
          </v-btn>
        </v-row>
      </v-toolbar>
    </v-card>
  </v-container>
</template>

<script>
import {apiContest} from "@/api";
import * as colors from "@/constants/color";
import * as RouterPath from "@/constants/router_path";

export default {
  name: "ContestInfoBar",
  data: () => ({
    contest_id: 0,
    contest_end_time: new Date(),
    left_contest_end_time: "",
    contest_lab_ids: [],
    contest_ac_lab_ids: [],

    colors: colors,
  }),
  methods: {
    endTimeInterval: function () {
      let sec = parseInt((this.contest_end_time.getTime() - new Date().getTime()) / 1000)
      this.left_contest_end_time = this.changetime(sec)
    },
    jumpToContest: function () {
      this.$router.push({path: RouterPath.CONTEST_INFO, query: {contestId: this.contest_id}})
    },
    jumpToDashBoard: function () {
      this.$router.push({path: RouterPath.CONTEST_DASHBOARD, query: {contestId: this.contest_id}})
    },
    changetime: function (value) {
      let neg = false
      if (value < 0) {
        neg = true
      }
      let secondTime = Math.abs(parseInt(value));// 秒
      let minuteTime = 0;// 分
      let hourTime = 0;// 小时
      if (secondTime > 60) {//如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if(minuteTime > 60) {
          //获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60);
          //获取小时后取佘的分，获取分钟除以60取佘的分
          minuteTime = parseInt(minuteTime % 60);
        }
      }
      var time = "" + parseInt(secondTime) + "秒";

      if(minuteTime > 0) {
        time = "" + parseInt(minuteTime) + "分" + time;
      }
      if(hourTime > 0) {
        time = "" + parseInt(hourTime) + "小时" + time;
      }
      if (neg) {
        return "-" + time;
      }
      return time;
    }
  },
  components: {
  },
  mounted() {
    this.contest_id = parseInt(this.$route.query.contestId, 10)
    // 获取比赛基础信息
    apiContest.getContestInfo({contest_id: this.contest_id}).then((item) => {
      this.contest_end_time = new Date(item.data.data.contest_info.contest_end_time)
      if (item.data.data.lab_list_ids !== null) {
        this.contest_lab_ids = item.data.data.lab_list_ids
        return
      }
      this.contest_lab_ids = []
      this.endTimeInterval()
    }).catch(err => {
      console.log(err)
    })
    // 获取用户ac信息
    apiContest.getUserContestAcLabids({contest_id: this.contest_id}).then((item) => {
      if (item.data.data.ac_lab_ids !== null) {
        this.contest_ac_lab_ids = item.data.data.ac_lab_ids
        return
      }
      this.contest_ac_lab_ids = []
    }).catch(err => {
      console.log(err)
    })
    // 设置定时
    setInterval(this.endTimeInterval, 1000)
  }
}
</script>

<style scoped>
#contest_info_card {
  position: fixed;
  top: 0;
  transform: translateX(50%);
  z-index: 5;
}
</style>