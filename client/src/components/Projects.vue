<template>
  <section class="projects-section">
    <article class="card">
      <apexchart height="380" width="700" type="bar" :options="options" :series="series"></apexchart>
    </article>
    <article class="heading">
      <h4>Megmutatja, hogy melyik projektre hány órát fordítottál</h4>
      <p class="text">{{ quote[parseInt(store.state.year, 10)] }}</p>
      <p class="author">{{ writer[parseInt(store.state.year, 10)] }}</p>
    </article>
  </section>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import RedmineService from '@/services/RedmineService.js'
import { useStore } from 'vuex';
import VueApexCharts from "vue3-apexcharts"

export default {
  name: 'Projects',
  props: ['issues'],
  components: {
    apexchart: VueApexCharts,
  },
  setup(props) {
    const store = useStore();
    const year = computed(() => parseInt(store.state.year, 10));
    const projectHours = computed(() => props.issues.reduce((r,v) => {
      r[v.project.name] = (r[v.project.name] || 0) + v.hours; 
      return r;
    }, {}));
    const series = ref([
        {
          name: "rögzített órák száma",
          data: Object.values(projectHours.value),
        },
      ])

    const options = ref({
      chart: {
        type: 'pie',
        toolbar: {
          show: false
        },
      },
              style: {
          fontWeight: "500",
          fontSize: "14px",
        },
      legend: {
        position: 'bottom',

      },
       dataLabels: {
        enabled: true,
        style: {
          fontWeight: "500",
          fontSize: "14px",
        }
      },
      labels: Object.keys(projectHours.value),
      responsive: [{
      breakpoint: 540,
        options: {
          chart: {
            width: 200,
            height: 560
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    })

    const quote = ref({
      2023: "Vesd el a sajnálkozást és a félelmet! Tedd azt, amit éppen tenned kell.",
      2022: "Mi ketten közös erővel véget vethetünk ennek a pusztító háborúskodásnak. És rendet teremtünk a galaxisban.",
      2021: "Mi ketten közös erővel véget vethetünk ennek a pusztító háborúskodásnak. És rendet teremtünk a galaxisban."
    })
    const writer = ref({
      2023: "Gandalf - A két torony",
      2022: "Darth Vader",
      2021: "Darth Vader"
    })

    return {
      store,
      series,
      options,
      year,
      quote,
      writer
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
