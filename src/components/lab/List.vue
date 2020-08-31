<template>
    <v-container>
      <li v-for="(lab, index) of labList" :key="index">
        {{lab}}
      </li>
    </v-container>

</template>

<script>
import axios from "axios";
import * as config from "@/constants/config";
import * as api from "@/constants/api";
import qs from "qs";

export default {
  name: "list",
  data: () => ({
    labList: [],
  }),
  mounted() {
    axios.post(
        config.BASE_BACKEND + api.LAB_LIST, qs.stringify({
          page: 1,
          pageSize: 20,
        })
    ).then(response => {
      console.log(response.data['data'])
      this.labList = response.data['data']
    }).catch(err => {
      console.log(err)
    })
  },
}
</script>

<style scoped>

</style>