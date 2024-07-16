<template>
  <div>
    <div class="container mt-4">
      <div class="d-flex justify-content-between mb-3">
        <h2>Create Booking</h2>
        <button class="btn btn-sm btn-outline-primary me-1" @click="goBack">
          Go Back
        </button>
      </div>
      <form @submit.prevent="createBooking" class="needs-validation" novalidate>
        <div class="mb-3">
          <label for="firstname" class="form-label">First Name:</label>
          <input
            type="text"
            id="firstname"
            class="form-control"
            v-model="newBooking.firstname"
            required
          />
          <div class="invalid-feedback">First Name is required.</div>
        </div>

        <div class="mb-3">
          <label for="lastname" class="form-label">Last Name:</label>
          <input
            type="text"
            id="lastname"
            class="form-control"
            v-model="newBooking.lastname"
            required
          />
          <div class="invalid-feedback">Last Name is required.</div>
        </div>

        <div class="mb-3">
          <label for="totalprice" class="form-label">Total Price:</label>
          <input
            type="number"
            id="totalprice"
            class="form-control"
            v-model="newBooking.totalprice"
            required
          />
          <div class="invalid-feedback">Total Price is required.</div>
        </div>

        <div class="mb-3 form-check">
          <input
            type="checkbox"
            id="depositpaid"
            class="form-check-input"
            v-model="newBooking.depositpaid"
          />
          <label for="depositpaid" class="form-check-label">Deposit Paid</label>
        </div>

        <div class="mb-3">
          <label for="checkin" class="form-label">Check-in Date:</label>
          <input
            type="date"
            id="checkin"
            class="form-control"
            v-model="newBooking.bookingdates.checkin"
            required
          />
          <div class="invalid-feedback">Check-in Date is required.</div>
        </div>

        <div class="mb-3">
          <label for="checkout" class="form-label">Check-out Date:</label>
          <input
            type="date"
            id="checkout"
            class="form-control"
            v-model="newBooking.bookingdates.checkout"
            required
          />
          <div class="invalid-feedback">Check-out Date is required.</div>
        </div>

        <div class="mb-3">
          <label for="additionalneeds" class="form-label"
            >Additional Needs:</label
          >
          <input
            type="text"
            id="additionalneeds"
            class="form-control"
            v-model="newBooking.additionalneeds"
          />
        </div>

        <button type="submit" class="btn btn-primary">Create Booking</button>
      </form>
    </div>
    <div v-if="createdBooking">
      <h3>Booking Created Successfully</h3>
      <p>Booking ID: {{ createdBooking.bookingid }}</p>
      <pre>{{ createdBooking.booking }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

const newBooking = ref({
  firstname: "",
  lastname: "",
  totalprice: 0,
  depositpaid: false,
  bookingdates: {
    checkin: "",
    checkout: "",
  },
  additionalneeds: "",
});

const createdBooking = ref(null);
const router = useRouter();

const goBack = () => {
  router.go(-1);
};

const createBooking = async () => {
  try {
    const response = await axios.post("/api/booking", newBooking.value, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    toast.success("Booking Created Successfully");
    createdBooking.value = response.data;
    router.push("/");
  } catch (error) {
    console.error("Error creating booking:", error);
  }
};
</script>
