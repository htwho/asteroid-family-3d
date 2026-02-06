# 小行星家族 3D 軌道圖鑑  
## Asteroid Family Atlas 3D

**小行星家族 3D 軌道圖鑑（Asteroid Family Atlas 3D）** 是一個基於網頁的互動式天文視覺化工具，旨在展示太陽系中**小行星家族（Asteroid Families）**的分佈與動力學特徵。  
透過 **3D 軌道模擬** 與 **相位空間圖表**，使用者可以直觀地探索不同家族在太陽系中的空間位置、軌道形狀，以及其**固有軌道要素（Proper Elements）**的分佈關係。

---

## 🌟 功能特色（Features）

### 1. 3D 太陽系軌道模擬（3D Solar System Simulation）
- **真實比例軌道**：即時計算並繪製八大行星與被選取小行星家族的 3D 軌道  
- **空間參考系**：提供 10 AU、20 AU、30 AU 的同心圓網格與比例尺，建立直觀的距離感  
- **互動視角**：支援自由旋轉、縮放與平移，可從黃道面頂視或側視觀察軌道傾角（Inclination）

---

### 2. 互動式相位空間圖（Interactive Phase Space Plots）
- **雙圖表聯動**：側邊欄提供兩個關鍵動力學相位圖  
  - **a vs e**：半長軸（Semi-major Axis）vs 偏心率（Eccentricity）  
  - **a vs i**：半長軸（Semi-major Axis）vs 軌道傾角（Inclination）  
- **即時視覺回饋**：滑鼠懸停（Hover）與點擊（Click）會同步高亮顯示，並即時更新主畫面的 3D 軌道

---

### 3. 智慧搜尋與詳細數據（Search & Data）
- **快速檢索**：支援透過家族名稱（如 *Eos*、*Vesta*）或家族 ID 進行即時搜尋  
- **詳細資訊顯示**：  
  - 家族成員數（Number of Members）  
  - 母體（Parent Body）ID  
  - 核心固有軌道要素（Proper Elements）

---

### 4. 響應式設計（Responsive Web Design, RWD）
- 自動適應桌面與行動裝置螢幕  
- 動態調整版面配置（主畫面 : 側邊欄 ≈ **3 : 2**）

---

## 🛠️ 技術堆疊（Tech Stack）

- **核心技術**：HTML5, CSS3, Vanilla JavaScript (ES6+)  
- **視覺化引擎**：Plotly.js（WebGL 加速）  
- **資料格式**：JSON（Derived from NASA PDS Small Bodies Node）  
- **字型與圖示**：  
  - Google Fonts：Noto Sans TC, Roboto Mono  
  - Font Awesome

