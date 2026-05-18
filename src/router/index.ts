import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import CreatePollPage from '../views/CreatePollPage.vue'
import PollDetailPage from '../views/PollDetailPage.vue'
import ResultsPage from '../views/ResultsPage.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/create', name: 'create', component: CreatePollPage },
    { path: '/poll/:id', name: 'poll-detail', component: PollDetailPage },
    { path: '/results/:id', name: 'results', component: ResultsPage },
  ]
})

export default router