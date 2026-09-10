<p align="center">
    <img src="asset/logo.svg" height="120">
</p>

<h1 align="center">Github Readme Activity Graph</h1>

<p align="center">GitHub の直近の活動をグラフ画像で返すサービス。</p>

[Ashutosh00710/github-readme-activity-graph](https://github.com/Ashutosh00710/github-readme-activity-graph) のフォークです。
自前でホストしているため、共用インスタンスのレート制限や停止の影響を受けません。

配信先: `https://graph.routersys.com`

## 使い方

README に画像として貼るだけです。

```markdown
![](https://graph.routersys.com/graph?username=routersys)
```

実際に使っている指定はこちらです。

```markdown
<div align="center">
<img src="https://graph.routersys.com/graph?username=routersys&bg_color=121110&color=e9e4d8&line=c73e2d&point=8f887a&area=true&area_color=c73e2d&hide_border=true" width="95%" />
</div>
```

配色を一括で指定するなら `theme` が手軽です。一覧とプレビューは
[`https://graph.routersys.com`](https://graph.routersys.com) で確認できます。

```markdown
![](https://graph.routersys.com/graph?username=routersys&theme=github-dark)
```

## パラメータ

| 名前 | 例 | 内容 |
|---|---|---|
| `username` | `routersys` | **必須。** 対象のアカウント |
| `theme` | `github-dark` | 配色の一括指定。既定は `default` |
| `bg_color` | `121110` | 背景色。`#` は不要 |
| `color` | `e9e4d8` | 文字色 |
| `title_color` | `e9e4d8` | 見出しの色。省略時は `color` を使う |
| `line` | `c73e2d` | 折れ線の色 |
| `point` | `8f887a` | 点の色 |
| `area` | `true` | 折れ線の下を塗る |
| `area_color` | `c73e2d` | 塗りの色 |
| `border_color` | `8f887a` | 枠線の色 |
| `hide_border` | `true` | 枠線を消す |
| `hide_title` | `true` | 見出しを消す |
| `custom_title` | `活動` | 見出しを差し替える |
| `radius` | `8` | 角丸。0〜16 |
| `height` | `420` | 高さ。200〜600。既定 420 |
| `days` | `31` | 表示日数。1〜90。既定 31 |
| `from` / `to` | `2026-01-01` | 期間指定。両方が有効なときだけ効き、`days` より優先される |
| `grid` | `false` | 目盛り線を消す |

色は `#` を付けずに 16 進で指定します（`bg_color=121110`）。

## 本家との差分

`src/main.ts` に静的ファイルの配信を追加しています。

本家は Vercel 上で動く前提のため、`index.html` や `script.js` はプラットフォームが
配信していました。自前でホストすると Express がこれらを配らないので、トップページが
見出しだけの状態になります。

ルート全体を `express.static` で公開していないのは、デプロイ時にアプリのルートへ
生成される `.env` に GitHub のトークンが入っており、`/.env` で読めてしまうためです。
`index.html` `script.js` `styles.css` と `asset/` だけを明示的に配っています。

## 運用

| 項目 | 値 |
|---|---|
| 公開 | `graph.routersys.com`（Cloudflare Tunnel 経由） |
| デプロイ | Coolify。このリポジトリへの push で自動更新 |
| 環境変数 | `TOKEN`（GitHub のアクセストークン） |

`TOKEN` は GitHub の GraphQL API が認証必須のために要ります。公開されている貢献データを
読むだけならスコープは不要で、非公開リポジトリへの貢献も含めたい場合のみ `read:user` を付けます。

**`TOKEN` を変えたときは再デプロイが必要です。** Coolify は環境変数をビルド時にも
イメージへ埋め込むため、保存しただけでは稼働中のコンテナに届きません。

## 開発

```sh
npm ci
npm run build     # tsc -> dist/
npm start         # node dist/main.js
npm test
```

`PORT` を指定しなければ 5100 番で待ち受けます。

## ライセンス

MIT。本家の [LICENSE](LICENSE) を継承します。
