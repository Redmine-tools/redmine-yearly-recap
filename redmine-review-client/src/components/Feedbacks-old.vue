<template>
  <h3>Olvasd el, hogy mások mit írtak</h3>
  <article>
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

    onMounted(FeedbackService.getFeedback().then(result => {
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
h3 {
  font-size: 1.75rem;
  line-height: 2rem;
  font-weight: 300;
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

</style>
