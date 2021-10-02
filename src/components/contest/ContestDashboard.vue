<template>
  <v-container>
    <ContestInfoBar></ContestInfoBar>
    <v-simple-table
        fixed-header
        height="300px"
    >
      <template v-slot:default>
        <thead>
        <tr>
          <th class="text-left">
            Rank
          </th>
          <th class="text-left">
            User
          </th>
          <th class="text-left" v-for="(contest_id, k) in contest_lab_ids" :key="contest_id">
            {{String.fromCharCode(65 + k)}}
          </th>
          <th class="text-left">
            Penal
          </th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(rank_data_v, user) in rank_data"
            :key="user"
        >
          <td>{{ rank_data_v.i }}</td>
          <td>{{ user_id_map[user] }}</td>
          <td class="text-left" v-for="(contest_id) in contest_lab_ids" :key="contest_id">
            {{ rank_data_v[contest_id] === undefined ? "f" : rank_data_v[contest_id].is_ac}}
          </td>
          <td>{{ user_time_sum !== undefined && user_time_sum[user] !== undefined ? user_time_sum[user] : 0}}</td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-container>
</template>

<script>
import {apiContest} from "@/api";
import ContestInfoBar from "@/components/contest/ContestInfoBar";

export default {
  name: "ContestDashboard",
  data: () => ({
    contest_id: 0,
    contest_lab_ids: [],
    rank_data: {},
    user_ac: {},
    user_id_map: {},
    user_time_sum: {},
  }),
  mounted() {
    this.contest_id = parseInt(this.$route.query.contestId, 10)
    // 获取比赛dashboard
    apiContest.getContestDashboard({contest_id: this.contest_id}).then((item) => {
      this.rank_data = item.data.data.rank_data
      this.user_ac = item.data.data.user_ac
      this.user_id_map = item.data.data.user_id_map
      this.user_time_sum = item.data.data.user_time_sum
      // resort
      this.resort()
    }).catch(err => {
      console.log(err)
    })
    // 获取比赛绑定实验室列表
    apiContest.getContestInfo({contest_id: this.contest_id}).then((item) => {
      this.contest_lab_ids = item.data.data.lab_list_ids
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    resort: function () {
      let currentI = 0
      for (let k in this.rank_data) {
        this.rank_data[k].i = ++currentI
        // this.user_ac[] =
      }

      console.log(this.rank_data)
    }
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