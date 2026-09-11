import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import { Handlers } from './handlers';

const app: Application = express();
const port = process.env.PORT || 5100;

// 本家は Vercel 上で動く前提のため、index.html などの静的ファイルは
// プラットフォームが配信していた。自前でホストすると Express がこれらを
// 配らないので、トップページが見出しだけの状態になる。
//
// ただしルート全体を express.static で公開してはいけない。デプロイ時に
// アプリのルートへ生成される .env には GitHub のトークンが入っており、
// /.env で読めてしまう。必要なものだけを明示的に配る。
const rootDir = path.join(__dirname, '..');

app.use(express.urlencoded({ extended: false }));
app.use(cors());

const handlers = new Handlers();

// オリジンが Cache-Control を返さないと、Cloudflare が .js/.css に既定で
// max-age=4時間 を付ける。push で自動デプロイしても、利用者のブラウザは
// その間古い script.js を使い続ける (実際にそれで「直したのに直らない」が起きた)。
// HTML/JS/CSS は明示的に max-age=0 を返し、毎回サーバーに問い合わせさせる。
// 変更が無ければ 304 が返るだけなので転送量はほぼ増えない。
const revalidate = { maxAge: 0, etag: true, lastModified: true };

app.get('/', (_req, res) => res.sendFile(path.join(rootDir, 'index.html'), revalidate));
app.get('/script.js', (_req, res) => res.sendFile(path.join(rootDir, 'script.js'), revalidate));
app.get('/styles.css', (_req, res) => res.sendFile(path.join(rootDir, 'styles.css'), revalidate));
// asset/ は配色プレビューの画像だけで変わらないので、こちらは長めに持たせる。
app.use('/asset', express.static(path.join(rootDir, 'asset'), { maxAge: '7d' }));

//Get Graph
app.get('/graph', handlers.getGraph);

app.get('/data', handlers.getData);

app.listen(port, (): void => {
    console.log(`Server is Running on Port ${port}`);
});
