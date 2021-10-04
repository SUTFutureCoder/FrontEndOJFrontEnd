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
            v-for="v in rank_data_sorted"
            :key="v.user"
        >
          <td>{{ v.rank }}</td>
          <td>{{ user_id_map[v.user] }}</td>
          <td class="text-left" v-for="(contest_id) in contest_lab_ids" :key="contest_id" :bgcolor="v.submit_ret[contest_id].table_color">
            {{v.submit_ret[contest_id].submit_times}}
          </td>
          <td>{{ user_time_sum !== undefined && user_time_sum[v.user] !== undefined ? user_time_sum[v.user] : 0}}</td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-container>
</template>

<script>
import {apiContest} from "@/api";
import ContestInfoBar from "@/components/contest/ContestInfoBar";
import * as Colors from "@/constants/color"

export default {
  name: "ContestDashboard",
  data: () => ({
    contest_id: 0,
    contest_lab_ids: [],
    rank_data: {},
    rank_data_sorted: [],
    user_ac: {},
    user_id_map: {},
    user_time_sum: {},
    rank_penal_calc: [],

    colors: Colors,
  }),
  mounted() {
    this.contest_id = parseInt(this.$route.query.contestId, 10)
    // 获取比赛dashboard
    // 获取比赛绑定实验室列表
    apiContest.getContestInfo({contest_id: this.contest_id}).then((item) => {
      this.contest_lab_ids = item.data.data.lab_list_ids
      apiContest.getContestDashboard({contest_id: this.contest_id}).then((item) => {
        this.rank_data = item.data.data.rank_data
        this.user_ac = item.data.data.user_ac
        this.user_id_map = item.data.data.user_id_map
        this.user_time_sum = item.data.data.user_time_sum
        // resort
        this.prepareSort()
        this.resort()
      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    prepareSort: function () {
      for (let u in this.rank_data) {
        let rank_penal_calc_tmp = {
          uid: u,
          penal_time: 0,
        }
        for (let cidk in this.contest_lab_ids) {
          let cid = this.contest_lab_ids[cidk]
          if (this.rank_data[u][cid] === undefined) {
            this.rank_data[u][cid] = {
              is_ac: false,
              submit_times: 0,
              time_sum: 0,
              table_color: "",
            }
          }
          if (this.rank_data[u][cid].is_ac) {
            this.rank_data[u][cid].table_color = this.colors.GREEN
            rank_penal_calc_tmp.penal_time += 1000000
          }
          rank_penal_calc_tmp.penal_time -= this.rank_data[u][cid].time_sum
        }
        this.rank_penal_calc.push(rank_penal_calc_tmp)
      }
    },
    resort: function () {
      this.rank_penal_calc.sort(function(m,n){
        let a = m.penal_time;
        let b = n.penal_time;
        return b - a; //升序
      })
      for (let k in this.rank_penal_calc) {
        let u = this.rank_penal_calc[k].uid
        this.rank_data_sorted.push({
          user: u,
          rank: parseInt(k, 10) + 1,
          submit_ret : this.rank_data[u],
        })
      }
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