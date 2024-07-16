<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between mb-3">
      <h2>
        Update Booking for ID: {{ bookingId }}
        <span v-if="dataFetched">data feching...</span>
      </h2>
      <button class="btn btn-sm btn-outline-primary me-1" @click="goBack">
        Go Back
      </button>
    </div>

    <form @submit.prevent="updateBooking">
      <div class="mb-3">
        <label for="firstname" class="form-label">First Name:</label>
        <input
          type="text"
          id="firstname"
          v-model="updateData.firstname"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="lastname" class="form-label">Last Name:</label>
        <input
          type="text"
          id="lastname"
          v-model="updateData.lastname"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="totalprice" class="form-label">Total Price:</label>
        <input
          type="number"
          id="totalprice"
          v-model="updateData.totalprice"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3 form-check">
        <input
          type="checkbox"
          id="depositpaid"
          v-model="updateData.depositpaid"
          class="form-check-input"
        />
        <label for="depositpaid" class="form-check-label">Deposit Paid</label>
      </div>
      <div class="mb-3">
        <label for="checkin" class="form-label">Check-in Date:</label>
        <input
          type="date"
          id="checkin"
          v-model="updateData.bookingdates.checkin"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="checkout" class="form-label">Check-out Date:</label>
        <input
          type="date"
          id="checkout"
          v-model="updateData.bookingdates.checkout"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="additionalneeds" class="form-label"
          >Additional Needs:</label
        >
        <input
          type="text"
          id="additionalneeds"
          v-model="updateData.additionalneeds"
          class="form-control"
        />
      </div>
      <button type="submit" class="btn btn-primary">Update Booking</button>
    </form>

    <div v-if="updatedBooking" class="mt-3">
      <h3>Booking Updated Successfully</h3>
      <pre>{{ updatedBooking }}</pre>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

const updateData = ref({
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
const dataFetched = ref(false);
const token = ref(null);
const router = useRouter();
const bookingId = ref(router.currentRoute.value.params.id);

onMounted(async () => {
  await fetchBookingDetails();
  await createToken();
});

const createToken = async () => {
  try {
    const response = await axios.post(
      "/api/auth",
      {
        username: "admin",
        password: "password123",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    token.value = response.data.token;
    sessionStorage.setItem("token", token.value);
    console.log("Token:", token.value);
  } catch (error) {
    console.error("Error creating token:", error);
  }
};

const updatedBooking = ref(null);

const goBack = () => {
  router.go(-1);
};

const fetchBookingDetails = async () => {
  dataFetched.value = true;
  try {
    const response = await axios.get(`/api/booking/${bookingId.value}`, {
      headers: {
        Accept: "application/json",
      },
    });
    const {
      firstname,
      lastname,
      totalprice,
      depositpaid,
      bookingdates,
      additionalneeds,
    } = response.data;
    updateData.value.firstname = firstname;
    updateData.value.lastname = lastname;
    updateData.value.totalprice = totalprice;
    updateData.value.depositpaid = depositpaid;
    updateData.value.bookingdates.checkin = bookingdates.checkin;
    updateData.value.bookingdates.checkout = bookingdates.checkout;
    updateData.value.additionalneeds = additionalneeds;
    if (response.data) {
      dataFetched.value = false;
    }
  } catch (error) {
    console.error("Error fetching booking details:", error);
    dataFetched.value = false;
  }
};

const updateBooking = async () => {
  token.value = sessionStorage.getItem("token");
  try {
    const response = await axios.put(
      `/api/booking/${bookingId.value}`,
      updateData.value,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Cookie: `token=${token.value}`,
          Authorization: `Basic YWRtaW46cGFzc3dvcmQxMjM=`,
        },
      }
    );
    updatedBooking.value = response.data;
    toast.success("Booking Updated Successfully");
    router.push("/");
  } catch (error) {
    console.error("Error updating booking:", error);
  }
};
</script>
