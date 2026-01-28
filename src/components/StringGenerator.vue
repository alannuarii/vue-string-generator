<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  // No props needed if we manage state locally and emit result
});

const emit = defineEmits(['generated']);

// State
const length = ref(16);
const includeUppercase = ref(true);
const includeLowercase = ref(true);
const includeDigits = ref(true);
const includeSymbols = ref(true);

const generatedString = ref('Xk9#mP2$vL5'); // Initial placeholder
const copied = ref(false);

// Constants
const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// Logic
const calculateEntropy = (str) => {
    // Basic estimation: L * log2(N)
    let poolSize = 0;
    if (/[A-Z]/.test(str)) poolSize += 26;
    if (/[a-z]/.test(str)) poolSize += 26;
    if (/[0-9]/.test(str)) poolSize += 10;
    if (/[^A-Za-z0-9]/.test(str)) poolSize += 32;
    if (poolSize === 0) return 0;
    
    return Math.round(str.length * Math.log2(poolSize));
};

const strength = computed(() => {
    const ent = calculateEntropy(generatedString.value);
    if (ent < 50) return { label: 'Weak', class: 'text-red-500', width: '30%', bg: 'bg-red-500' };
    if (ent < 80) return { label: 'Medium', class: 'text-orange-500', width: '60%', bg: 'bg-orange-500' };
    return { label: 'Very Strong', class: 'text-emerald-500', width: '100%', bg: 'bg-emerald-500' };
});

const generate = () => {
  let charset = '';
  if (includeUppercase.value) charset += CHARS.upper;
  if (includeLowercase.value) charset += CHARS.lower;
  if (includeDigits.value) charset += CHARS.digits;
  if (includeSymbols.value) charset += CHARS.symbols;

  if (!charset) {
    // Fallback or alert
    return;
  }

  const array = new Uint32Array(length.value);
  window.crypto.getRandomValues(array);
  
  let result = '';
  for (let i = 0; i < length.value; i++) {
    result += charset[array[i] % charset.length];
  }
  
  generatedString.value = result;
  
  // Emit to parent for history
  emit('generated', {
      text: result,
      id: Date.now(),
      timestamp: Date.now()
  });
};

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(generatedString.value);
    copied.value = true;
    setTimeout(() => copied.value = false, 2000);
  } catch (e) {
    console.error(e);
  }
};

// Generate on mount
generate();
</script>

<template>
  <div class="card string-generator-card">
    <div class="generator-scroll-container">
      <!-- Result Display -->
      <div class="result-section">
        <div class="result-header">
          <label class="label">Generated String</label>
          <span 
            v-if="copied"
            class="badge-copied animate-pulse"
          >
            Copied!
          </span>
        </div>
        
        <div class="result-wrapper group">
          <div class="result-box">
            <span class="result-text truncate">
              {{ generatedString }}
            </span>
            <button 
              @click="copyToClipboard"
              class="btn-icon"
              title="Copy to Clipboard"
            >
              <span class="material-symbols-outlined text-[20px]">content_copy</span>
            </button>
          </div>
          <!-- Decorative glow -->
          <div class="glow-effect group-hover-visible hidden dark:block"></div>
        </div>

         <!-- Strength Meter -->
          <div class="strength-section">
              <div class="strength-header">
                  <span class="strength-title">Entropy Strength</span>
                  <span class="strength-label" :class="strength.class">{{ strength.label }}</span>
              </div>
              <div class="strength-track">
                  <div class="strength-bar" :class="strength.bg" :style="{ width: strength.width }"></div>
              </div>
          </div>
      </div>

      <!-- Controls Grid -->
      <div class="controls-grid">
        <!-- Length Slider -->
        <div class="length-control">
          <div class="length-header">
            <label class="label-lg">Length</label>
            <span class="length-value">{{ length }}</span>
          </div>
          <div class="slider-wrapper">
              <input 
                  v-model.number="length"
                  type="range" 
                  min="6" 
                  max="64"
                  class="range-slider"
              />
          </div>
          <div class="slider-labels">
            <span>6</span>
            <span>64</span>
          </div>
        </div>

        <!-- Options -->
        <div class="options-grid">
          <!-- Uppercase -->
          <label class="option-label group">
            <div class="option-content">
              <span class="icon-circle group-hover-active">A</span>
              <span class="option-text">Uppercase</span>
            </div>
            <div class="toggle-wrapper">
              <input type="checkbox" v-model="includeUppercase" class="sr-only">
              <div class="toggle-switch"></div>
            </div>
          </label>

          <!-- Lowercase -->
          <label class="option-label group">
            <div class="option-content">
              <span class="icon-circle group-hover-active">a</span>
              <span class="option-text">Lowercase</span>
            </div>
            <div class="toggle-wrapper">
              <input type="checkbox" v-model="includeLowercase" class="sr-only">
              <div class="toggle-switch"></div>
            </div>
          </label>

          <!-- Numbers -->
          <label class="option-label group">
            <div class="option-content">
              <span class="icon-circle group-hover-active">1</span>
              <span class="option-text">Numbers</span>
            </div>
            <div class="toggle-wrapper">
              <input type="checkbox" v-model="includeDigits" class="sr-only">
              <div class="toggle-switch"></div>
            </div>
          </label>

          <!-- Symbols -->
          <label class="option-label group">
            <div class="option-content">
              <span class="icon-circle group-hover-active">#</span>
              <span class="option-text">Symbols</span>
            </div>
            <div class="toggle-wrapper">
              <input type="checkbox" v-model="includeSymbols" class="sr-only">
              <div class="toggle-switch"></div>
            </div>
          </label>
        </div>
      </div>

      <!-- Generate Button -->
      <div class="action-section">
        <button 
          @click="generate"
          class="btn-primary group"
        >
          <span class="material-symbols-outlined group-hover-rotate text-[20px]">bolt</span>
          <span class="btn-text-lg">GENERATE</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Colors for Strength Meter - scoping locally to use dynamic classes */
