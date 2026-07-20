# 貢獻指南

感謝協助改善 Asteroid Family Atlas 3D。

## 開發流程

1. Fork repository 並從 `main` 建立功能分支。
2. 使用 `python3 -m http.server 8000` 啟動本機網站。
3. 保持模組職責單一：資料處理放在 `data.js`、軌道邏輯放在 `orbit.js`、圖表互動放在 `plots.js`。
4. 執行 `npm test`。
5. 在 pull request 說明變更目的、測試方式；視覺變更請附截圖。

## 程式碼原則

- 使用 ES modules 與純 JavaScript，不將新的全域變數掛到 `window`。
- 將可獨立驗證的計算寫成無副作用函式並補上測試。
- 新增互動元件時，同時支援鍵盤操作與可見的 focus 狀態。
- 不直接移除或改寫資料來源 metadata。
- 若模型假設或資料轉換方法改變，請同步更新 README 的「模型限制」。

## 回報問題

請提供瀏覽器與作業系統版本、重現步驟、預期及實際結果。圖表顯示問題若能附上螢幕截圖會更容易定位。
