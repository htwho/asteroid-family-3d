# 小行星家族 3D 軌道圖鑑

以 Plotly.js 製作的互動式天文視覺化，呈現 122 個小行星家族的代表軌道，以及固有半長軸、偏心率與傾角的分布。

> 線上展示：啟用 GitHub Pages 後，請將網址補在這裡。

## 功能

- 旋轉、縮放和平移太陽系 3D 軌道圖
- 聯動的 a–e 與 a–i 相位空間圖
- 依家族名稱或 ID 搜尋，支援鍵盤操作
- 依主小行星帶、Hilda 與 Trojan 區域篩選資料
- 同時比較兩個家族的軌道與固有軌道要素
- 可切換並記住明亮／灰暗顯示主題
- 顯示家族中心固有軌道要素、成員數和母體 ID
- 適用於桌面與行動裝置

## 本機執行

此專案不需安裝依賴或進行建置。由於瀏覽器不允許網頁直接透過 `file://` 讀取 JSON，請在專案目錄啟動本機伺服器：

```bash
python3 -m http.server 8000
```

接著開啟 <http://localhost:8000>。

若要執行軌道計算測試：

```bash
npm test
```

測試只使用 Node.js 內建測試工具，不會下載套件。

## 操作方式

1. 在右側散點圖點選一個家族，或在頁首搜尋名稱／ID。
2. 使用 Region 篩選資料，再從 Compare with 選擇第二個家族進行比較。
3. 拖曳 3D 圖旋轉視角，使用滾輪縮放；View 與 Display 選單可快速調整畫面。
4. 將游標移到圖形上查看資料；所選家族會在三張圖中同步標示。

## 專案結構

```text
.
├── index.html                  # 頁面結構
├── css/styles.css              # 版面與響應式樣式
├── js/
│   ├── app.js                  # 初始化與應用程式狀態
│   ├── data.js                 # 資料載入與驗證
│   ├── orbit.js                # 軌道計算與 3D traces
│   ├── plots.js                # 相位空間圖
│   └── search.js               # 搜尋與鍵盤操作
├── test/orbit.test.js          # 軌道計算測試
└── asteroid_families.json      # 家族資料與來源 metadata
```

## 資料來源

資料取自 NASA Planetary Data System Small Bodies Node：

- Nesvorný, D. (2015), *Families List from Synthetic Proper Elements*
- PDS logical identifier：`urn:nasa:pds:ast.nesvorny.families:data:familylist_tab`
- 本專案所附資料版本：1.1
- 資料集 metadata 記錄更新日期：2024-11-12

主要欄位包括 `family_id`、`family_name`、`a_center_au`、`e_center`、`i_center_deg` 與 `n_members`。原始資料以負值表示缺少可用軌道要素的 sentinel 記錄，載入時會保留原始 JSON、但不將這類記錄送入圖表。更換資料時，請保留 `asteroid_families.json` 的 `metadata`、`columns` 和 `families` 結構，並執行 `npm test` 與 `npm run check:data`。

## 模型限制

圖中的小行星家族軌道是依據家族中心半長軸、偏心率與傾角繪製的示意性代表軌道。計算假設升交點經度 Ω 與近心點幅角 ω 均為 0，因此：

- 不代表家族所有成員的實際軌道；
- 不代表特定曆元下天體的實際空間位置；
- 不應用於精密星曆或軌道預報。

## 開發與貢獻

請參閱 [CONTRIBUTING.md](CONTRIBUTING.md)。提交變更前請執行 `npm test`；GitHub Actions 也會驗證測試、JSON 格式及必要資料欄位。

## 引用與授權

引用本專案時可使用 [CITATION.cff](CITATION.cff) 提供的資訊，並同時引用上方的原始 PDS 資料集。

程式碼採用 [MIT License](LICENSE) 授權。原始科學資料的使用條件以 NASA PDS 發布內容為準。
