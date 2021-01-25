<template>
  <v-row justify="center" v-if="dialog !== undefined">
    <v-dialog v-model="dialog" width="600px" @click:outside="close">
      <v-card>
        <v-card-title>
          <span class="headline"># {{submitItem.id}}</span>
          <v-spacer></v-spacer>
          <v-chip :color="submitItem.statusColor">{{submitItem.statusName}}</v-chip>
        </v-card-title>
        <v-container>
            <template v-for="(result, index) in resultList">
              <v-hover v-slot:default="{ hover }" :key="index">
                <v-card
                    :elevation="hover ? 12 : 2"
                    :class="{ 'on-hover': hover }"
                    min-height="50px"
                    class="ma-3"
                    :color="result.statusColor"
                    dark
                >
                  <v-card-title class="headline">
                    <span>TestCase: {{result.TestCaseId}}</span>
                    <v-spacer></v-spacer>
                    <span>{{result.statusName}}</span>
                  </v-card-title>

                  <v-card-subtitle>{{result.Err}}</v-card-subtitle>

                </v-card>
              </v-hover>

            </template>

        </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import {mapState} from "vuex"

export default {
  name: "submit_result",
  computed: mapState({
    submitItem: state => state.submit_result.submit_result.submitItem,
    resultList: state => state.submit_result.submit_result.resultList,
    dialog: state => state.submit_result.submit_result.dialog,
  }),
  methods: {
    close: () => {
      console.log("closed")
    }
  }
}
</script>

<style scoped>

</style>