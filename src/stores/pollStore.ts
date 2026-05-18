import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Poll as PollClass } from '../types/poll';
import type { Poll } from '../types/poll';

const imageIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

function getRandomImageUrl(): string {
  const randomId = imageIds[Math.floor(Math.random() * imageIds.length)];
  return `https://picsum.photos/id/${randomId}/300/200`;
}

const mockPolls: Poll[] = [
  new PollClass(
    'Любимый язык программирования',
    'Расскажите, что вы используете в работе',
    [{ text: 'Какой язык вы предпочитаете?', type: 'single', options: ['JavaScript', 'Python', 'Java', 'C++'] }],
    'https://picsum.photos/id/1/300/200'
  ),
  new PollClass(
    'Музыкальные предпочтения',
    'Поделитесь своими любимыми жанрами',
    [
      { text: 'Какие жанры музыки вам нравятся?', type: 'multiple', options: ['Рок', 'Поп', 'Хип-хоп', 'Электронная', 'Джаз', 'Классика'] }
    ],
    'https://picsum.photos/id/2/300/200'
  )
];

export const usePollStore = defineStore('poll', () => {
  const polls = ref<Poll[]>(mockPolls);
  const loading = ref(false);

  async function fetchPolls(): Promise<Poll[]> {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 300));
    loading.value = false;
    return polls.value;
  }

  async function fetchPollById(id: string): Promise<Poll | undefined> {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 200));
    loading.value = false;
    return polls.value.find(p => p.id === id);
  }

  async function createPoll(title: string, description: string, questions: any[]): Promise<Poll> {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 500));
    const imageUrl = getRandomImageUrl();
    const newPoll = new PollClass(title, description, questions, imageUrl);
    polls.value.push(newPoll);
    loading.value = false;
    return newPoll;
  }

  async function vote(pollId: string, questionId: string, optionId: string): Promise<boolean> {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 300));
    const poll = polls.value.find(p => p.id === pollId);
    if (!poll) return false;
    const question = poll.questions.find(q => q.id === questionId);
    if (!question) return false;
    const success = question.addVote(optionId);
    loading.value = false;
    return success;
  }

  return { polls, loading, fetchPolls, fetchPollById, createPoll, vote };
});