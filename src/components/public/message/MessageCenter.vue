<template>
  <v-container>
    <v-snackbar
        :timeout=timeout
        :value=snackbar
        :color=color
        :multi-line=true
    >
      {{text}}
    </v-snackbar>
  </v-container>
</template>

<script>
import {mapState} from 'vuex'
import {store, storeConst} from "@/store";

export default {
  name: "MessageCenter",
  data: () => ({
  }),
  computed: mapState({
    snackbar: state => state.message.snackbar.snackbar,
    text: state => state.message.snackbar.text,
    timeout: state => state.message.snackbar.timeout,
    color: state => state.message.snackbar.color,
    ws: state => state.message.ws,
  }),
  mounted() {
    store.dispatch(storeConst.DISPATCH_WS_CONN)
  },
  methods: {
  }
}
</script>

<style scoped>

</style>