<template>
  <article class="entires-container">
    <div class="entries-numbers">
      <div>
        <p>Összesen</p>
        <h3> {{ timeEntries.length }} </h3>
        <p>alkalommal rögzítettél időt</p>
      </div>

      <div>
        <p>Összesen</p>
        <h3> {{ hoursSum }} </h3>
        <p>órát rögzítettél</p>
      </div>

      <div>
        <p>Átlagosan</p>
        <h3> {{ (hoursSum / timeEntries.length).toFixed(2) }} </h3>
        <p>órát rögzítettél egy jegyre</p>
      </div>

      <div>
        <p>A legnépszerűbb projektedre</p>
        <h3> {{ maxProject[1] }} </h3>
        <p>órát rögzítettél</p>
      </div>
    </div>
    <div class="graphs-container">
      <div class="graph-container">
        <h3>Megmutatja, hogy melyik nap hány különböző jegyre rögzítettél órát</h3>
        <apexchart type="bar" height="100%" width="100%" :options="options1" :series="series1"></apexchart>
      </div>

      <div class="graph-container">
        <h3>Megmutatja, hogy melyik napra hány órát rögzítettél</h3>
        <apexchart type="heatmap" height="100%" width="100%" :options="options2b" :series="series2b"></apexchart>
      </div>

      <div class="graph-container">
        <h3>Megmutatja, hogy melyik projektre hány órát fordítottál</h3>
        <apexchart type="pie" height="100%" width="100%" :options="options3" :series="series3"></apexchart>
      </div>

      <div class="graph-container">
        <Feedback @feedbackRecived="reciveFeedback" v-if="!gaveFeedback" :userId="userId"></Feedback>
        <Feedbacks v-if="gaveFeedback"></Feedbacks>
      </div>
    </div>
  </article>
</template>

<script>
import {onMounted, ref} from 'vue'
import VueApexCharts from "vue3-apexcharts"
import Feedback from "@/components/Feedback"
import Feedbacks from '@/components/Feedbacks'
import FeedbackService from '@/services/FeedbackService.js'

