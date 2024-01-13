<template>
  <router-view></router-view>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref, shallowRef } from 'vue'

export default {
  name: 'app',
  components: {
  },
  setup () {
    const router = useRouter();
 
    return {
      router
    }
  }
}
</script>



<style>

html, body, #q-app  {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #F8F9FF;
  scroll-behavior: smooth;
  font-size: 16px;
}

#app {
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
