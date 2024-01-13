import axios from 'axios'

const proxy = axios.create({
  // cors proxy url
  baseURL: process.env.VUE_APP_BACKEND_URL || "http://localhost:3000/api"
});

const feedbackService = axios.create({
  // cors feedback url
  baseURL: process.env.VUE_APP_FEEDBACK_URL || "http://localhost:3001/feedback"
});


export { proxy, feedbackService };
