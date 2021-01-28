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
        <v-pagination v-model="page" :length="pageCount" :total-visible="7" @click="clickPagination(num)"></v-pagination>
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
    itemsPerPage: 2,
    pageCount: 1,
  }),
  mounted() {
    this.page = !isNaN(parseInt(this.$route.query.page)) ? parseInt(this.$route.query.page) : 1
    apiLab.getLabList({
      page: this.page,
      pageSize: this.itemsPerPage,
    }).then(response => {
      console.log(response)
      this.labList = response.data.data.LabList
      this.pageCount = response.data.data.Count
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    clickTableRow: function (value) {
      this.$router.push({path: RouterPath.LAB_INFO, query: {labId: value.id}})
    },
    clickPagination: function (value) {
      console.log(value)
    }
  }
}
</script>

<style scoped>

</style>