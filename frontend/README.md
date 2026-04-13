　

まず、開発サーバーを起動します：

\`\`\`bash
npm run dev

# または

yarn dev

# または

pnpm dev

# または

bun dev
\`\`\`

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと結果を確認できます。

`app/page.tsx` を編集することでページの内容を変更できます。ファイルを編集すると自動的にページが更新されます。

このプロジェクトでは [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) を使用して、Vercel向けの新しいフォントファミリーである [Geist](https://vercel.com/font) を自動的に最適化・読み込みしています。

## 詳細

Next.jsについて詳しく知るには、以下のリソースを参照してください：

- [Next.js ドキュメント](https://nextjs.org/docs) - Next.jsの機能やAPIについて学べます
- [Next.js チュートリアル](https://nextjs.org/learn) - インタラクティブに学べるチュートリアルです

また、[Next.jsのGitHubリポジトリ](https://github.com/vercel/next.js) も確認できます。フィードバックやコントリビューションを歓迎しています！

## Vercelへのデプロイ

Next.jsアプリをデプロイする最も簡単な方法は、開発元が提供している [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) を使用することです。

詳細については、[Next.js デプロイメントドキュメント](https://nextjs.org/docs/app/building-your-application/deploying) を参照してください。

## db.json

サンプルデータの扱いとする
