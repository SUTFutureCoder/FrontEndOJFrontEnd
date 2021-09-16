<template>
  <v-container>
    <ContestInfoBar></ContestInfoBar>

  </v-container>
</template>

<script>
import {apiContest} from "@/api";
import ContestInfoBar from "@/components/contest/ContestInfoBar";

export default {
  name: "ContestDashboard",
  data: () => ({
    contest_id: 0,
  }),
  mounted() {
    this.contest_id = parseInt(this.$route.query.contestId, 10)
    // 获取比赛dashboard
    apiContest.getContestDashboard({contest_id: this.contest_id}).then((item) => {
      console.log(item)
    }).catch(err => {
      console.log(err)
    })
    // 获取比赛绑定实验室列表

  },
  components: {
    ContestInfoBar,
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