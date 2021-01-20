<template>
  <v-container>
    <v-snackbar
        :timeout=timeout
        :value=snackbar
        :color=color
        absolute
    >
      {{text}}
    </v-snackbar>
  </v-container>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: "MessageCenter",
  computed: mapState({
    snackbar: state => state.message.snackbar.snackbar,
    text: state => state.message.snackbar.text,
    timeout: state => state.message.snackbar.timeout,
    color: state => state.message.snackbar.color,
  })
}
</script>

<style scoped>

</style>