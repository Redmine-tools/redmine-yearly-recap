import Api from '@/services/Api'

// TODO: beégetett dátumok kivezetése `.env`-be
export default {
  getUser(apiKey) {
    return Api().get("users/current.json",
        this.getConfigWithApiKey(apiKey))
  },
  getIssues(apiKey, issueId) {
    return Api().get(`issues.json?issue_id=${issueId}`,
        this.getConfigWithApiKey(apiKey))
  },
  getAllUpdatedIssues(apiKey, offset) {
    return Api().get(`issues.json?updated_by=me&updated_on=><2021-01-01|2021-12-31&limit=100&status_id=*&offset=${offset}`,
        this.getConfigWithApiKey(apiKey))
  },
  getAllTimeEntries(apiKey, offset) {
    return Api().get(`time_entries.json?user_id=me&limit=100&from=2021-01-01&to=2021-12-31&offset=${offset}`,
        this.getConfigWithApiKey(apiKey))
  },
  getRedmineUrl() {
    return Api().get("redmine_url")
  },
  getConfigWithApiKey: function (apiKey) {
    return {
      headers: {
        'X-Redmine-API-Key': apiKey
      }
    }
  },
  getUserByPassword(user) {
    return Api().post('login', user)
  }
}
