<template>
  <div class="doctors">
    <Doctor
      v-for="doctor in doctors"
      :key="doctor.doctor_id"
      :doctor="doctor"
    />
  </div>
</template>

<script>
import Doctor from "./Doctor.vue";
export default {
  components: { Doctor },
  props: ["doctors"],
};
</script>

<style scoped>
.doctors {
  display: flex;
  justify-content: flex-start;
  gap: 15px;
  padding-top: 10px;
  padding-left: 10px;
}
</style>
