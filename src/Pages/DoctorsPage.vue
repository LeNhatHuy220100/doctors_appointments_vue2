<template>
  <div id="doctors">
    <Header :title="`Danh Sách Bác Sĩ`" />
    <Doctors :doctors="doctors" />

    <!-- <CalendarList :appointments="calendarDataByDate" /> -->
    <!-- <CalendarVuetify /> -->
  </div>
</template>

<script lang="ts">
import Header from "../components/ui/Header.vue";
import Doctors from "../components/doctors/Doctors.vue";
import { ref, onMounted } from "@vue/composition-api";
import axios from "axios";

export default {
  components: { Header, Doctors },
  setup() {
    const doctors = ref(null);

    let data = JSON.parse(localStorage.getItem("doctors"));

    onMounted(() => {
      if (data) {
        doctors.value = data;
      } else {
        axios
          .get(
            "https://my-json-server.typicode.com/pqcuong737/jsonfakeserver/data"
          )
          .then((response) => {
            localStorage.setItem("doctors", JSON.stringify(response.data));
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });

    return { doctors };
  },
};
</script>

<style scoped></style>
