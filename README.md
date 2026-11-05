# 百家樂試玩資料庫｜靜態網站

網址：https://gameeee-maker.github.io/baccarat-trial-db/

## 結構
- `/`：首頁（下拉選單、快速查看視窗、教學輪轉卡片）
- `/brands/`：試玩平台總覽；`/brands/{dg,mt,t9,allbet,sa,db,wm,og}/`：品牌評測頁
- `/authors/lin-zi-xuan/`：作者頁
- `/guide/…`、`/safety/…`、`/privacy/`：教學、安全與隱私權內容頁
- `/methodology/`、`/disclosure/`、`/about/`、`/contact/`：信任頁

## 技術說明
- 樣式：`assets/css/site.css`（RWD，≤860px 使用漢堡選單）
- 互動：`assets/js/site.js`（選單、快速查看視窗、輪轉卡片、訪客留言）
- 訪客留言：API 為 Cloudflare Worker `baccarat-comments-api`，資料存於 D1 `baccarat-comments`
  - 新留言預設為 `hidden`，審核後改為 `published`
  - 禁止網址、超連結、LINE ID；使用 Turnstile 人機驗證；同一 IP 10 分鐘內最多 3 則
- 外部連結只出現在各頁「資料來源」，皆為 `rel="nofollow noopener"`
