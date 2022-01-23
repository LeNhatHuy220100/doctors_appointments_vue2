<template>
  <div id="calendar">
    <Header :title="`Lịch Khám`" :doctorId="$route.query.id" />
    <Calendar :doctor="getDoctor($route.query.id)" />
  </div>
</template>

<script>
import Header from "../components/ui/Header.vue";
import Calendar from "../components/calendar/Calendar.vue";

export default {
  components: {
    Header,
    Calendar,
  },
  setup() {
    const getDoctor = (id) => {
      const doctor_id = id;
      const doctors = JSON.parse(localStorage.getItem("doctors") || "");
      const doctor = doctors.find((doc) => doc.doctor_id === Number(doctor_id));
      return doctor;
    };
    return { getDoctor };
  },
};
</script>

<style scoped></style>
