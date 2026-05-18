<template>
  <div class="container mx-auto p-4 max-w-3xl">
    <div v-if="loading" class="text-white">Загрузка...</div>
    <div v-else-if="poll">
      <h1 class="text-3xl font-bold text-white mb-2">{{ poll.title }}</h1>
      <p class="text-gray-300 mb-6">{{ poll.description }}</p>
      
      <div v-for="question in poll.questions" :key="question.id" class="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 class="text-xl text-white mb-3">{{ question.text }}</h3>
        <div class="space-y-2">
          <div v-for="opt in question.options" :key="opt.id">
            <div class="flex justify-between text-white">
              <span>{{ opt.text }}</span>
              <span>{{ opt.votes }} голосов ({{ opt.getPercentage(question.totalVotes()).toFixed(1) }}%)</span>
            </div>
            <div class="w-full bg-gray-600 rounded-full h-4">
              <div class="bg-blue-500 h-4 rounded-full" :style="{ width: opt.getPercentage(question.totalVotes()) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="text-gray-400 text-sm">Данные обновляются автоматически каждые 3 секунды</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePollStore } from '../stores/pollStore'
import type { Poll } from '../types/poll'

const route = useRoute()
const router = useRouter()
const pollStore = usePollStore()
const poll = ref<Poll | null>(null)
const loading = ref(true)
let interval: number | null = null

async function loadPoll() {
  const id = route.params.id as string
  const found = await pollStore.fetchPollById(id)
  if (found) {
    poll.value = found
  } else {
    alert('Опрос не найден')
    router.push('/')
  }
  loading.value = false
}

function startRealtimeSimulation() {
  interval = window.setInterval(() => {
    if (poll.value) {
      const questions = poll.value.questions
      if (questions.length === 0) return
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)]
      if (randomQuestion.options.length === 0) return
      const randomOption = randomQuestion.options[Math.floor(Math.random() * randomQuestion.options.length)]
      randomOption.addVote()
      poll.value = { ...poll.value }
    }
  }, 3000)
}

onMounted(async () => {
  await loadPoll()
  startRealtimeSimulation()
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>