<template>
  <section class="numbers-section">
    <article class="heading">
      <h2>{{ year }} Redmine összefoglaló</h2>
      <p class="text">"Tedd, vagy ne tedd, de ne próbáld!"</p>
      <p class="author">Yoda</p>
    </article>
    <article class="cards-conatiner">
      <div class="card">
        <p>Összesen</p>
        <p class="trophy"><b>{{ store.state.issues.length }}</b></p>
        <p>alkalommal rögzítettél időt</p>
      </div>

      <div class="card">
        <p>Összesen</p>
        <p class="trophy"><b>{{ hoursSum }}</b></p>
        <p>órát rögzítettél</p>
      </div>

      <div class="card">
        <p>Átlagosan</p>
        <p class="trophy"><b>{{ (hoursSum/store.state.issues.length).toFixed(2) }}</b></p>
        <p>órát rögzítettél egy jegyre</p>
      </div>
    </article>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'
import RedmineService from '@/services/RedmineService.js'
import { useStore } from 'vuex';

export default {
  name: 'Numbers',
  setup() {
    const store = useStore();
    const hoursSum = ref(store.state.issues.reduce((acc, obj) => {
      return acc + obj.hours
    }, 0))
    const year = process.env.VUE_APP_YEAR

    return {
      store,
      hoursSum,
      year
    };
  },
};
</script>

<style scoped>
.numbers-section {
  width: 100%;
  height: 100%;
  padding: 96px;
}

.heading-duplicate {
  backdrop-filter: blur(13px);
  background: rgba(255,255,255,0.65);
  padding: 24px;
  border-radius: 12px;
  width: 100%;
  /* height: 100%; */
  overflow: hidden;
  box-shadow: 0 15px 25px rgb(129 124 124 / 20%);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
}

.heading {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  color: white;
}

.heading > h2 {
  margin: 0;
  font-weight: 400;
}

.cards-conatiner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-content: center;
}

.card {
  width: 320px;
  padding: 12px;
  border-radius: 12px;
  margin-top: 12px;
  backdrop-filter: blur(13px);
  background: rgba(214, 214, 242, 0.95);
  text-align: center;
}

.card > p {
  font-size: 1.5rem;
  margin: 0 0 10px;
}

.card > .trophy {
  font-size: 3rem;
}

.text {
  margin: 0 0 4px;
  font-size: 20px;
  font-weight: 400;
}

.author {
  font-style: italic;
}
</style>
