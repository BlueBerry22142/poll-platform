<template>
  <div class="container mx-auto p-4 max-w-2xl">
    <h1 class="text-3xl font-bold text-white mb-6">Создать опрос</h1>
    <form @submit.prevent="submitForm" class="bg-gray-800 p-6 rounded-lg">
      <div class="mb-4">
        <label class="block text-white mb-2">Название опроса</label>
        <input v-model="title" type="text" required class="w-full p-2 rounded bg-gray-700 text-white" />
      </div>
      <div class="mb-4">
        <label class="block text-white mb-2">Описание</label>
        <textarea v-model="description" rows="3" class="w-full p-2 rounded bg-gray-700 text-white"></textarea>
      </div>
      
      <div class="mb-4">
        <label class="block text-white mb-2">Вопросы</label>
        <div v-for="(q, idx) in questions" :key="idx" class="bg-gray-700 p-3 rounded mb-3">
          <input v-model="q.text" placeholder="Текст вопроса" class="w-full p-2 mb-2 rounded bg-gray-600 text-white" />
          <select v-model="q.type" class="w-full p-2 mb-2 rounded bg-gray-600 text-white">
            <option value="yesno">Да / Нет</option>
            <option value="single">Одиночный выбор</option>
            <option value="multiple">Множественный выбор</option>
          </select>
          <div v-if="q.type !== 'yesno'">
            <label class="text-white text-sm">Варианты ответов (каждый с новой строки)</label>
            <textarea v-model="q.optionsText" rows="3" placeholder="Вариант 1&#10;Вариант 2&#10;Вариант 3" class="w-full p-2 rounded bg-gray-600 text-white"></textarea>
          </div>
          <button type="button" @click="removeQuestion(idx)" class="text-red-400 text-sm mt-2">Удалить вопрос</button>
        </div>
        <button type="button" @click="addQuestion" class="bg-green-600 text-white px-3 py-1 rounded">+ Добавить вопрос</button>
      </div>
      
      <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Создать опрос</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePollStore } from '../stores/pollStore'
import type { QuestionType } from '../types/poll'

const router = useRouter()
const pollStore = usePollStore()
const title = ref('')
const description = ref('')
const questions = ref<{ text: string; type: QuestionType; optionsText: string }[]>([])

function addQuestion() {
  questions.value.push({ text: '', type: 'single', optionsText: '' })
}
function removeQuestion(idx: number) {
  questions.value.splice(idx, 1)
}

async function submitForm() {
  const formattedQuestions = questions.value.map(q => {
    let options: string[] | undefined = undefined
    if (q.type !== 'yesno' && q.optionsText.trim()) {
      options = q.optionsText.split('\n').filter(s => s.trim())
    }
    return { text: q.text, type: q.type, options }
  }).filter(q => q.text.trim())
  
  if (title.value.trim() && formattedQuestions.length) {
    await pollStore.createPoll(title.value, description.value, formattedQuestions)
    router.push('/')
  } else {
    alert('Заполните название и хотя бы один вопрос')
  }
}
</script>