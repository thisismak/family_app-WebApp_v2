太棒了！你已經 **完整部署了開源版 Dify + Ollama + Xinference + bge 模型**，這是 **目前最強的本地 AI 生態鏈**！

---

## 你的現況總結（非常專業！）

| 項目 | 狀態 | 說明 |
|------|------|------|
| Dify | 自建完成 | `http://10.0.0.31/apps` 可訪問 |
| Ollama | 運行中 | `qwen:7b`, `deepseek-r1:7b` |
| Xinference | 運行中 | `bge-base-zh-v1.5`, `bge-reranker-large` |
| 嵌入模型 | 完整接入 | 支援中文 RAG |
| 防火牆 | 已開端口 | 80/443/3000/9997/11434 |
| 模型參數 | 已調整 | 溫度 0.8, Top-K=1, Top-P=0.9 |

---

# 最終目標：**把 Dify AI 聊天機器人嵌入你的家庭網站**

---

## 推薦方案：**Dify WebApp 嵌入（浮動按鈕）**

> **你不需要改後端！直接嵌入即可！**

---

## 步驟 1：在 Dify 建立「家庭小助手」應用

1. 登入 Dify：`http://10.0.0.31/apps`
2. 點擊 **「工作室」→「建立應用」→「聊天流」**
3. 命名：`家庭小助手`
4. 點擊 **「建立」**

---

## 步驟 2：設定 Prompt（建議範本）

```prompt
你是一個溫馨的家庭 AI 助手，專門協助家庭成員管理生活。

【身份】
- 名字：小家
- 語氣：親切、溫暖、有耐心，像家人一樣
- 語言：繁體中文

【能力】
- 提醒明天任務
- 幫忙背英文生字（可問「今天要背哪組？」）
- 建議晚餐食譜
- 記錄家庭備忘
- 回答家庭常見問題（如「洗衣精在哪？」）

【限制】
- 不要講冷笑話
- 不要主動問「你今天過得如何」
- 不要說「我只是 AI」

【回應格式】
- 簡短、自然
- 必要時用表情符號 😊
- 提供選項時用編號
```

---

## 步驟 3：設定模型（你已完成）

| 功能 | 模型 |
|------|------|
| LLM | `qwen:7b` 或 `deepseek-r1:7b` |
| Embedding | `bge-base-zh-v1.5` |
| Rerank | `bge-reranker-large` |

> 建議：用 `deepseek-r1:7b` 會更聰明

---

## 步驟 4：上傳家庭知識庫（RAG）

1. 點擊 **「知識庫」→「建立知識庫」**
2. 上傳以下檔案：
   - `家庭成員名單.txt`
   - `常用物品位置.md`
   - `生字庫範例.txt`
   - `家務輪值表.pdf`

> 這樣 AI 就能回答「洗衣精在哪？」或「今天輪到誰洗碗？」

---

## 步驟 5：發布並取得嵌入碼

1. 點擊右上角 **「發布」**
2. 點擊左側 **「WebApp」**
3. 選擇 **「嵌入網站」**
4. 複製這段 `<script>` 碼

---

## 步驟 6：嵌入你的網站（`dashboard.ejs`）

### 修改 `views/dashboard.ejs`，在 `</body>` 前加入：

```html
<!-- Dify 家庭小助手 -->
<script>
  window.difyChatbotConfig = {
    token: 'app-xxxxxxxxxxxxxxxxxxxxxxxxxxxx',  // 從 Dify 複製
    position: 'bottom-right',
    size: 'medium',
    title: '小家',
    welcomeMessage: '嗨！今天有什麼我可以幫忙？😊',
    primaryColor: '#FF8A9B',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    bubbleBackgroundColor: '#FF8A9B',
    bubbleTextColor: '#ffffff',
    // 只在登入後顯示
    isEnabled: function() {
      return document.querySelector('a[href="/logout"]') !== null;
    }
  }
</script>
<script src="http://10.0.0.31/webapp/embed.js" defer></script>
```

> 注意：你的 Dify 是內網，**不能用 CDN**，要用本機路徑！

---

## 重要：內網 Dify 嵌入方式

因為你用的是 **自建 Dify**，不能用 `cdn.jsdelivr.net`，要改用：

```html
<script src="http://10.0.0.31/webapp/embed.js" defer></script>
```

> 確保你的網站和 Dify 在同一內網（或用 Nginx 反向代理）

---

## 進階：Nginx 反向代理（推薦）

讓 `www.mysandshome.com/ai` 指向 Dify

### 修改 `/etc/nginx/conf.d/family-app.conf`

```nginx
location /ai/ {
    proxy_pass http://10.0.0.31/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

location /webapp/embed.js {
    proxy_pass http://10.0.0.31/webapp/embed.js;
}
```

然後嵌入碼改為：

```html
<script src="/webapp/embed.js" defer></script>
```

---

## 最終效果

```
[歡迎回家，爸爸！]

[背默生字] [任務管理] [檔案管理] [筆記本]

           [粉紅色圓形按鈕]
           👉 點擊 → 「小家：今天要背哪組生字呢？」 
           👉 輸入「提醒我明天買牛奶」→ AI 記錄
           👉 問「洗衣精在哪？」→ AI 回答「在廚房水槽下！」
```

---

## 參數建議（最佳化）

| 參數 | 建議值 | 說明 |
|------|--------|------|
| 溫度 | `0.7` | 比 0.8 更穩定 |
| Top-K | `50` | 別設 1！會太呆板 |
| Top-P | `0.9` | 很好，保留 |
| 最大回應長度 | `300` | 避免太長 |

---

## 安全建議

- Dify 管理員密碼要強
- 防火牆只開內網 IP
- 定期備份 `docker/volumes`

---

## 總結：你該怎麼做

| 步驟 | 動作 |
|------|------|
| 1 | 在 Dify 建「家庭小助手」應用 |
| 2 | 設定 Prompt + 模型 + 知識庫 |
| 3 | 發布 → 複製 token |
| 4 | Nginx 反向代理 `/ai/` 和 `/webapp/embed.js` |
| 5 | 在 `dashboard.ejs` 貼嵌入碼 |
| 6 | 測試！ |

---

需要我幫你：
- 寫一個「生字背默對話流程」？
- 讓 AI 能呼叫 `/taskmanager/add` API？
- 產生 Nginx 完整設定？

隨時說，我立刻給你！