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
          class="lab_list_table"
          @click:row="clickTableRow"
      ></v-data-table>
      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount" :total-visible="7" @input="clickPagination"></v-pagination>
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
    this.getLabListByPage(this.page, this.itemsPerPage)
  },
  methods: {
    clickTableRow: function (value) {
      this.$router.push({path: RouterPath.LAB_INFO, query: {labId: value.id}})
    },
    clickPagination(page) {
      this.page = page
      this.getLabListByPage(this.page, this.itemsPerPage)
    },
    getLabListByPage(page, itemsPerPage) {
      apiLab.getLabList({
        page: page,
        page_size: itemsPerPage,
      }).then(response => {
        this.labList = response.data.data.LabList
        this.pageCount = Math.ceil(response.data.data.Count / itemsPerPage)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="css" scoped>
.lab_list_table >>> tbody tr :hover {
  cursor: pointer;
}
</style>