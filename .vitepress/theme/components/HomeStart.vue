<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'
import { Lunar } from 'lunar-javascript'
import NavGrid from './NavGrid.vue'
import HomeFooter from './HomeFooter.vue'

// --- 辅助函数：随机获取 ---
const getRandomItem = (item) => {
  if (Array.isArray(item) && item.length > 0) {
    // 如果是数组，随机取一个
    const index = Math.floor(Math.random() * item.length)
    return item[index]
  }
  // 如果是字符串或空的，直接返回
  return item || ''
}

// --- 1. 配置读取 ---
const { theme } = useData()
const pageConfig = computed(() => {
  const config = theme.value.startPage || {}
  return {
    title: config.title || '秋雨夜眠',
    // 这里保持原始数据（可能是字符串，也可能是数组）
    bgImageRaw: config.bgImage,
    bgImageMobileRaw: config.bgImageMobile,
    bgVideo: config.bgVideo || '' 
  }
})

// --- 2. 核心逻辑：计算最终显示的图片 ---
const wrapperStyle = computed(() => {
  // 视频优先级最高
  if (pageConfig.value.bgVideo) return {}

  // 1. 获取电脑端图片
  const pcImg = getRandomItem(pageConfig.value.bgImageRaw)
  
  // 2. 获取手机端图片 (如果没有配置手机端，就去电脑端池子里随机抽一张)
  const mobileImg = getRandomItem(pageConfig.value.bgImageMobileRaw || pageConfig.value.bgImageRaw)

  return { 
    '--bg-pc': `url(${pcImg})`,
    '--bg-mobile': `url(${mobileImg})`
  }
})

// --- 状态定义 ---
const timeStr = ref('00:00:00')
const dateStr = ref('')
const lunarStr = ref('')
const searchText = ref('')
const currentEngineKey = ref('google') 
const isMenuOpen = ref(false)

// --- 搜索引擎配置 ---
const engines = {
  baidu: { 
    name: '百度', 
    url: 'https://www.baidu.com/s?wd=', 
    placeholder: '百度一下...',
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12.35 2.05c.875.98.71 3.518.71 3.518l-1.07 1.05s-2.046.223-2.827-.798c-.78-1.02-.278-3.085-.278-3.085s.893-.895 1.54-.895c.647 0 1.925.21 1.925.21zm4.722 2.417c1.336.85 2.067 3.568 2.067 3.568l-1.485.83s-1.896-.708-2.35-2.222c-.454-1.512.443-3.23.443-3.23s1.082-.284 1.325.21v.844zm-9.922.385c-1.28.67-3.033 2.863-3.033 2.863l1.107 1.306s1.618-.89 2.668-2.058c1.05-1.168.966-2.83.966-2.83s-.84-.53-1.708.72zm5.82 5.086s.222-1.956-1.57-2.042c-2.368-.11-2.022 1.96-2.022 1.96H8.293s-.302-3.13 2.693-3.64c2.812-.48 4.296 1.83 4.296 3.692 0 3.328-3.923 3.65-3.923 3.65v.69c1.996.126 4.382 1.702 3.233 4.54-1.074 2.65-4.225 2.128-4.996 1.91-2.905-.815-2.03-3.618-2.03-3.618h1.082s-.27 2.165 1.78 2.378c2.404.25 2.76-2.257 2.76-2.257-.06-2.584-3.522-2.336-3.522-2.336v-1.12s3.682.35 3.682-3.807z"/></svg>`
  },
  google: { 
    name: 'Google', 
    url: 'https://www.google.com/search?q=', 
    placeholder: 'Google Search...',
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>`
  },
  bing: { 
    name: 'Bing', 
    url: 'https://www.bing.com/search?q=', 
    placeholder: '微软 Bing 搜索...',
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M4.6 2.5l-.2 1.4v14.4l7.9 4.3 1.3-4.1 6.8-3.9-3.1-1.3-2.9 1.7-.1-9.9-6.3-2.3H7.8zm6.5 4.3l3.5 1.3 2.7 8.3-4.8 2.8-.2-9-1.2-3.4z"/></svg>`
  }
}

const currentEngine = computed(() => engines[currentEngineKey.value])

// --- 逻辑函数 ---
const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value
const selectEngine = (key) => {
  currentEngineKey.value = key
  isMenuOpen.value = false
}
const closeMenu = (e) => {
  if (!e.target.closest('.engine-selector')) isMenuOpen.value = false
}
const handleSearch = () => {
  if (!searchText.value.trim()) return
  const target = currentEngine.value.url + encodeURIComponent(searchText.value)
  window.open(target, '_blank')
}
const updateTime = () => {
  const now = new Date()
  timeStr.value = now.toLocaleTimeString('en-GB', { hour12: false })
  const month = now.getMonth() + 1
  const day = now.getDate()
  const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  dateStr.value = `${month}月${day}日 ${weeks[now.getDay()]}`
  try {
    const lunar = Lunar.fromDate(now)
    lunarStr.value = `农历${lunar.getMonthInChinese()}月${lunar.getDayInChinese()} · ${lunar.getYearInGanZhi()}年`
  } catch (e) {}
}

let timer = null
onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  document.addEventListener('click', closeMenu)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
  document.removeEventListener('click', closeMenu)
})
</script>

