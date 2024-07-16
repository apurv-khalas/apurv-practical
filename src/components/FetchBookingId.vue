<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between mb-3">
      <h2>Bookings List First (20 records)</h2>

      <button
        class="btn btn-sm btn-outline-primary me-1"
        @click="createBooking"
      >
        Create Booking
      </button>
    </div>

    <div v-if="loading">Loading...</div>

    <div v-else>
      <ul class="list-group mb-3">
        <li
          class="list-group-item d-flex justify-content-between align-items-center"
          v-for="booking in bookings"
          :key="booking.bookingid"
        >
          Booking ID: {{ booking.bookingid }}
          <span>
            <button
              @click="editBooking(booking.bookingid)"
              class="btn btn-sm btn-outline-primary me-1"
            >
              <i class="bi bi-pencil"></i> Edit
            </button>
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#confirmDeleteModal"
              @click="confirmDelete(booking.bookingid)"
              class="btn btn-sm btn-outline-danger"
            >
              <i class="bi bi-trash"></i> Delete
            </button>
          </span>
        </li>
      </ul>

      <!-- Delete Modal -->
      <div
        class="modal fade"
        id="confirmDeleteModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="confirmDeleteModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">
                Delete Booking  <span v-if="deleteStatus">deleting...</span>
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              Are you sure you want to delete this booking?
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="deleteBookingConfirmed"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

const bookings = ref([]);
const router = useRouter();
const loading = ref(true);
const deleteStatus = ref(false);
let bookingToDelete = null;



const fetchBookingId = async () => {
  try {
    const response = await axios.get("/api/booking");
    bookings.value = response.data.slice(0, 20);
    loading.value = false;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchBookingId();
});

const editBooking = (bookingId) => {
  router.push(`/update/${bookingId}`);
};

const confirmDelete = (bookingId) => {
  bookingToDelete = bookingId;
};

const createBooking = () => {
  router.push({ name: "CreateBooking" });
};

const deleteBookingConfirmed = async () => {
    deleteStatus.value = true;
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.delete(`/api/booking/${bookingToDelete}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic YWRtaW46cGFzc3dvcmQxMjM=`,
        Cookie: `token=${token}`,
      },
    });
    if (response) {
      bookingToDelete = null;
      await fetchBookingId();
      deleteStatus.value = false;
      const modalBackdrop =
      document.getElementsByClassName("modal-backdrop")[0];
      const hide = document.getElementsByClassName("modal")[0];
      hide.classList.remove("show");
      modalBackdrop.classList.remove("show");
      toast.success("Booking deleted successfully");
    }
} catch (error) {
    console.error("Error deleting booking:", error);
  }
};
</script>

<style scoped>
/* Your scoped styles here */
</style>
