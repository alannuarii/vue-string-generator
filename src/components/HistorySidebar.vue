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
  <div class="card sidebar-container">
    <div class="sidebar-header">
      <h3 class="flex items-center gap-2">
        <span class="material-symbols-outlined icon-muted">history</span>
        History
      </h3>
      <button 
        @click="$emit('clear')"
        class="btn-text"
      >
        Clear All
      </button>
    </div>
    
    <div class="history-list history-scroll">
        <div v-if="history.length === 0" class="empty-state">
            No history yet. Generate some strings!
        </div>

      <div 
        v-for="item in history" 
        :key="item.id"
        class="history-item group"
      >
        <div class="item-content">
          <p class="history-text">{{ item.text }}</p>
          <p class="history-meta">{{ item.text.length }} chars • {{ getStrengthLabel(item.text) }}</p>
        </div>
        <button 
          @click="$emit('copy', item.text, item.id)"
          class="btn-copy-sm"
          title="Copy"
        >
          <span class="material-symbols-outlined text-[18px]">content_copy</span>
        </button>
      </div>
    </div>
    
    <div class="sidebar-footer">
      <button 
        @click="$emit('copy-all')"
        class="btn-secondary w-full"
      >
        <span class="material-symbols-outlined text-[18px]">file_copy</span>
        Copy All History
      </button>
    </div>
  </div>
</template>

<style scoped>
.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0; 
  overflow: hidden;
}

.sidebar-header {
  flex-shrink: 0;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

html.dark .sidebar-header {
  border-color: var(--border-dark);
}

.icon-muted {
  color: var(--text-muted-light);
}

html.dark .icon-muted {
  color: var(--text-muted-dark);
}

.btn-text {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-muted-light);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.btn-text:hover { color: var(--primary); }

html.dark .btn-text { color: var(--text-muted-dark); }
html.dark .btn-text:hover { color: white; }

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.empty-state {
  padding: 1rem;
  text-align: center;
  color: var(--text-muted-light);
  font-size: 0.875rem;
}

.item-content {
  min-width: 0;
  flex: 1;
}

.history-text {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-meta {
  font-size: 0.625rem; /* 10px */
  color: var(--text-muted-light);
  margin-top: 0.25rem;
}

html.dark .history-meta { color: var(--text-muted-dark); }

.btn-copy-sm {
  opacity: 0;
  padding: 0.375rem;
  border-radius: 0.375rem;
  color: var(--text-muted-light);
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.group:hover .btn-copy-sm { opacity: 1; }

.btn-copy-sm:hover {
  color: var(--primary);
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

html.dark .btn-copy-sm:hover {
  background-color: #333;
  color: white;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-light);
  background-color: #f9fafb;
  border-bottom-left-radius: var(--radius-xl);
  border-bottom-right-radius: var(--radius-xl);
}

html.dark .sidebar-footer {
  border-color: var(--border-dark);
  background-color: #1a1a20;
}

.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  color: var(--text-muted-light);
  background-color: transparent;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: white;
}

html.dark .btn-secondary {
  border-color: #333;
  color: var(--text-muted-dark);
}

html.dark .btn-secondary:hover {
  background-color: #25252e;
}
</style>
