<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" width="600px">
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
import EventBus from "@/assets/EventBus";
import * as EventBusConst from "@/assets/EventBus"
import * as LabSubmitUtils from "@/utils/LabSubmitUtils"

export default {
  name: "submit_result",
  data: () => ({
    submitItem: {},
    resultList: [],
    dialog: false,
  }),
  methods: {
  },
  mounted() {
    let vue = this
    EventBus.$on(EventBusConst.SHOW_SUBMIT_RESULT_EVENT, function (item) {
      vue.submitItem = item
      vue.dialog = true
      vue.resultList = LabSubmitUtils.parseSubmitResult(item.submit_result)
      console.log(vue.submitItem)
    })
  }

}
</script>

<style scoped>

</style>