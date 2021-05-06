<template>
  <v-container>
    <v-toolbar-title class="grey--text text--darken-4 ma-2">竞赛{{this.contest_name}}绑定的实验室列表
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
              medium
              v-bind="attrs"
              v-on="on"
          >
            mdi-help-circle-outline
          </v-icon>
        </template>
        <span>可拖拽排序</span>
      </v-tooltip>
    </v-toolbar-title>

    <draggable v-model="contest_labs">
      <transition-group>
        <div v-for="element in contest_labs" :key="element.id">
          <v-list>
            <v-list-item>
              <v-list-item-title>{{element.name}}</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
          </v-list>
        </div>
      </transition-group>
    </draggable>
  </v-container>
</template>

<script>
import {apiContest} from "@/api";
import draggable from 'vuedraggable'

export default {
  name: "ContestBind",
  data: () => ({
    contest_id: 0,
    contest_name: "",
    contest_labs: [
      {
        id: 1,
        name: "test",
      },
      {
        id: 2,
        name: "test2",
      },
      {
        id: 3,
        name: "test4",
      }

    ]
  }),
  methods: {

  },
  components: {
    draggable
  },
  mounted() {
    this.contest_id = !isNaN(parseInt(this.$route.query.contestId)) ? parseInt(this.$route.query.contestId) : 0
    this.contest_name = this.$route.query.contestName
    if (this.contest_id !== 0) {
      apiContest.getContestBind({contest_id: this.contest_id}).then((item) => {
        console.log(item)
      }).catch()
    }
  },
}
</script>

<style scoped>

</style>