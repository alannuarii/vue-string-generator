<script setup>
import { computed } from 'vue';

const props = defineProps({
  history: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['copy', 'clear', 'copy-all']);

// Format relative time (simplistic approach for demo)
const formatTime = (timestamp) => {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return 'Yesterday';
};

const getStrengthLabel = (str) => {
    // Simple heuristic again for label
    const length = str.length;
    if (length < 8) return 'Weak';
    if (length < 12) return 'Good';
    return 'Strong';
}
</script>

<template>
  <div class="bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-gray-200 dark:border-border-dark flex flex-col h-full max-h-[600px] sticky top-24">
    <div class="p-6 border-b border-gray-200 dark:border-border-dark flex items-center justify-between">
      <h3 class="font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <span class="material-symbols-outlined text-gray-400">history</span>
        History
      </h3>
      <button 
        @click="$emit('clear')"
        class="text-xs font-medium text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors"
      >
        Clear All
      </button>
    </div>
    
    <div class="flex-1 overflow-y-auto p-2 history-scroll space-y-1">
        <div v-if="history.length === 0" class="p-4 text-center text-gray-400 text-sm">
            No history yet. Generate some strings!
        </div>

      <div 
        v-for="item in history" 
        :key="item.id"
        class="group relative flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#25252e] transition-colors cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-[#333]"
      >
        <div class="min-w-0 flex-1">
          <p class="font-mono text-sm text-gray-700 dark:text-gray-300 truncate">{{ item.text }}</p>
          <p class="text-[10px] text-gray-400 mt-1">{{ item.text.length }} chars • {{ getStrengthLabel(item.text) }}</p>
        </div>
        <button 
          @click="$emit('copy', item.text, item.id)"
          class="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-gray-400 hover:text-primary hover:bg-white dark:hover:bg-[#333] transition-all shadow-sm"
          title="Copy"
        >
          <span class="material-symbols-outlined text-[18px]">content_copy</span>
        </button>
      </div>
    </div>
    
    <div class="p-4 border-t border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#1a1a20] rounded-b-xl">
      <button 
        @click="$emit('copy-all')"
        class="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-[#333] text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-white dark:hover:bg-[#25252e] transition-colors flex items-center justify-center gap-2"
      >
        <span class="material-symbols-outlined text-[18px]">file_copy</span>
        Copy All History
      </button>
    </div>
  </div>
</template>
