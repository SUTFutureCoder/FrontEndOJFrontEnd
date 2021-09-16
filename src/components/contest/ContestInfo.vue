<template>
  <v-container>
    <ContestInfoBar></ContestInfoBar>
    <LabList :contestMode="true" :contestId="contest_id" :contestLabIds="contest_lab_ids" :showTitle="false"></LabList>
  </v-container>
</template>

<script>
import LabList from '@/components/public/lab/LabList'
import ContestInfoBar from "@/components/contest/ContestInfoBar";
import {apiContest} from "@/api";
export default {
  name: "ContestInfo",
  data: () => ({
    contest_id: 0,
    contest_name: "",
    contest_desc: "",
    contest_start_time: "",
    contest_end_time: "",
    origin_contest_end_time: 0,

    contest_lab_ids: [],
  }),
  mounted() {
    this.contest_id = parseInt(this.$route.query.contestId, 10)
    // 获取比赛基础信息
    apiContest.getContestInfo({contest_id: this.contest_id}).then((item) => {
      this.contest_name = item.data.data.contest_info.contest_name
      this.contest_desc = item.data.data.contest_info.contest_desc
      this.contest_start_time = new Date(item.data.data.contest_info.contest_start_time)
      this.contest_end_time = new Date(item.data.data.contest_info.contest_end_time)
      this.origin_contest_end_time = item.data.data.contest_info.contest_end_time

      this.contest_lab_ids = item.data.data.lab_list_ids
    }).catch(err => {
      console.log(err)
    })
    // 获取比赛绑定实验室列表

  },
  components: {
    ContestInfoBar,
    LabList,
  },
  props: {
    // 竞赛id
    contestId: {
      type: Number,
    },
  }
}
</script>

<style scoped>
</style>