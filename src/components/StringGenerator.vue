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
  <div class="bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-gray-200 dark:border-border-dark p-6 sm:p-8 transition-colors duration-300">
    <!-- Result Display -->
    <div class="mb-8 flex flex-col gap-4">
      <div class="flex justify-between items-end">
        <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Generated String</label>
        <span 
          v-if="copied"
          class="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-md animate-pulse"
        >
          Copied!
        </span>
      </div>
      
      <div class="relative group">
        <div class="w-full bg-background-light dark:bg-[#15151a] border border-gray-200 dark:border-[#333] rounded-xl p-5 sm:p-6 flex items-center justify-between gap-4 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50">
          <span 
            class="font-mono text-2xl sm:text-3xl text-primary break-all dark:text-primary-glow dark:drop-shadow-[0_0_8px_rgba(129,140,248,0.4)] selection:bg-primary selection:text-white truncate"
          >
            {{ generatedString }}
          </span>
          <button 
            @click="copyToClipboard"
            class="shrink-0 p-2.5 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/10 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 transition-colors tooltip" 
            title="Copy to Clipboard"
          >
            <span class="material-symbols-outlined text-[24px]">content_copy</span>
          </button>
        </div>
        <!-- Decorative glow -->
        <div class="absolute -inset-0.5 bg-primary/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500 -z-10 hidden dark:block"></div>
      </div>

       <!-- Strength Meter -->
        <div class="flex flex-col gap-2 mt-2">
            <div class="flex justify-between text-sm">
                <span class="font-medium text-slate-600 dark:text-slate-300">Entropy Strength</span>
                <span class="font-bold" :class="strength.class">{{ strength.label }}</span>
            </div>
            <div class="h-2 w-full bg-slate-100 dark:bg-[#2a2938] rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500 ease-out" :class="strength.bg" :style="{ width: strength.width }"></div>
            </div>
        </div>
    </div>

    <!-- Controls Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
      <!-- Length Slider -->
      <div class="col-span-1 md:col-span-2">
        <div class="flex justify-between items-center mb-4">
          <label class="text-base font-semibold text-gray-900 dark:text-white">Length</label>
          <span class="px-3 py-1 rounded-md bg-primary/10 text-primary font-mono font-bold text-lg">{{ length }}</span>
        </div>
        <div class="relative w-full h-6 flex items-center">
            <input 
                v-model.number="length"
                type="range" 
                min="6" 
                max="64"
                class="w-full h-1 bg-gray-200 dark:bg-[#3e3d52] rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-0 accent-primary z-10 slider-thumb"
            />
        </div>
        <div class="flex justify-between text-xs text-gray-400 mt-2 font-mono">
          <span>6</span>
          <span>64</span>
        </div>
      </div>

      <!-- Options -->
      <div class="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Uppercase -->
        <label class="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-[#2a2938] bg-gray-50 dark:bg-[#1a1a20] cursor-pointer hover:border-primary/50 dark:hover:border-primary/50 transition-colors group">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#2a2938] flex items-center justify-center text-gray-600 dark:text-gray-400 font-bold group-hover:text-primary transition-colors">A</span>
            <span class="text-gray-900 dark:text-white font-medium">Uppercase</span>
          </div>
          <div class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="includeUppercase" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-[#3e3d52] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
          </div>
        </label>

        <!-- Lowercase -->
        <label class="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-[#2a2938] bg-gray-50 dark:bg-[#1a1a20] cursor-pointer hover:border-primary/50 dark:hover:border-primary/50 transition-colors group">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#2a2938] flex items-center justify-center text-gray-600 dark:text-gray-400 font-bold group-hover:text-primary transition-colors">a</span>
            <span class="text-gray-900 dark:text-white font-medium">Lowercase</span>
          </div>
          <div class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="includeLowercase" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-[#3e3d52] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
          </div>
        </label>

        <!-- Numbers -->
        <label class="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-[#2a2938] bg-gray-50 dark:bg-[#1a1a20] cursor-pointer hover:border-primary/50 dark:hover:border-primary/50 transition-colors group">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#2a2938] flex items-center justify-center text-gray-600 dark:text-gray-400 font-bold group-hover:text-primary transition-colors">1</span>
            <span class="text-gray-900 dark:text-white font-medium">Numbers</span>
          </div>
          <div class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="includeDigits" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-[#3e3d52] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
          </div>
        </label>

        <!-- Symbols -->
        <label class="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-[#2a2938] bg-gray-50 dark:bg-[#1a1a20] cursor-pointer hover:border-primary/50 dark:hover:border-primary/50 transition-colors group">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#2a2938] flex items-center justify-center text-gray-600 dark:text-gray-400 font-bold group-hover:text-primary transition-colors">#</span>
            <span class="text-gray-900 dark:text-white font-medium">Symbols</span>
          </div>
          <div class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="includeSymbols" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-[#3e3d52] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
          </div>
        </label>
      </div>
    </div>

    <!-- Generate Button -->
    <div class="mt-8">
      <button 
        @click="generate"
        class="group relative w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-lg dark:shadow-neon overflow-hidden"
      >
        <span class="material-symbols-outlined transition-transform duration-300 group-hover:rotate-12">bolt</span>
        <span class="text-lg tracking-wide">GENERATE</span>
        <div class="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine"></div>
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes shine {
    100% {
        left: 125%;
    }
}
.animate-shine {
    animation: shine 1s;
}
</style>