.text-red-500 { color: #ef4444; }
.text-orange-500 { color: #f97316; }
.text-emerald-500 { color: #10b981; }
.bg-red-500 { background-color: #ef4444; }
.bg-orange-500 { background-color: #f97316; }
.bg-emerald-500 { background-color: #10b981; }

.string-generator-card {
  transition: background-color 0.3s, border-color 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
  min-height: 0;
}

.generator-scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 0;
}

@media (min-width: 640px) {
  .generator-scroll-container { 
    padding: 1rem;
    gap: 1rem;
  }
}

@media (min-width: 768px) {
  .generator-scroll-container { 
    padding: 1.25rem;
    gap: 1.125rem;
  }
}

.result-section {
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-muted-light);
}

html.dark .label { color: var(--text-muted-dark); }

.badge-copied {
  font-size: 0.75rem;
  font-weight: 500;
  color: #059669; /* emerald-600 */
  background-color: #d1fae5; /* emerald-100 */
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
}

html.dark .badge-copied {
  color: #34d399; /* emerald-400 */
  background-color: rgba(6, 78, 59, 0.3); /* emerald-900/30 */
}

.result-wrapper { position: relative; }

.glow-effect {
  position: absolute;
  top: -2px; left: -2px; right: -2px; bottom: -2px;
  background-color: rgba(80, 72, 229, 0.2);
  border-radius: var(--radius-lg);
  filter: blur(4px);
  opacity: 0;
  transition: opacity 0.5s;
  z-index: -10;
}

.group:hover .group-hover-visible { opacity: 1; }

.strength-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.125rem;
}

.strength-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.8125rem;
}

.strength-title {
  font-weight: 500;
  color: var(--text-muted-light);
}

html.dark .strength-title { color: var(--text-muted-dark); }

.strength-label {
  font-weight: 700;
}

.strength-track {
  height: 0.375rem;
  width: 100%;
  background-color: #f1f5f9;
  border-radius: 9999px;
  overflow: hidden;
}

html.dark .strength-track { background-color: #2a2938; }

.strength-bar {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.5s ease-out, background-color 0.3s;
}

.controls-grid {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 0.625rem;
  column-gap: 1rem;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .controls-grid { grid-template-columns: 1fr 1fr; }
}

.length-control {
  grid-column: 1 / -1;
}

.length-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.label-lg {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-main-light);
}

html.dark .label-lg { color: var(--text-main-dark); }

.length-value {
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  background-color: rgba(80, 72, 229, 0.1);
  color: var(--primary);
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.875rem;
}

.slider-wrapper {
  position: relative;
  width: 100%;
  height: 1.25rem;
  display: flex;
  align-items: center;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-muted-light);
  margin-top: 0.25rem;
  font-family: var(--font-mono);
}

.options-grid {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .options-grid { grid-template-columns: 1fr 1fr; }
}

.option-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.option-label:hover .group-hover-active {
  color: var(--primary);
}

.option-text {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-main-light);
}

html.dark .option-text { color: var(--text-main-dark); }

.toggle-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.action-section {
  margin-top: 0;
  flex-shrink: 0;
  padding-bottom: 0.25rem;
}

.group-hover-rotate {
  transition: transform 0.3s;
}

.group:hover .group-hover-rotate {
  transform: rotate(12deg);
}

.btn-text-lg {
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Custom Scrollbar */
.generator-scroll-container::-webkit-scrollbar {
  width: 6px;
}

.generator-scroll-container::-webkit-scrollbar-track {
  background: transparent;
}

.generator-scroll-container::-webkit-scrollbar-thumb {
  background-color: rgba(80, 72, 229, 0.3);
  border-radius: 20px;
}

.generator-scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: rgba(80, 72, 229, 0.5);
}

html.dark .generator-scroll-container::-webkit-scrollbar-thumb {
  background-color: rgba(129, 140, 248, 0.3);
}

html.dark .generator-scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: rgba(129, 140, 248, 0.5);
}
</style>
