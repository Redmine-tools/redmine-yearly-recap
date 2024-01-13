import { feedbackService } from "@/services/Api";

console.log(feedbackService);

export default {
  sendFeedback(feedback) {
    return feedbackService.post("/", feedback);
  },
  getFeedback() {
    return feedbackService.get("/");
  },
  checkFeedback(id) {
    return feedbackService.get(`${id}`);
  }
}
