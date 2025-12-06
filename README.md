# 🎵 Music Eait – 簡單簡譜音樂播放器

一個使用 **TypeScript + HTML + Web Audio API** 製作的超簡單音樂播放器，  
可以直接在瀏覽器播放「數字簡譜」。

適合：

- 學音樂的人
- 想測試旋律的人
- 想寫簡單音樂的小朋友（像作者 😎）

不用安裝、開網頁輸入簡譜就能聽。

---

# 🎼 支援語法 (Syntax)

| 符號 | 意義 |
|------|------|
| `1~7` | 音符（Do~Si） |
| `.` | 拍數提高 **1.5 倍（附點音符）** |
| `,` | 降一個八度 |
| `'` | 升一個八度 |
| `^` | 拍數 **除以 2（變短）** |
| `-` | 拍數 **乘以 2（變長）** |
| `0` | 休止符（不發聲） |

📌 一個音符可以包含多個修飾符  
例如：

1'. → 升一八度 + 附點
3^. → 拍數 /2 再 *1.5
5--- → 拍數 *2 *2 *2


把它貼到播放器裡即可播放。

---

# 🛠️ 使用方式（How to Use）

1. 打開 `index.html`  
   - 在瀏覽器直接開即可
   - 或者使用 GitHub Pages 網址

2. 在文字框輸入簡譜  
   例如：


---

# 📁 專案內容 (Project structure)

- `index.html` – 網頁介面
- `index.ts / index.js` – 播放邏輯
- 使用 Web Audio API 產生聲音

---

# ✅ 已完成功能 (Features)

- 播放數字簡譜
- 八度控制
- 附點音符
- 延長 / 縮短拍數
- 休止符

---

# 🔧 待開發 (TODO)

例如：

- 多聲部
- 匯出 wav
- 速度控制
- 更漂亮 UI
- 鍵盤彈奏

---

# ❤️ 作者 (Author)

這個專案由 **一位 10 歲的小程式設計師** 製作  
如果你喜歡：

⭐ 請給個 star  
🐛 有 bug 請開 issue  

---

# 🌍 English Version

# Music Eait – Simple Numbered Music Player

This is a very simple browser-based numbered musical notation player  
built with TypeScript, HTML and Web Audio API.

Useful for:

- music learners
- testing melodies
- kids who want to compose music

No installation required.

---

## Syntax

| Symbol | Meaning |
|--------|---------|
| `1~7` | Notes (Do~Si) |
| `.` | dotted note (time ×1.5) |
| `,` | lower one octave |
| `'` | higher one octave |
| `^` | half duration |
| `-` | double duration |
| `0` | rest |

Example:

1'. → up one octave + dotted
3^. → half duration then ×1.5
5--- → duration ×2 ×2 ×2


---

## How to use

# 🛠️ How to Use

1. Open `index.html`
   - just open it in your browser
   - or use the GitHub Pages link

2. Type numbered music notation in the text box  
   Example:


---

If you like this project:

⭐ please star  
🐛 open an issue if something is wrong



```
3^ 5^ 5^ 5^ 5- 6^ 1' 6^ 5-
5^ 5'^ 5'^ 3'^ 3'^ 2'^ 1'^ 2'^ 2'---



