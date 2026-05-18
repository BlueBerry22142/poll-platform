<template>
  <div class="min-h-screen bg-gray-900">
    <header class="bg-gray-800 p-4">
      <div class="container mx-auto flex flex-wrap justify-between items-center">
        <router-link to="/" class="text-2xl font-bold text-white">Опросник</router-link>
        <nav class="flex gap-4">
          <router-link to="/" class="text-gray-300 hover:text-white">Главная</router-link>
          <router-link to="/create" class="text-gray-300 hover:text-white">Создать опрос</router-link>
        </nav>
      </div>
    </header>
    <router-view />
  </div>
</template>