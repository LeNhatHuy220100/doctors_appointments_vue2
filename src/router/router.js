import Calendar from "../Pages/CalendarPage.vue";
import Doctors from "../Pages/DoctorsPage.vue";
import Router from "vue-router";
import Vue from "vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Doctors",
      component: Doctors,
    },
    {
      path: "/calendar/",
      name: "Calendar",
      component: Calendar,
      props: (route) => ({ id: route.query.id }),
    },
  ],
});
