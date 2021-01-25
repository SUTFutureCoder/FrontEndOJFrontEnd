<template>
    <v-container>
      <v-card-title>
        实验室列表
      </v-card-title>
      <v-data-table
          :headers="headers"
          :items="labList"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          hide-default-footer
          class="elevation-1"
          @page-count="pageCount = $event"
          @click:row="clickTableRow"
      ></v-data-table>
      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </v-container>

</template>

<script>
import * as RouterPath from "@/constants/router_path";
import {apiLab} from "@/api";

export default {
  name: "list",
  data: () => ({
    labList: [],
    headers: [
      {
        text: 'id',
        align: 'start',
        sortable: false,
        value: 'id',
      },
      {
        text: '实验室名称',
        sortable: false,
        value: 'lab_name',
      }
    ],
    page: 1,
    itemsPerPage: 20,
    pageCount: 0,
  }),
  mounted() {
    this.page = parseInt(this.$route.query.page)
    apiLab.getLabList({
      page: this.page,
      pageSize: 20,
    }).then(response => {
      this.labList = response.data['data'].LabList
      this.pageCount = response.data['data'].Count
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    clickTableRow: function (value) {
      this.$router.push({path: RouterPath.LAB_INFO, query: {labId: value.id}})
    }
  }
}
</script>

<style scoped>

</style>