import Vue from "vue";

import VueCtkDateTimePicker from "vue-ctk-date-time-picker";
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css";
import VueFullCalendar from "vue-full-calendar";
import "fullcalendar/dist/fullcalendar.min.css"
Vue.component("VueCtkDateTimePicker", VueCtkDateTimePicker);
Vue.use(VueFullCalendar);
