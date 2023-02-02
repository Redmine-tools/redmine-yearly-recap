<template>
  <section class="projects-section">
    <article class="card">
      <apexchart height="380" width="700" type="heatmap" :options="options" :series="series"></apexchart>
    </article>
    <article class="heading">
      <h4>Megmutatja, hogy melyik napra hány órát rögzítettél</h4>
      <p class="text">"Remélem is, parancsnok, az Ön érdekében. Az Uralkodó ugyanis nem oly elnéző mint én."</p>
      <p class="author">Darth Vader</p>
    </article>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'
import RedmineService from '@/services/RedmineService.js'
import { useStore } from 'vuex';
import VueApexCharts from "vue3-apexcharts"

export default {
  name: 'Days',
  components: {
    apexchart: VueApexCharts,
  },
  setup() {
    const store = useStore();
    const year = process.env.VUE_APP_YEAR;
    const timeEntries = store.state.issues;

    function aggregateData(array) {
      return array.reduce((acc, value) => ({
        ...acc,
        [value]: (acc[value] || 0) + 1
      }), {})
    }

    function pad(num) {
      num = num.toString();
      if (num.length < 2) num = "0" + num;
      return num;
    }

    const timeEntriesDays = aggregateData(timeEntries.map(entrie => entrie.spent_on))
    let hoursPerDate = timeEntries.reduce((r,v) => {
      r[v.spent_on] = (r[v.spent_on] || 0) + v.hours;
      return r;
    }, {});

    function generateDataOK(entries, month) {
      let series = [];
      let i = 1;
      while (i < 32) {
        let day = process.env.VUE_APP_YEAR + '-' + pad(month) + '-' + pad(i)
        series.push({x:i, y:entries[day] || 0})
        i++;
      }
      return series;
    }

    const series = [
      {
        name: "Dec",
        data: generateDataOK(hoursPerDate, '12')
      },
      {
        name: "Nov",
        data: generateDataOK(hoursPerDate, '11')
      },
      {
        name: "Okt",
        data: generateDataOK(hoursPerDate, '10')
      },
      {
        name: "Szep",
        data: generateDataOK(hoursPerDate, '09')
      },
      {
        name: "Aug",
        data: generateDataOK(hoursPerDate, '08')
      },
      {
        name: "Júl",
        data: generateDataOK(hoursPerDate, '07')
      },
      {
        name: "Jún",
        data: generateDataOK(hoursPerDate, '06')
      },
      {
        name: "Máj",
        data: generateDataOK(hoursPerDate, '05')
      },
      {
        name: "Ápr",
        data: generateDataOK(hoursPerDate, '04')
      },
      {
        name: "Már",
        data: generateDataOK(hoursPerDate, '03')
      },
      {
        name: "Feb",
        data: generateDataOK(hoursPerDate, '02')
      },
      {
        name: "Jan",
        data: generateDataOK(hoursPerDate, '01')
      }
    ]

    const options = ref({
      chart: {
        id: 'data',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          colorScale: {
            ranges: [
              {
                from: 0,
                to: 0,
                name: "nincs",
                color: "#FFFFFF"
              },
              {
                from: 0.1,
                to: 3,
                name: "alig",
                color: "#60afde"
              },
              {
                from: 3.1,
                to: 6,
                name: "kevés",
                color: "#128FD9"
              },
              {
                from: 6.1,
                to: 8,
                name: "OK",
                color: "#00A100"
              },
              {
                from: 8.1,
                to: 10,
                name: "sok",
                color: "#FFB200"
              },
              {
                from: 10.1,
                to: 100,
                name: "extRÉM",
                color: "#FF0000"
              }
            ]
          }
        }
      }
    })

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
.projects-section {
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
