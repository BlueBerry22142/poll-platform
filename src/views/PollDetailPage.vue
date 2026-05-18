<template>
  <div class="container mx-auto p-4 max-w-2xl">
    <div v-if="loading" class="text-white">Загрузка...</div>
    <div v-else-if="poll">
      <h1 class="text-3xl font-bold text-white mb-2">{{ poll.title }}</h1>
      <p class="text-gray-300 mb-6">{{ poll.description }}</p>
      
      <div v-for="question in poll.questions" :key="question.id" class="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 class="text-xl text-white mb-3">{{ question.text }}</h3>
        
        <div v-if="question.type === 'yesno'" class="flex gap-4">
          <button v-for="opt in question.options" :key="opt.id" @click="vote(question.id, opt.id)" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            {{ opt.text }}
          </button>
        </div>
        
        <div v-else-if="question.type === 'single'" class="space-y-2">
          <div v-for="opt in question.options" :key="opt.id" class="flex items-center gap-2">
            <input type="radio" :name="question.id" :value="opt.id" v-model="selectedSingle[question.id]" />
            <label class="text-white">{{ opt.text }}</label>
          </div>
          <button @click="voteSingle(question.id)" class="bg-blue-600 text-white px-4 py-1 rounded mt-2">Проголосовать</button>
        </div>
        
        <div v-else-if="question.type === 'multiple'" class="space-y-2">
          <div v-for="opt in question.options" :key="opt.id" class="flex items-center gap-2">
            <input type="checkbox" :value="opt.id" v-model="selectedMultiple[question.id]" class="w-4 h-4" />
            <label class="text-white">{{ opt.text }}</label>
          </div>
          <button @click="voteMultiple(question.id)" class="bg-blue-600 text-white px-4 py-1 rounded mt-2">Проголосовать</button>
        </div>
      </div>
      
      <router-link :to="`/results/${poll.id}`" class="inline-block bg-gray-600 text-white px-4 py-2 rounded">Посмотреть результаты</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePollStore } from '../stores/pollStore'
import type { Poll } from '../types/poll'

const route = useRoute()
const router = useRouter()
const pollStore = usePollStore()
const poll = ref<Poll | null>(null)
const loading = ref(true)

const selectedSingle = ref<Record<string, string>>({})
const selectedMultiple = ref<Record<string, string[]>>({})

function initSelectedArrays() {
  if (!poll.value) return
  for (const question of poll.value.questions) {
    if (question.type === 'multiple') {
      if (!selectedMultiple.value[question.id]) {
        selectedMultiple.value[question.id] = []
      }
    }
  }
}

async function vote(questionId: string, optionId: string) {
  await pollStore.vote(poll.value!.id, questionId, optionId)
  alert('Спасибо за голос!')
  router.push(`/results/${poll.value!.id}`)
}

async function voteSingle(questionId: string) {
  const optId = selectedSingle.value[questionId]
  if (optId) {
    await pollStore.vote(poll.value!.id, questionId, optId)
    alert('Голос учтён!')
    router.push(`/results/${poll.value!.id}`)
  } else {
    alert('Выберите вариант')
  }
}

async function voteMultiple(questionId: string) {
  const optIds = selectedMultiple.value[questionId]
  if (optIds && optIds.length) {
    for (let optId of optIds) {
      await pollStore.vote(poll.value!.id, questionId, optId)
    }
    alert('Голоса учтены!')
    selectedMultiple.value[questionId] = []
    router.push(`/results/${poll.value!.id}`)
  } else {
    alert('Выберите хотя бы один вариант')
  }
}

onMounted(async () => {
  const id = route.params.id as string
  const found = await pollStore.fetchPollById(id)
  if (found) {
    poll.value = found
    initSelectedArrays()
  } else {
    alert('Опрос не найден')
    router.push('/')
  }
  loading.value = false
})
</script>