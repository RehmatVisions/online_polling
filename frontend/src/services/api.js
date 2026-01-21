import axios from "axios";

/* =========================
   AXIOS INSTANCE
========================= */
const API = axios.create({
  baseURL: "http://localhost:3000", // backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   AUTH APIS
========================= */

// Signup
export const signupUser = (data) => {
  return API.post("/api/auth/signup", data);
};

// Login
export const loginUser = async (data) => {
  const res = await API.post("/api/auth/login", data);

  // save token
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }

  return res;
};

/* =========================
   POLL APIS
========================= */

// Create poll
export const createPoll = (pollData) => {
  const token = localStorage.getItem("token");

  return API.post("/api/polls", pollData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get all polls
export const getPolls = () => {
  return API.get("/api/polls");
};

// Vote on poll
export const votePoll = (pollId, optionId) => {
  const token = localStorage.getItem("token");

  return API.post(
    `/api/polls/${pollId}/vote`,
    { optionId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export default API;
