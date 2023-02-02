<template>
  <h3>Oszd meg velünk, hogy mit gondolsz</h3>
  <form @submit.prevent="sendFeedback" v-if="!filled">
    <q-input
      v-model="text"
      outlined
      label="Viharjelzés"
      type="textarea"
      color="green"
      required
    />
    <div class="like-buttons">
      <q-btn-toggle
        v-model="liked"
        class="my-custom-toggle"
        rounded
        push
        unelevated
        toggle-color="green"
        text-color="primary"
        :options="[
          {label: 'Tetszik 👍', value: '1'},
          {label: 'Nem tetszik 👎', value: '0'}
        ]"
      />
    </div>
    <button>Beküldés</button>
    <p>Amint megosztod velünk, hogy mit gondolsz az oldalról itt látni fogod hogy mások mit írtak.</p>
  </form>
  <div v-bind:class="{ active: isActive }" class="toast">Köszönjük ❤</div>
</template>

<script>
import { ref } from 'vue'
import FeedbackService from '@/services/FeedbackService.js'

export default {
  name: "Feedback",
  emits: ["feedbackRecived"],
  props: {
    userId: String
  },
  setup(props, { emit }) {
    const id = ref(props.userId)
    const liked = ref(1)
    const text = ref('')
    const isActive = ref(false)
    const filled = ref(false)
    
    async function sendFeedback() {
      FeedbackService.sendFeedback({
        'feedback': text.value,
        'like': liked.value,
        'user': id.value.slice(2, 10)
      }).then(() => {
        emit('feedbackRecived', true)
        isActive.value = true
        filled.value = true
        setTimeout(() => isActive.value = false, 2000)
      })
    }
    //'user': id.value.slice(2, 10)

    return {
      liked,
      text,
      sendFeedback,
      isActive,
      filled
    }
  }
}
</script>


<style lang="scss" scoped>
h3 {
  font-size: 1.75rem;
  line-height: 2rem;
  font-weight: 300;
  margin-block-end: 0px;
}

.filled {
    width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center; 
}

form {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: stretch;
  padding-inline: 48px;
  padding-block: 24px;
  padding-block-start: 0px;

  button {
    margin-inline: 84px;
    cursor: pointer;
    display:inline-block;
    padding: 0.35em 1.2em;
    height: 2.75rem;
    border: none;
    margin-top: 5px;
    border-radius: 3px;
    box-sizing: border-box;
    text-decoration:none;
    font-weight:300;
    color:#FFF;
    text-align:center;
    background-color: #084c61;
    transition: all 1s;
  }
  button:disabled {
    cursor: wait;
  }
  button:hover{
    color:#FFF;
    background-color:#2b9348;
  }

  .like-buttons {
    button {
      margin-inline: 24px;
    }
   
    display: flex;
    width: 100%;
    justify-content: center;
  }
}

@media screen and (max-width: 500px) {
  form {
    padding-inline: 12px;
    button {
      margin-inline: 0px;
    }

      .like-buttons {
        button {
          margin-inline: 10px;
        }
      }
  }
}

.toast {
  position: fixed;
  left: calc(-50vw + 50%);
  right: calc(-50vw + 50%);
  margin-left: auto;
  margin-right: auto;
  visibility: hidden;
  min-width: 250px;
  max-width: 300px;
  color: #fff;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  z-index: 1;
  bottom: 30px;
  font-size: 17px;
  background-color: #084c61;
}

.active {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
  z-index: 5;
}

</style>
