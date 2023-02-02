import { createApp } from 'vue'
import router from "@/router";
import store from "@/store";
import App from './App.vue'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'

const app = createApp(App)
app.use(router);
app.use(store);
app.use(Quasar, quasarUserOptions)
app.mount('#app')
