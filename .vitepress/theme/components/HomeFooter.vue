<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const year = new Date().getFullYear()

// --- 读取 config.mts 中的 footer 配置 ---
const { theme } = useData()
const footerConfig = computed(() => {
  // 安全读取，如果没配置则使用默认值
  const conf = theme.value.footer || {}
  return {
    author: conf.author || '十三',
    siteName: conf.siteName || '秋nav.244056614.xyz',
    siteUrl: conf.siteUrl || '#',
    poem: conf.poem || '终不似 少年游'
  }
})
</script>

<template>
  <footer class="footer-wrapper">
    <div class="footer-content">
      <div class="footer-row">
        <span>Copyright © 1996-2026 秋雨夜眠 🏃‍♂️</span>
        <a href="https://www.cloudflare-cn.com/developer-platform/products/workers/" target="_blank" rel="noopener noreferrer" class="cf-link">
          <img 
            src="https://deploy.workers.cloudflare.com/button?type=svg" 
            alt="Cloudflare Workers" 
            class="cf-badge"
          >
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* 样式保持不变 */
.footer-wrapper {
  width: 100%;
  padding: 20px 0;
  margin-top: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 1.5s ease-out;
}

.footer-content {
  text-align: center;
  color: rgb(255, 255, 255);
  font-size: 0.9rem;
  line-height: 1.6;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.link {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
  transition: all 0.3s;
}

.link:hover {
  color: #fff;
  border-bottom-color: #fff;
}

.poem {
  font-family: "KaiTi", "楷体", serif;
  font-size: 1.1rem;
  margin-top: 5px;
  opacity: 0.9;
  color: rgba(255, 255, 255, 0.85);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .footer-content { font-size: 0.8rem; }
  .poem { font-size: 0.95rem; }
}
</style>