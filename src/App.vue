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
  <div class="app-container">
    <!-- Navbar -->
    <header>
      <div class="container">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <div class="logo-icon flex items-center justify-center">
              <span class="material-symbols-outlined text-[20px]">enhanced_encryption</span>
            </div>
            <h1 class="text-xl">StringGen</h1>
          </div>
          <button 
            @click="toggleTheme"
            class="btn-icon"
            aria-label="Toggle Dark Mode"
          >
            <span class="material-symbols-outlined block dark:hidden">dark_mode</span>
            <span class="material-symbols-outlined hidden dark:block">light_mode</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="container main-grid">
        
        <!-- Left Column: Generator Interface -->
        <div class="generator-column">
            <StringGenerator @generated="addToHistory" />
        </div>

        <!-- Right Column: History Panel -->
        <div class="history-column">
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
    <div class="footer-glow"></div>
  </div>
</template>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.h-16 { height: 4rem; }

.logo-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background-color: rgba(80, 72, 229, 0.2); /* primary/20 */
  color: var(--primary);
}

.main-content {
  flex: 1;
  overflow: hidden;
  padding: 1rem;
}

.main-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  height: 100%;
}

@media (min-width: 1024px) {
  .main-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2rem;
  }
  .generator-column {
    grid-column: span 2 / span 2;
  }
}

.generator-column, .history-column {
  height: 100%;
  min-height: 0; /* Important for flex/grid children behavior */
  display: flex;
  flex-direction: column;
}

@media (min-width: 640px) {
  .main-content { padding: 1.5rem; }
}
@media (min-width: 1024px) {
  .main-content { padding: 2rem; }
}

.footer-glow {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(to right, transparent, var(--primary), transparent);
  opacity: 0.5;
  pointer-events: none;
}
</style>
