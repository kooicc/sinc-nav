import { defineConfig } from 'vitepress'
import Unocss from 'unocss/vite'

export default defineConfig({
  title: "秋雨夜眠-导航页",
  head: [
    ['link', { rel: 'icon', href: '/assets/home/avatar.webp' }],
  ],
  vite: {
    plugins: [
      Unocss() 
    ]
  },

  themeConfig: {
    // @ts-ignore
    startPage: {
      title: "秋雨夜眠-导航页",
      
      // 👇 1. 如果这里有视频链接，会优先播放视频（覆盖掉图片）
      //      如果要测试双端壁纸效果，请先暂时注释掉这行视频
      // bgVideo: "/assets/bg/dynamic/bg-05.mp4", 
      bgVideo: "", 

      // 👇 2. 电脑端壁纸 (PC)
      //bgImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
      bgImage: [
        // "/assets/bg/static/d22.webp",
        // "/assets/bg/static/d1.webp",
        // "/assets/bg/static/d14.webp",
        // "/assets/bg/static/d6.webp",
        // "/assets/bg/static/d5.webp",
        // "https://img.nw177.cn/blog/00.background/bg73.webp",
        "https://bing.ee123.net/img",
        // "https://api.img.nw177.cn/api",
        
      ],

      // 👇 3. 新增：手机端壁纸 (Mobile)
      //      你可以填入另一张图片的链接，或者本地路径如 "/assets/bg-mobile.jpg"
      bgImageMobile: [
        // "/assets/bg/static-mobile/m8.webp",
        // "/assets/bg/static-mobile/m6.webp",
        // "/assets/bg/static-mobile/m3.webp",
        // "/assets/bg/static-mobile/m1.webp",   
        "https://api.img.nw177.cn/m-api",
      ], 
    },

    // 👇 2. 页脚配置
    footer: {
      // @ts-ignore
      author: "十三",
      siteName: "秋nav.244056614.xyz",
      siteUrl: "https://秋nav.244056614.xyz",
      poem: "终不似 少年游"
    },

    // ... 原有配置 ...
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})