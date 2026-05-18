<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold text-white mb-6">Опросы и голосования</h1>
    <div v-if="loading" class="text-white">Загрузка...</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="poll in polls" :key="poll.id" class="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
        <img :src="poll.imageUrl" class="w-full h-40 object-cover" :alt="poll.title" />
        <div class="p-4">
          <h2 class="text-xl font-bold text-white mb-2">{{ poll.title }}</h2>
          <p class="text-gray-300 mb-3">{{ poll.description }}</p>
          <div class="flex gap-2">
            <router-link :to="`/poll/${poll.id}`" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Голосовать</router-link>
            <router-link :to="`/results/${poll.id}`" class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition">Результаты</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePollStore } from '../stores/pollStore'

const pollStore = usePollStore()
const polls = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  polls.value = await pollStore.fetchPolls()
  loading.value = false
})
</script>