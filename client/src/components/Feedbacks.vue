<template>
  <article class="card">
    <h3>Olvasd el, hogy mások mit írtak</h3>
    <div class="likes-container">
      <p>👍 Összesen {{ likes }} ember kedveli az alkalmazást</p>
      <p>👎 {{ dislikes }} embernek viszont nem tetszik</p>
    </div>
    <div class="texts-container">
      <ul>
        <li v-for="text in texts" :key="text.feedback">
          {{ text.feedback }}
        </li>
      </ul>
    </div>
  </article>
</template>

<script>
import { ref, onMounted } from 'vue'
import FeedbackService from '@/services/FeedbackService.js'

export default {
  name: "Feedbacks",
  setup() {
    const likes = ref(0)
    const dislikes = ref(0)
    const texts = ref()
    let feedbacks

    onMounted(() => FeedbackService.getFeedback().then(result => {
      feedbacks = result.data
      likes.value = (feedbacks.filter(i => i.like === 1)).length
      dislikes.value = feedbacks.length - likes.value
      texts.value = feedbacks.filter(i => i.feedback || i.feedback !== "")
    }))

    return {
        likes,
        dislikes,
        texts
    }
  }
}
</script>


<style lang="scss" scoped>
.card {
  padding: 12px;
  border-radius: 12px;
  margin-top: 12px;
  backdrop-filter: blur(13px);
  background: rgba(214, 214, 242, 0.95);
  text-align: center;
  height: fit-content;
  width: 700px;
}

h3 {
  font-size: 1.75rem;
  line-height: 2rem;
  font-weight: 300;
  margin-block-end: 0px;
}

article {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-block: 12px;
  padding-inline: 12px;

  .texts-container {
    width: 100%;
    height: 250px;
    overflow-y: auto;
  }
}

.likes-container {
  margin-block-start: 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

li {
  text-align: left;
  padding-block-end: 8px;
}

</style>
