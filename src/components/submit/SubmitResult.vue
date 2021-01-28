<template>
  <v-row justify="center" v-if="submit_result_item.id !== undefined">
    <v-dialog v-model="dialog" width="600px">
      <v-card>
        <v-card-title>
          <span class="headline"># {{submit_result_item.id}}</span>
          <v-spacer></v-spacer>
          <v-chip :color="submit_result_item.statusColor">{{submit_result_item.statusName}}</v-chip>
        </v-card-title>
        <v-container>
            <template v-for="(result, index) in submit_result_item.resultList">
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
export default {
  name: "submit_result",
  data: () => ({
    dialog: false,
  }),
  props: ['submit_result'],
  computed: {
    submit_result_item() {
      return this.submit_result
    }
  },
  watch: {
    // https://juejin.cn/post/6844903860574617614
    submit_result_item: {
      handler(newVal) {
        if (newVal.id !== undefined && newVal.id !== 0) {
          this.dialog = true
        }
      },
      immediate: true,
    }
  }
}
</script>

<style scoped>

</style>