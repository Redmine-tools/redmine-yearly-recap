<template>
  <section class="dashboard">
    <h1>A {{ year }}. évi Redmine összefoglalód</h1>
    <article v-if="loading" class="loading-container">
      <label class="loading-text">
        Az alkalmazás most összegyűjti a kimutatáshoz szükséges adatokat a Redmine-ból. Kérlek, légy türelemmel! Ez a folyamat akár percekig is eltarthat.🍻
        <progress id="data-loading" :max="totalData " :value="collectedData" />
      </label>
    </article>
    <article class="data-container">
      <Entries v-if="!loading && entries" :entries="entries" :userApiKey="userApiKey">
      </Entries>
    </article>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'
import RedmineService from '@/services/RedmineService.js'
import Entries from '@/components/Entries'

export default {
  name: "Dashboard",
  components: {
    Entries
  },
  props: {
    apiKey: String
  },
  setup(props) {
    const userApiKey =ref(props.apiKey)
    let entries = ref([])
    const totalData = ref(0)
    const collectedData = ref(0)
    let loading = ref(true)
    let year = process.env.VUE_APP_YEAR

    async function _getEntriesWithOffset(offset=0) {
      const response = await RedmineService.getAllTimeEntries(props.apiKey, offset)
      collectedData.value += response?.data?.time_entries.length
      return {
        time_entries: response?.data?.time_entries || [],
        total_count: response?.data?.total_count || 0
      }
    }

    async function getEntries() {
      const PAGE_SIZE = 100;
      const { time_entries: firstEntries, total_count } = await _getEntriesWithOffset();
      entries.value = [...firstEntries];
      totalData.value += total_count
      
      if(total_count > PAGE_SIZE) {
        const iterations = Math.ceil(total_count / PAGE_SIZE)
        for(let i = 1; i < iterations; i++) {
          const { time_entries: currentEntries } = await _getEntriesWithOffset(i * PAGE_SIZE)
          entries.value = [...entries.value, ...currentEntries]
        }
      }
    }

    onMounted(() => {
      getEntries().then(() => loading.value = false)
    })

    return {
      userApiKey,
      year,
      totalData,
      collectedData,
      loading,
      entries
    }
  }
}
</script>


<style lang="scss" scoped>
.dashboard {
  margin-block: 3rem;
  margin-inline: 3rem;
  padding: 3rem;
  width: 100%;
  max-width: 1600px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
 
  h1 {
    font-size: 2rem;
    line-height: 2.25rem;
    margin-block-start: 0rem;
    font-weight: 500;
    text-align: center;
  } 

  .loading-container {
    padding: 2rem;

    .loading-text {
      font-size: 1rem;
    }

    progress {
      padding-block-start: 1.5rem;
      margin-block-start: 1rem;
      width: 100%;
      accent-color: #2b9348;
    }
  }

  .data-container {
    display: flex;
    align-items: flex-start;
    justify-content: space-around;
    width: 100%;
    height: 100%;
  }
}

@media screen and (max-width: 480px) {
  .dashboard {
    margin-block: 1rem;
    margin-inline: 1rem;

    .loading-container {
      padding: 1rem;
    }
  }
}

</style>
