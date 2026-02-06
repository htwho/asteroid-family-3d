
# 小行星家族 3D 軌道圖鑑（Asteroid Family Atlas 3D）

### 專案簡介
**小行星家族 3D 軌道圖鑑（Asteroid Family Atlas 3D）** 是一個基於網頁的互動式天文視覺化工具，旨在展示太陽系中小行星家族（Asteroid Families的分佈與動力學特徵。  
透過 **3D 軌道模擬** 與 **相位空間（Phase Space）圖表**，使用者可以直觀探索不同小行星家族在太陽系中的空間位置、軌道形狀，以及其**固有軌道要素（Proper Elements）**的分佈關係。


### 🌟 功能特色（Features）

#### 1. 3D 太陽系軌道模擬
- **真實比例軌道**：即時計算並繪製八大行星與所選小行星家族的 3D 軌道  
- **空間參考系**：提供 10 AU、20 AU、30 AU 的同心圓網格與比例尺  
- **互動視角**：支援旋轉、縮放與平移，可從黃道面頂視或側視觀察軌道傾角（Inclination）

#### 2. 互動式相位空間圖
- **雙圖表聯動**：
  - **a–e 圖**：半長軸（Semi-major Axis）vs 偏心率（Eccentricity）  
  - **a–i 圖**：半長軸（Semi-major Axis）vs 軌道傾角（Inclination）  
- **即時視覺回饋**：滑鼠懸停與點擊會同步高亮顯示，並即時更新主畫面的 3D 軌道

#### 3. 智慧搜尋與詳細數據
- **快速檢索**：支援以家族名稱（如 *Eos*、*Vesta*）或家族 ID 搜尋  
- **詳細資訊顯示**：家族成員數、母體 ID、核心固有軌道要素（Proper Elements）

#### 4. 響應式設計（RWD）
- 自動適應桌面與行動裝置  


### 🛠️ 技術堆疊
- **核心技術**：HTML5, CSS3, Vanilla JavaScript (ES6+)  
- **視覺化引擎**：Plotly.js（WebGL 加速）  
- **資料格式**：JSON（來源為 NASA PDS Small Bodies Node）  
- **字型與圖示**：Google Fonts（Noto Sans TC, Roboto Mono）、Font Awesome  


### 📂 資料來源

* Nesvorný, D. (2015)
* Families List from Synthetic Proper Elements
* NASA Planetary Data System (PDS) – Small Bodies Node
* 主要欄位：`family_id`, `family_name`, `a_center_au`, `e_center`, `i_center_deg`, `n_members`


---

# Asteroid Family Atlas 3D

### Overview

**Asteroid Family Atlas 3D** is a web-based interactive astronomical visualization tool designed to explore the spatial distribution and dynamical characteristics of **asteroid families** in the Solar System.
By combining **3D orbital simulations** with **phase-space diagrams**, users can intuitively investigate the spatial locations, orbital geometries, and distributions of **proper orbital elements** for different asteroid families.


### 🌟 Key Features

#### 1. 3D Solar System Simulation

* **True-scale orbits**: Real-time rendering of the eight planets and selected asteroid family orbits
* **Spatial reference grids**: Concentric distance rings at 10 AU, 20 AU, and 30 AU
* **Interactive camera**: Rotate, zoom, and pan; view orbits from top-down (ecliptic) or side perspectives

#### 2. Interactive Phase Space Plots

* **Linked plots**:

  * **a–e plot**: Semi-major axis vs eccentricity
  * **a–i plot**: Semi-major axis vs inclination
* **Synchronized interaction**: Hovering or clicking highlights points and updates the 3D orbit view in real time

#### 3. Smart Search & Data Inspection

* **Fast search** by family name (e.g., *Eos*, *Vesta*) or family ID
* **Detailed metadata**: number of members, parent body ID, and core proper elements

#### 4. Responsive Web Design

* Automatically adapts to desktop and mobile screens


### 🛠️ Tech Stack

* **Core**: HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Visualization**: Plotly.js (WebGL accelerated)
* **Data format**: JSON (derived from NASA PDS Small Bodies Node)
* **Fonts & Icons**: Google Fonts (Noto Sans TC, Roboto Mono), Font Awesome


### 📂 Data Source

* Nesvorný, D. (2015)
* *Families List from Synthetic Proper Elements*
* NASA Planetary Data System (PDS), Small Bodies Node
* Key fields: `family_id`, `family_name`, `a_center_au`, `e_center`, `i_center_deg`, `n_members`


### 📄 License

MIT License
Free to use, modify, and redistribute for research and educational purposes.

----

**Created by**: Hsuan-Ting Lai

