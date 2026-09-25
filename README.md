# 星域戦記 (Pick Duel) — オフライン版

5枚の防衛線をめぐるカードバトルゲーム

ビルド: pick-duel-v79（HTML内の meta[name=build] とは別管理。配布物のバージョンはこの値で統一）

## セットアップ（GitHub Pages）

1. リポジトリを作成（例: pick-duel、Public）
2. 以下の3ファイルをそのままpush（ファイル名を変えない）
```
pick_duel_package/
├── index.html
├── sw.js
└── README.md
```
3. Settings → Pages → Deploy from branch → main → Save
4. `https://ユーザー名.github.io/リポジトリ名` にアクセス

## iPhoneで遊ぶ

1. Safari で上のURLを開く
2. シェアボタン → 「ホーム画面に追加」
3. 一度ホーム画面から起動する（この起動でService Workerが登録される）
4. 以降、機内モードでも遊べます

## キャッシュと更新の仕組み

- HTML本体: **network-first** — 起動のたびにまずサーバーへ取りに行き、取れたら常に最新版を表示。オフラインの時だけキャッシュにフォールバック。
- それ以外（sw.js自身など）: **cache-first** — 一度取得したら使い回し、オフラインでも動く。
- 新しいindex.htmlをpushしたら、次に起動した瞬間から新版が表示されます（旧版のように2回アクセスが必要、ということはありません）。
- CACHE_NAME はこのREADME冒頭の「ビルド」表記と常に一致させています。ズレていたら要注意（sw.jsの中身を確認）。

## 進行状況の保存

ゲーム内の対局はlocalStorageに自動保存されます。誤ってリロードしても、ホーム画面のアプリを再度開けば続きから再開できます。

## キャッシュをクリアしたい

iPhone設定 → Safari → 履歴とWebサイトデータを削除

---

開発: Koki
