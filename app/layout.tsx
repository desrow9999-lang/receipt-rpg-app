import React from 'react';

export const metadata = {
  title: 'レシートRPG家計簿',
  description: '買い物を冒険に変えるマネー管理アプリ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, padding: 0, background: '#f0f2f5' }}>
        {children}
      </body>
    </html>
  );
}
