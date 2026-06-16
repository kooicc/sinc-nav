<script setup>
import DefaultTheme from 'vitepress/theme'
import { ref, onMounted, onUnmounted } from 'vue'

const { Layout } = DefaultTheme

// --- 时钟逻辑 ---
const timeStr = ref('')
const dateStr = ref('')
let timer = null

const updateTime = () => {
  const now = new Date()
  timeStr.value = now.toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  dateStr.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="min-h-screen w-full bg-cover bg-center bg-fixed custom-bg">
    <div class="min-h-screen w-full bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-900/20 pt-16 flex flex-col items-center">
      
      <div class="w-full max-w-6xl px-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in select-none">
        
        <div class="text-center md:text-left">
          <h1 class="site-title text-4xl md:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-blue-300 drop-shadow-lg">
            导航页
          </h1>
          <p class="text-sm text-gray-400 mt-2 tracking-[0.2em] uppercase opacity-80 hidden md:block">
            Personal Dashboard
          </p>
        </div>

        <div class="flex flex-col items-center md:items-end">
          <div class="clock-time text-5xl md:text-6xl font-bold text-white tracking-wide drop-shadow-xl leading-none">
            {{ timeStr || '00:00:00' }}
          </div>
          
          <div class="mt-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 backdrop-blur-sm">
            <p class="text-sm md:text-base text-gray-300 font-medium tracking-widest">
              {{ dateStr }}
            </p>
          </div>
        </div>

      </div>

      <div class="w-full max-w-7xl px-6 mb-8">
        <div class="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>

      <div class="w-full max-w-7xl px-4 pb-20">
        <Content />
      </div>
      
    </div>
  </div>
</template>

<style>
/* 引入字体 */
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@500;700&display=swap');

.custom-bg {
  /* 背景图 */
  background-image: url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop');
}

.site-title {
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  -webkit-font-smoothing: antialiased; 
}

.clock-time {
  font-family: 'Rubik', sans-serif;
  font-variant-numeric: tabular-nums; /* 数字等宽，防止抖动 */
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.VPNav, .VPFooter, .VPLocalNav { display: none !important; }
.VPContent { padding: 0 !important; }
</style>