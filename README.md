# 百家樂試玩資料庫｜靜態網站

## 上線前必做
1. 把所有檔案中的 `https://gameeee-maker.github.io/baccarat-trial-db/` 換成正式網址（canonical、sitemap.xml、robots.txt 都會用到）。
   - 使用自訂網域：例如 `https://baccarat-trial.tw/`，並新增 `CNAME` 檔案，內容只寫網域名稱。
   - 使用 GitHub 預設網址：`https://帳號.github.io/repository名稱/`。
2. GitHub Pages 設定：Settings → Pages → Deploy from a branch → `main` / `(root)`。

## 結構
- `/`：首頁（下拉選單、快速查看視窗、教學輪轉卡片由 `assets/js/site.js` 控制）
- `/brands/`：試玩平台總覽；`/brands/{dg,mt,t9,allbet,sa,db,wm,og}/`：品牌評測頁
- `/authors/lin-zi-xuan/`：作者頁
- `/methodology/`、`/disclosure/`、`/about/`、`/contact/`：信任頁
- `/guide/…`、`/safety/…`、`/privacy/`：教學、安全與隱私權內容頁
- `404.html`：使用根目錄絕對路徑，在自訂網域下才能正確顯示樣式

## 注意
- 手機版（≤860px）使用漢堡選單；樣式集中在 `assets/css/site.css`
- 站內連結皆使用相對路徑，在預設網址與自訂網域下都能運作。
- 訪客留言目前顯示「即將開放」。靜態主機無法儲存留言，需要另外接留言後端（例如 Waline），並開啟先審後發與關鍵字過濾（LINE、網址、連結）。
- 外部連結只出現在各頁「資料來源」，皆為 `rel="nofollow noopener"`。
