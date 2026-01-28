<script setup>
import { ref, onMounted, watch } from 'vue';
import StringGenerator from './components/StringGenerator.vue';
import HistorySidebar from './components/HistorySidebar.vue';

// Theme Logic
const isDark = ref(true);

const toggleTheme = () => {
    isDark.value = !isDark.value;
    updateThemeClass();
};

const updateThemeClass = () => {
    const html = document.documentElement;
    if (isDark.value) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

// History State
const history = ref([]);

const addToHistory = (item) => {
    history.value.unshift(item);
    // Keep last 50
    if (history.value.length > 50) {
        history.value.pop();
    }
    saveHistory();
};

const clearHistory = () => {
    history.value = [];
    saveHistory();
};

const saveHistory = () => {
    localStorage.setItem('string-history', JSON.stringify(history.value));
};

const copyFromHistory = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        // Could show a global toast here if desired
    } catch (e) {
        console.error(e);
    }
};

onMounted(() => {
    // Init Theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        isDark.value = savedTheme === 'dark';
    } else {
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    updateThemeClass();

    // Init History
    const savedHistory = localStorage.getItem('string-history');
    if (savedHistory) {
        try {
            history.value = JSON.parse(savedHistory);
        } catch (e) {
            console.error('Failed to parse history', e);
        }
    }
});
</script>

<template>
  <div class="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col transition-colors duration-300">
    <!-- Navbar -->
    <header class="w-full border-b border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary">
              <span class="material-symbols-outlined text-[20px]">enhanced_encryption</span>
            </div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">StringGen</h1>
          </div>
          <button 
            @click="toggleTheme"
            class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 transition-colors focus:outline-none"
            aria-label="Toggle Dark Mode"
          >
            <span class="material-symbols-outlined block dark:hidden">dark_mode</span>
            <span class="material-symbols-outlined hidden dark:block">light_mode</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow p-4 sm:p-6 lg:p-8">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        
        <!-- Left Column: Generator Interface -->
        <div class="lg:col-span-2 flex flex-col gap-6">
            <StringGenerator @generated="addToHistory" />
        </div>

        <!-- Right Column: History Panel -->
        <div class="col-span-1">
            <HistorySidebar 
                :history="history" 
                @clear="clearHistory" 
                @copy="copyFromHistory"
                @copy-all="() => copyFromHistory(history.map(h => h.text).join('\n'))"
            />
        </div>

      </div>
    </main>

    <!-- Footer decoration -->
    <div class="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 pointer-events-none"></div>
  </div>
</template>

<style scoped>
/* Scoped styles mainly handled by Tailwind classes now */
</style>
