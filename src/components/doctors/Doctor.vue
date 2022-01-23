<template>
  <div>
    <v-card width="300" class="card" elevation="5">
      <v-card-title>{{ doctor.doctor_name }}</v-card-title>
      <router-link
        style="text-decoration: none"
        :to="{ path: '/calendar', query: { id: doctor.doctor_id } }"
      >
        <v-btn depressed color="success">Xem chi tiết</v-btn>
      </router-link>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["doctor"],
};
</script>

<style scoped>
.card {
  padding: 15px;
}
</style>
