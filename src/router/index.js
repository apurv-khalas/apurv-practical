// Assuming this code is within your router setup file or imported into it
import { createRouter, createWebHistory } from 'vue-router';
import CreateBooking from '../components/CreateBooking.vue';
import UpdateBooking from '../components/UpdateBooking.vue';
import FetchBookingId from '../components/FetchBookingId.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: FetchBookingId
  },
  {
    path: '/create',
    name: 'CreateBooking',
    component: CreateBooking
  },
  {
    path: '/update/:id',
    name: 'UpdateBooking',
    component: UpdateBooking
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
