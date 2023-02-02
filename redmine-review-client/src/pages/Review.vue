<template>
  <div v-if="loading">
    <section class="dark container">
      <div class="spacer layer1 center-card">
        <article class="card">
          <label class="loading-text">
            Az alkalmazás most összegyűjti a kimutatáshoz szükséges adatokat a Redmine-ból. Kérlek, légy türelemmel! Ez a folyamat akár percekig is eltarthat.🍻
            
          </label>

          <progress id="data-loading" :max="totalData " :value="collectedData" />
        </article>
      </div>
    </section>
  </div>
  <div v-else class="scroller">
      <section class="dark container">
      <div class="spacer layer1">
        <Numbers />
      </div>
    </section>
    
    <section class="dark container">
      <div class="spacer layer2">
        <Projects />
      </div>
    </section>
    

    <section class="dark container">
      <div class="spacer layer3">
        <Issues />
      </div>
    </section>

    <section class="dark container">
      <div class="spacer layer4">
        <Days />
      </div>
    </section>

    <section class="dark container">
      <div class="spacer layer5">
        <article class="feedback-texts">
          <p class="text">"Gyengeségeidből okulhatsz a legtöbbet. És meglásd, többé nem fognak uralkodni rajtad. Ehelyett te fogod uralni azokat."</p>
          <p class="author">Yoda</p>
        </article>
        <Feedback @feedbackRecived="reciveFeedback" v-if="!gaveFeedback" />
        <Feedbacks v-if="gaveFeedback"></Feedbacks>
      </div>
    </section>
</div>
</template>

<script>
import { ref, onMounted } from 'vue'
import RedmineService from '@/services/RedmineService.js'
import { useStore } from 'vuex';
import Numbers from '@/components/Numbers';
import Projects from '@/components/Projects';
import Issues from '@/components/Issues';
import Days from '@/components/Days';
import FeedbackService from '@/services/FeedbackService.js'
import Feedback from '@/components/Feedback';
import Feedbacks from '@/components/Feedbacks'

export default {
  name: 'Review',
  components: {
    Numbers,
    Projects,
    Issues,
    Days,
    Feedback,
    Feedbacks
  },
  setup() {
    let entries = ref([])
    const totalData = ref(0)
    const collectedData = ref(0)
    let loading = ref(true)
    const year = process.env.VUE_APP_YEAR
    const store = useStore();
    const gaveFeedback = ref(false)
    const userId = ref(store.state.user.api_key);


    function reciveFeedback(indicator) {
      gaveFeedback.value = true;
    }

    async function _getEntriesWithOffset(offset=0) {
      const response = await RedmineService.getAllTimeEntries(store.state.user.api_key, offset)
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

    onMounted( async () => {
      getEntries().then(() => {
        store.commit({
          type: 'addAllIssues',
          payload: entries.value,
        })
        loading.value = false
      }).then(() => {
        FeedbackService.checkFeedback(userId.value.slice(2, 10)).then((response) => {
          if(!response.data) {
            gaveFeedback.value = true
          }
        })
      })
    })

    return {
      year,
      totalData,
      collectedData,
      loading,
      entries,
      gaveFeedback,
      reciveFeedback
    };
  },
};
</script>

<style scoped>
.loading-text {
  font-size: 16px;
  font-weight: 600;
  padding-block-end: 12px;
}

.card {
  padding: 12px;
  border-radius: 12px;
  margin-top: 12px;
  backdrop-filter: blur(13px);
  background: rgba(214, 214, 242, 0.95);
  text-align: center;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

progress {
  width: 300px;
}

.center-card {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px;
  height: 120px;
}

.scroller {
    height: 100%;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
  }

  .scroller section {
    scroll-snap-align: start;
}

.review-container {
  margin: 0;
  color: white;
  background: #001220;
  overflow-x: hidden;
}

.container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.red {
  background: #5e5858;
}

.dark {
  background: #001220;
}

.spacer {
  width: 100%;
  height: 100vh;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  display: flex;
  align-content: center;
  justify-content: center;
  flex-direction: column;
}

.layer1 {
  background-image: url('../assets/layer1.svg');
}

.layer2 {
  background-image: url('../assets/layer-top2.svg');
}

.layer3 {
  background-image: url('../assets/layer3.svg');
}

.layer4 {
  background-image: url('../assets/layer-top3.svg');
}

.layer5 {
  align-items: center;
  background-image: url('../assets/layer5.svg');
}

.text {
  margin: 0 0 4px;
  font-size: 20px;
  font-weight: 400;
}

.author {
  font-style: italic;
}

.feedback-texts {
  width: 700px;
  color: white;
}
</style>