export default {
  name: 'Entries',
  components: {
    apexchart: VueApexCharts,
    Feedback,
    Feedbacks
  },
  props: {
    entries: Array,
    userApiKey: String
  },
  setup(props) {
    const timeEntries = ref(props.entries)
    const userId = ref(props.userApiKey)
    const daysCounts = ref()
    const daysCountHours = ref()
    const maxProject = ref()
    const gaveFeedback = ref(false)



    function reciveFeedback(indicator) {
      gaveFeedback.value = indicator
    }

    const hoursSum = ref(timeEntries.value.reduce((acc, obj) => {
      return acc + obj.hours
    }, 0))

    const maxHour = ref(Math.max(...timeEntries.value.map(o => o.hours), 0))


    function createWeekDayFromDateString(date) {
      return new Date(date).toLocaleString('hu-HU', {weekday:'long'})
    }


    function aggregateData(array) {
      return array.reduce((acc, value) => ({
        ...acc,
        [value]: (acc[value] || 0) + 1
      }), {})
    }

    const timeEntriesDays = aggregateData(timeEntries.value.map(entrie => entrie.spent_on))
    const magic = Object.entries(timeEntriesDays).reduce((acc, value) => ({
        ...acc,
        [createWeekDayFromDateString(value[0])]: (acc[createWeekDayFromDateString(value[0])] || 0) + value[1]
      }), {})

    const magic1 = Object.entries(timeEntriesDays).reduce((acc, value) => ({
        ...acc,
        [createWeekDayFromDateString(value[0])]: (acc[createWeekDayFromDateString(value[0])] || 0) + 1
      }), {})

    let daysOfWeek = ['hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat', 'vasárnap'];
    let finalAvgDayEntri = daysOfWeek.map(entri => (magic[entri] / magic1[entri]).toFixed(2))

    let days = timeEntries.value.map(entrie => new Date(entrie.spent_on).toLocaleString('hu-HU', {weekday:'long'}))
    daysCounts.value = aggregateData(days)

    let dayHours = timeEntries.value.reduce((r,v) => {
      r[new Date(v.spent_on).toLocaleString('hu-HU', {weekday:'long'})] = (r[new Date(v.spent_on).toLocaleString('hu-HU', {weekday:'long'})] || 0) + v.hours; 
      return r;
    }, {});

    let hoursPerDate = timeEntries.value.reduce((r,v) => {
      r[v.spent_on] = (r[v.spent_on] || 0) + v.hours;
      return r;
    }, {});

    let projectHours = timeEntries.value.reduce((r,v) => {
      r[v.project.name] = (r[v.project.name] || 0) + v.hours; 
      return r;
    }, {});

    // HEATMAP
    function pad(num) {
      num = num.toString();
      if (num.length < 2) num = "0" + num;
      return num;
    }

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

    let series2b = [
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

    maxProject.value = Object.entries(projectHours).sort((x,y)=>y[1]-x[1])[0]

    let options1 = ref({
      chart: {
        id: 'data',
        toolbar: {
          show: false
        },
        height: '100%',
        width: '100%',
      },
      xaxis: {
        categories: daysOfWeek
      }
    })

    let options2 = ref({
      chart: {
        id: 'data',
        toolbar: {
          show: false
        },
        height: '100%',
        width: '100%',
      },
      xaxis: {
        categories: daysOfWeek
      }
    })

    let options2b = ref({
      chart: {
        id: 'data',
        toolbar: {
          show: false
        },
        height: '100%',
        width: '100%',
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


    let options3 = ref({
      chart: {
        type: 'pie',
        toolbar: {
          show: false
        },
      },
      legend: {
        position: 'bottom'
      },
      labels: Object.keys(projectHours),
    })

    let series1 = ref([{
      name: 'rogzites-darab',
      data: finalAvgDayEntri
    }])

    let series2 = ref([{
      name: 'rogzitett-orak',
      data: daysOfWeek.map(x => dayHours[x])
    }])

    let series3 = ref(Object.values(projectHours))

    onMounted(() => {
      FeedbackService.checkFeedback(userId.value.slice(2, 10)).then((response) => {
        if(response.data === false) {
          gaveFeedback.value = true
        }
        // false if user already gave feedback
      })
    })

    return {
      timeEntries,
      hoursSum,
      maxHour,
      maxProject,
      daysCounts,
      options1,
      options2,
      options2b,
      options3,
      series1,
      series2,
      series2b,
      series3,
      daysCountHours,
      gaveFeedback,
      reciveFeedback,
      userId
    }
  }
}
</script>

<style lang="scss" scoped>
.entires-container {
  width: 100%;
  h2, h3 {
    margin-block: 0rem;
  }

  h2 {
    font-size: 2rem;
    line-height: 2.125rem;
    font-weight: 400;
  }

  h3 {
    font-size: 1.75rem;
    line-height: 2rem;
    font-weight: 300;
  }

  .entries-numbers {
    max-width: 1400px;
    div {
      width: 277px;
      height: 120px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #FFFFFF;
      border-radius: 10px;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 2px 4px rgba(0, 0, 0, 0.2);
    }

    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .graphs-container {
    max-width: 1400px;
    
    .graph-container {
      height: 33rem;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;

      h3 {
        font-size: 1.05rem;
        line-height: 1.25rem;
        padding-block-start: 1rem;
        padding-block-end: 2rem;
        padding-inline: 1rem;
      }

      width: 600px;
      margin-block: 2rem;
      background-color: #FFFFFF;
      border-radius: 10px;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 2px 4px rgba(0, 0, 0, 0.2);
    }

    display: flex;
    justify-content: space-between;
    align-content: center;
    flex-wrap: wrap;
    width: 100%;
    
  }
}

@media screen and (max-width: 1400px) {
  .entires-container {
    .graphs-container {
      .graph-container {
        width: 542px;
      }
    }
  }
}


@media screen and (max-width: 1200px) {
  .entires-container {
    .entries-numbers {
      flex-direction: column;
      height: 100%;
      align-items: center;

      div {
        width: 460px;
        margin-block-start: 1rem;
      }
    }

    .graphs-container {
      flex-direction: column;
      height: 100%;
      align-items: center;

      .graph-container {
        width: 460px;
        padding-inline: 2rem;
        padding-block-start: 1.5rem;
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .entires-container {
    .entries-numbers {
      flex-direction: column;
      height: 100%;
      align-items: center;

      div {
        width: 320px
      }
    }

    .graphs-container {
      flex-direction: column;
      height: 100%;
      align-items: center;

      .graph-container {
        width: 320px!important;
        padding-inline: 2rem;
        padding-block-start: 1.5rem;
      }
    }
  }
}

</style>
