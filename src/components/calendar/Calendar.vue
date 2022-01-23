<template>
  <v-row class="fill-height">
    <v-col>
      <State :tags="tags" :getTag="getTag" />
      <v-sheet height="600">
        <v-calendar
          color="#B2DFDB"
          type="week"
          ref="calendar"
          interval-height="100"
          @change="getEvents"
          :events="events"
          :now="today"
          :value="today"
          :v-model="value"
          :event-ripple="false"
          @mousedown:event="startDrag"
          @mousedown:time="startTime"
          @mousemove:time="mouseMove"
          @mouseup:time="endDrag"
          @mouseleave.native="cancelDrag"
        >
          <template v-slot:event="{ event, timed, eventSummary }">
            <div
              class="v-event-draggable"
              v-html="eventSummary()"
              style="color: white"
            ></div>
            <div
              v-if="timed"
              class="v-event-drag-bottom"
              @mousedown.stop="extendBottom(event)"
            ></div>
          </template>
        </v-calendar>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { ref, toRefs, watch } from "@vue/composition-api";
import State from "./State.vue";

export default {
  components: { State },
  props: ["doctor"],
  setup(props) {
    const { doctor } = toRefs(props);
    let value = ref("");
    let events = ref([]);
    let fullEvents = ref([]);
    const today = ref("2022-01-12");
    const dragEvent = ref(null);
    const dragTime = ref(null);
    const createEvent = ref(null);
    const createStart = ref(null);
    const extendOriginal = ref(null);
    const tags = ref(["All", "Passed", "Pending", "Approved"]);
    const currTag = ref("All");
    let changed_event = ref(null);

    const getTag = (tag) => {
      currTag.value = tag;
    };

    const getAppointmentByTag = (tag) => {
      return fullEvents.value.filter((e) => {
        if (e.status === tag) {
          return e;
        }
      });
    };

    watch(currTag, () => {
      let filteredAppointment = fullEvents.value;
      if (currTag.value.toLowerCase() !== "all") {
        filteredAppointment = getAppointmentByTag(currTag.value.toLowerCase());
      }
      events.value = filteredAppointment;
      console.log(filteredAppointment);
    });

    const getEvents = () => {
      let curr_events = [];
      for (let app of doctor.value.appoitment_calendar) {
        let newObj = {
          name: app.requester,
          start: Date.parse(app.start_time),
          end: Date.parse(app.end_time),
          color: app.color_code,
          status: app.status,
          timed: true,
          symptom: app.symptom,
          avatar: app.avatar,
          id: app.appointment_id,
        };
        curr_events.push(newObj);
      }
      events.value = curr_events;
      fullEvents.value = curr_events;
    };

    const toTime = function (tms) {
      return new Date(
        tms.year,
        tms.month - 1,
        tms.day,
        tms.hour,
        tms.minute
      ).getTime();
    };

    const roundTime = function (time, down = true) {
      const roundTo = 15; // minutes
      const roundDownTime = roundTo * 60 * 1000;
      return down
        ? time - (time % roundDownTime)
        : time + (roundDownTime - (time % roundDownTime));
    };

    const getEventColor = function (event) {
      const rgb = parseInt(event.color.substring(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      return event === dragEvent
        ? `rgba(${r}, ${g}, ${b}, 0.7)`
        : event === createEvent
        ? `rgba(${r}, ${g}, ${b}, 0.7)`
        : event.color;
    };

    const startDrag = function ({ event, timed }) {
      if (event && timed) {
        dragEvent.value = event;
        dragTime.value = null;
        extendOriginal.value = null;
      }
    };

    const startTime = function (tms) {
      const mouse = toTime(tms);
      if (dragEvent.value && dragTime.value === null) {
        const start = dragEvent.value.start;
        dragTime.value = mouse - start;
      }
    };

    const mouseMove = function (tms) {
      const mouse = toTime(tms);
      if (dragEvent.value && dragTime.value !== null) {
        const start = dragEvent.value.start;
        const end = dragEvent.value.end;
        const duration = end - start;
        const newStartTime = mouse - dragTime.value;
        const newStart = roundTime(newStartTime);
        const newEnd = newStart + duration;
        dragEvent.value.start = newStart;
        dragEvent.value.end = newEnd;

        changed_event = dragEvent.value;
      } else if (createEvent.value && createStart.value !== null) {
        const mouseRounded = roundTime(mouse, false);
        const min = Math.min(mouseRounded, createStart.value);
        const max = Math.max(mouseRounded, createStart.value);
        createEvent.value.start = min;
        createEvent.value.end = max;

        changed_event = createEvent.value;
      }
    };

    const endDrag = function () {
      dragTime.value = null;
      dragEvent.value = null;
      createEvent.value = null;
      createStart.value = null;
      extendOriginal.value = null;

      // console.log(changed_event);
      saveData(changed_event);
    };

    const cancelDrag = function () {
      if (createEvent.value) {
        if (extendOriginal.value) {
          createEvent.value.end = extendOriginal.value;
        } else {
          const i = events.indexOf(createEvent.value);
          if (i !== -1) {
            events.splice(i, 1);
          }
        }
      }
      createEvent.value = null;
      createStart.value = null;
      dragTime.value = null;
      dragEvent.value = null;

      // console.log(changed_event);
      saveData(changed_event);
    };

    const extendBottom = function (event) {
      createEvent.value = event;
      createStart.value = event.start;
      extendOriginal.value = event.end;
    };

    const saveData = (event) => {
      const doctors = JSON.parse(localStorage.getItem("doctors") || "");

      doctor.value.appoitment_calendar.forEach((app) => {
        if (app.appointment_id === event.id) {
          app.start_time = convertDateTime(new Date(event.start));
          app.end_time = convertDateTime(new Date(event.end));
        }
      });

      // console.log(doctor);

      doctors.forEach((doc) => {
        if (doc.doctor_id === doctor.value.doctor_id) {
          doc.appoitment_calendar = [...doctor.value.appoitment_calendar];
        }
      });

      localStorage.setItem("doctors", JSON.stringify(doctors));
    };

    const convertDateTime = (date) => {
      const convertedDate =
        date.getFullYear() +
        "-" +
        date.getMonth() +
        1 +
        "-" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds();
      return convertedDate;
    };

    return {
      today,
      getEvents,
      events,
      startDrag,
      startTime,
      mouseMove,
      endDrag,
      cancelDrag,
      getEventColor,
      extendBottom,
      value,
      tags,
      getTag,
    };
  },
};
</script>

<style scoped lang="scss">
.v-event-draggable {
  padding-left: 6px;
}
.v-event-timed {
  user-select: none;
  -webkit-user-select: none;
}
.v-event-drag-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  height: 4px;
  cursor: ns-resize;
  &::after {
    display: none;
    position: absolute;
    left: 50%;
    height: 4px;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    width: 16px;
    margin-left: -8px;
    opacity: 0.8;
    content: "";
  }
  &:hover::after {
    display: block;
  }
}
</style>
