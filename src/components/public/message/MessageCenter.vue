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

export default {
  name: "MessageCenter",
  data: () => ({
    ws: null,
  }),
  computed: mapState({
    snackbar: state => state.message.snackbar.snackbar,
    text: state => state.message.snackbar.text,
    timeout: state => state.message.snackbar.timeout,
    color: state => state.message.snackbar.color,
  }),
  mounted() {
    this.initWs()
  },
  methods: {
    initWs() {
      this.ws = new WebSocket('ws://localhost:8086/ws'),
          this.ws.onopen = () => {
            console.log('connection open')
          }
      this.ws.onmessage = (evt) => {
        console.log(evt)
      }
      this.ws.onclose = () => {
        console.log('connection close')
      }
    }
  }


}
</script>

<style scoped>

</style>