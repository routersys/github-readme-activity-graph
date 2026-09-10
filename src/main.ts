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

app.get('/', (_req, res) => res.sendFile(path.join(rootDir, 'index.html')));
app.get('/script.js', (_req, res) => res.sendFile(path.join(rootDir, 'script.js')));
app.get('/styles.css', (_req, res) => res.sendFile(path.join(rootDir, 'styles.css')));
// asset/ は配色プレビューの画像だけなので、まとめて配って差し支えない。
app.use('/asset', express.static(path.join(rootDir, 'asset')));

//Get Graph
app.get('/graph', handlers.getGraph);

app.get('/data', handlers.getData);

app.listen(port, (): void => {
    console.log(`Server is Running on Port ${port}`);
});