<template>
  <div class="start-page-wrapper" :style="wrapperStyle">
    
    <video 
      v-if="pageConfig.bgVideo" 
      class="bg-video" 
      autoplay 
      loop 
      muted 
      playsinline
    >
      <source :src="pageConfig.bgVideo" type="video/mp4" />
    </video>

    <div class="scroll-container">
      <div class="content-box">
        
        <div class="info-header">
          <h1 class="main-title">{{ pageConfig.title }}</h1>
          <div class="divider"></div>
          <div class="time-group">
            <div class="clock">{{ timeStr }}</div>
            <div class="date-row">
              <span>{{ dateStr }}</span>
              <span class="lunar-tag" v-if="lunarStr">{{ lunarStr }}</span>
            </div>
          </div>
        </div>

        <div class="search-container">
          <div class="search-bar">
            <div class="engine-selector">
              <div class="current-engine-icon" @click.stop="toggleMenu" :title="currentEngine.name">
                <span class="svg-icon" v-html="currentEngine.icon"></span>
                <span class="arrow-down" :class="{ rotate: isMenuOpen }">▼</span>
              </div>
              <transition name="fade">
                <div class="engine-dropdown" v-if="isMenuOpen">
                  <div v-for="(eng, key) in engines" :key="key" class="dropdown-item"
                    :class="{ active: key === currentEngineKey }" @click.stop="selectEngine(key)">
                    <span class="item-icon" v-html="eng.icon"></span>
                    <span class="item-name">{{ eng.name }}</span>
                  </div>
                </div>
              </transition>
            </div>
            <input type="text" class="search-input" v-model="searchText" @keyup.enter="handleSearch"
              :placeholder="currentEngine.placeholder" autofocus />
            <button class="search-btn" @click="handleSearch">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
          </div>
        </div>

        <div class="nav-grid-wrapper">
          <NavGrid />
        </div>

        <HomeFooter />

      </div>
    </div>
  </div>
</template>

<style scoped>
/* 1. 全屏背景容器 */
.start-page-wrapper {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  
  /* 电脑端默认背景变量 */
  background-image: var(--bg-pc);
  
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  z-index: 100;
  background-color: #0f172a; 
  /* 增加过渡效果，让图片切换稍微柔和一点（可选） */
  transition: background-image 0.3s;
}

/* 2. 视频背景样式 */
.bg-video {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  z-index: 0;
}

/* 3. 背景遮罩 */
.start-page-wrapper::before { 
  content: ''; 
  position: absolute; 
  inset: 0; 
  background: rgba(0, 0, 0, 0.3); 
  z-index: 1; 
  pointer-events: none;
}

/* 4. 内容容器 */
.scroll-container {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  justify-content: center;
}

/* 以下样式保持不变 */
.content-box { 
  width: 100%; max-width: 900px; 
  padding: 60px 20px 20px 20px; 
  display: flex; flex-direction: column; gap: 40px; 
  color: #fff; 
  min-height: 100%; 
}
.info-header { display: flex; align-items: center; justify-content: center; text-shadow: 0 2px 10px rgba(0,0,0,0.5); animation: fadeIn 0.8s ease-out; }
.main-title { font-size: 3.5rem; font-weight: 800; margin: 0; line-height: 1; letter-spacing: 2px; }
.divider { width: 3px; height: 70px; background: rgba(255,255,255,0.8); margin: 0 30px; border-radius: 2px; }
.time-group { text-align: left; }
.clock { font-size: 3rem; font-weight: 700; line-height: 1.1; font-variant-numeric: tabular-nums; }
.date-row { font-size: 1rem; opacity: 0.95; margin-top: 5px; font-weight: 500; }
.lunar-tag { margin-left: 10px; font-size: 0.9rem; opacity: 0.8; }
.search-container { width: 100%; max-width: 700px; margin: 0 auto; animation: fadeIn 1s ease-out; }
.search-bar { position: relative; display: flex; align-items: center; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.25); border-radius: 16px; padding: 8px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); transition: all 0.3s ease; }
.search-bar:focus-within { background: rgba(255, 255, 255, 0.25); border-color: rgba(255,255,255,0.4); transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2); }
.engine-selector { position: relative; margin-right: 8px; }
.current-engine-icon { display: flex; align-items: center; justify-content: center; width: 46px; height: 40px; cursor: pointer; border-radius: 10px; color: rgba(255,255,255,0.9); transition: background 0.2s; }
.current-engine-icon:hover { background: rgba(255,255,255,0.15); }
.svg-icon { display: flex; align-items: center; }
.arrow-down { font-size: 8px; margin-left: 4px; opacity: 0.7; transition: transform 0.3s; }
.arrow-down.rotate { transform: rotate(180deg); }
.engine-dropdown { position: absolute; top: 120%; left: 0; width: 140px; background: rgba(30, 41, 59, 0.95); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(12px); border-radius: 12px; padding: 6px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); z-index: 50; }
.dropdown-item { display: flex; align-items: center; padding: 10px 12px; border-radius: 8px; cursor: pointer; color: #cbd5e1; font-size: 14px; transition: all 0.2s; }
.dropdown-item:hover { background: rgba(255,255,255,0.1); color: #fff; }
.dropdown-item.active { background: #3b82f6; color: #fff; }
.item-icon { margin-right: 10px; display: flex; align-items: center; }
.search-input { flex: 1; background: transparent; border: none; color: #fff; font-size: 1.1rem; padding: 0 10px; outline: none; }
.search-input::placeholder { color: rgba(255,255,255,0.5); }
.search-btn { width: 42px; height: 42px; border: none; background: transparent; color: #fff; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
.search-btn:hover { background: rgba(255,255,255,0.2); }
.nav-grid-wrapper { animation: fadeIn 1.2s ease-out; flex: 1; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-8px); }

@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 768px) {
  /* 手机端切换变量 */
  .start-page-wrapper {
    background-image: var(--bg-mobile) !important;
  }

  .info-header { flex-direction: column; text-align: center; }
  .divider { width: 60px; height: 2px; margin: 20px 0; }
  .time-group { text-align: center; }
  .main-title { font-size: 2.5rem; }
  .search-container { width: 95%; }
}
</style>