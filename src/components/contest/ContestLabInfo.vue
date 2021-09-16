<template>
  <v-container>
    <ContestInfoBar></ContestInfoBar>
    <LabInfo></LabInfo>
  </v-container>
</template>

<script>
import ContestInfoBar from "@/components/contest/ContestInfoBar";
import LabInfo from "@/components/lab/Info"
export default {
  name: "ContestLabInfo",
  components: {
    ContestInfoBar,
    LabInfo,
  }
}
</script>

<style scoped>

</style>