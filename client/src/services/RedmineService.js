import { proxy } from "@/services/Api";

export default {
  getUser(apiKey) {
    return proxy.get("users/current.json", this.getConfigWithApiKey(apiKey));
  },
  getIssues(apiKey, issueId) {
    return proxy.get(
      `issues.json?issue_id=${issueId}`,
      this.getConfigWithApiKey(apiKey)
    );
  },
  getAllUpdatedIssues(apiKey, offset) {
    return proxy.get(
      `issues.json?updated_by=me&updated_on=><${process.env.VUE_APP_YEAR}-01-01|${process.env.VUE_APP_YEAR}-12-31&limit=100&status_id=*&offset=${offset}`,
      this.getConfigWithApiKey(apiKey)
    );
  },
  getAllTimeEntries(apiKey, offset, year) {
    return proxy.get(
      `time_entries.json?user_id=me&limit=100&from=${year}-01-01&to=${year}-12-31&offset=${offset}`,
      this.getConfigWithApiKey(apiKey)
    );
  },
  getRedmineUrl() {
    return proxy.get("redmine_url");
  },
  getConfigWithApiKey: function(apiKey) {
    return {
      headers: {
        "X-Redmine-API-Key": apiKey
      }
    };
  },
  getUserByPassword(user) {
    return proxy.post("login", user);
  }
};
