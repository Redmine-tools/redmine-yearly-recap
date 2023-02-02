<template>
  <section class="issues-section">
    <article class="heading">
      <h4>Megmutatja, hogy melyik nap hány különböző jegyre rögzítettél órát</h4>
      <p class="text">"Ne feledd! Amire figyelsz, az a világod."</p>
      <p class="author">Qui-Gon Jinn</p>
    </article>
    <article class="card">
      <apexchart height="380" width="700" type="bar" :options="options" :series="series"></apexchart>
    </article>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue';
import RedmineService from '@/services/RedmineService.js';
import { useStore } from 'vuex';
import VueApexCharts from "vue3-apexcharts";

export default {
  name: 'Issues',
  components: {
    apexchart: VueApexCharts,
  },
  setup() {
    const store = useStore();
    const year = process.env.VUE_APP_YEAR;

    function aggregateData(array) {
      return array.reduce((acc, value) => ({
        ...acc,
        [value]: (acc[value] || 0) + 1
      }), {})
    }

    function createWeekDayFromDateString(date) {
      return new Date(date).toLocaleString('hu-HU', {weekday:'long'})
    }
    
    const timeEntriesDays = aggregateData(store.state.issues.map(entrie => entrie.spent_on))

    const magic = Object.entries(timeEntriesDays).reduce((acc, value) => ({
      ...acc,
      [createWeekDayFromDateString(value[0])]: (acc[createWeekDayFromDateString(value[0])] || 0) + value[1]
    }), {})

    const magic1 = Object.entries(timeEntriesDays).reduce((acc, value) => ({
      ...acc,
      [createWeekDayFromDateString(value[0])]: (acc[createWeekDayFromDateString(value[0])] || 0) + 1
    }), {})

    const daysOfWeek = ['hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat', 'vasárnap'];
    let finalAvgDayEntri = daysOfWeek.map(entri => (magic[entri] / magic1[entri]).toFixed(2))
    finalAvgDayEntri = finalAvgDayEntri.filter(i => i !== 'NaN')
   

    const sortDays = function (a, b) {
      a = days.indexOf(a);
      b = days.indexOf(b);
      return a < b ? 0 : 1;
    };

    const options = ref({
      chart: {
        id: 'data',
        toolbar: {
          show: false
        }
      },
      xaxis: {
        categories: Object.keys(magic)
      } 
    })

    const series = ref([{
      name: 'rogzites-darab',
      data: finalAvgDayEntri
    }])

    return {
      store,
      series,
      options,
      year
    };
  },
};
</script>

<style scoped>
.issues-section {
  width: 100%;
  height: 100%;
  padding-inline: 96px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.heading {
  width: 700px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  color: white;
  margin-top: 24px;
}

.heading > h2 {
  margin: 0;
  font-weight: 400;
}

.card {
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
