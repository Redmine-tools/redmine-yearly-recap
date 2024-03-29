<template>
  <div class="login-page">
    <section class="login-container">
      <div class="img-container">
        <img
          class="login-company-logo"
          src="@/assets/logo.svg"
          alt="company-logo"
        >
      </div>
      <h1>Éves összefoglaló</h1>
      <form
        class="form-control"
        @submit.prevent="getUser"
      >
        <div class="input-container">
          <p class="info">
            Apikulcs
            <button
              type="button"
              class="as-link"
              @click="getAPILink"
            >
              API kulcs
            </button>
          </p>
          <q-input
            id="api-token"
            v-model="apiKey"
            outlined
            label="API kulcs"
            name="api-token"
            :type="isApiKey ? 'password' : 'text'"
          >
            <template #append>
              <q-icon
                :name="isApiKey ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isApiKey = !isApiKey"
              />
            </template>
          </q-input>
          <q-btn
            type="submit"
            class="action"
          >
            Bejelentkezés
          </q-btn>
        </div>
      </form>
      <div
        id="errorToast"
        :class="{ active: isActive }"
        class="toast"
      >
        Sikertelen bejelentkezés
      </div>
    </section>
  </div>
</template>

<script>
import { ref } from 'vue';
import RedmineService from '@/services/RedmineService';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const apiKey = ref('');
    const username = ref('');
    const password = ref('');
    const user = ref('');
    const isActive = ref(false);
    const isPwd = ref(true);
    const isApiKey = ref(true);
    const store = useStore();

    function setActiveToFalse() {
      isActive.value = false;
    }

    async function getUser() {
      try {
        if (username.value && password.value) {
          const response = await RedmineService.getUserByPassword({
            username: username.value,
            password: password.value,
          });
          user.value = response.data;
          store.commit({
            type: 'addUser',
            payload: response.data.user,
          });
          router.push('/review');
        } else {
          const response = (await RedmineService.getUser(apiKey.value));
          user.value = response.data;
          store.commit({
            type: 'addUser',
            payload: response.data.user,
          });
          router.push('/review');
        }
      } catch (error) {
        isActive.value = true;
        setTimeout(setActiveToFalse, 2000);
        apiKey.value = '';
        username.value = '';
        password.value = '';
      }
    }

    async function getAPILink() {
      const response = await RedmineService.getRedmineUrl();
      const apiKeyUrl = `${response.data}/my/api_key`;
      window.open(apiKeyUrl);
    }

    return {
      user,
      isActive,
      getUser,
      username,
      password,
      getAPILink,
      apiKey,
      isPwd,
      isApiKey,
    };
  },
};
</script>

<style scoped>
.login-container {
  margin: auto;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  padding: 20px 50px 48px 50px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow:
    0px 4px 4px rgba(0, 0, 0, 0.25),
    0px 4px 4px rgba(0, 0, 0, 0.25),
    0px 2px 4px rgba(0, 0, 0, 0.2);
}

@media screen and (max-width: 960px) {
  .login-container {
    padding: 20px 36px 48px 36px;
  }
}

.img-container {
  width: 100%;
  text-align: right;
  position: relative;

}

.q-input {
  margin-bottom: 12px;
}

.login-company-logo {
  width: 98px;
  height: auto;
}

.form-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  width: 400px;
}

.separator {
  padding: 16px 0px;
  margin: 0px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #393939;
}

.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #c1c1c1 ;
}

.separator:not(:empty)::before {
  margin-right: .25em;
}

.separator:not(:empty)::after {
  margin-left: .25em;
}

img {
  object-fit: cover;
  width: 100%;
  max-height: 100%;
}

h1 {
  margin-bottom: 0px;
  font-size: 30px;
  text-align: left;
  font-size: xx-large;
  font-weight: bold;
  line-height: 3rem;
  padding-bottom: 36px;
}

a {
  margin-bottom: 0px;
}

h4 {
  margin-bottom: 6px;
  margin-top: 12px;
  font-size: 22px;
}

input {
  margin-top: 0px;
  margin-bottom: 0px;
}

.action {
  margin-top: 10px;
  margin-bottom: 0px;
  width: 100%;
  height: 48px;
  background: #295365;
  color: #ffffff;
}

.as-link {
  display: contents;
  border: none;
  background: transparent;
  color: darkblue;
  cursor: pointer;
  text-decoration: underline;
}

.toast {
  position: fixed;
  left: calc(-50vw + 50%);
  right: calc(-50vw + 50%);
  margin-left: auto;
  margin-right: auto;
  visibility: hidden;
  min-width: 250px;
  max-width: 300px;
  color: #fff;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  z-index: 1;
  bottom: 30px;
  font-size: 17px;
  background-color: #e76f51;
}

.active {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
  z-index: 5;
}

div.input-container {
  margin-bottom: 1.5rem;
  width: 100%;
}

.login-page {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url('../assets/login.svg');
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}
</style>
