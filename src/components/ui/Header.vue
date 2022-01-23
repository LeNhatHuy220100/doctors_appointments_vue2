<template>
  <div class="header">
    <v-btn v-if="doctorId" @click="$router.push('/')" small>
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <p>{{ title }}</p>
  </div>
</template>

<script>
export default {
  props: ["title", "doctorId"],
};
</script>

<style scoped>
.header {
  background-color: rgb(67, 196, 153);
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  /* align-items: center; */
}

.header p {
  color: white;
  font-size: 18px;
  font-weight: bold;
}
</style>
