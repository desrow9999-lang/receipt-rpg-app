'use client';
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// ビルドエラー回避用のプレースホルダー設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ReceiptRpgApp() {
  const [hp, setHp] = useState<number>(300000);
  const [maxHp] = useState<number>(300000);
  const [storeName, setStoreName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [items, setItems] = useState<Array<{ name: string; type: string; price: number; bonus: string }>>([
    { name: '旅立ちの布服', type: 'armor', price: 1500, bonus: '防御力+5' },
    { name: 'ポーション（お茶）', type: 'potion', price: 150, bonus: 'HP微回復' },
  ]);

  const handleAddReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseInt(amount, 10);
    if (isNaN(cost) || cost <= 0) return;

    const nextHp = Math.max(0, hp - cost);
    setHp(nextHp);

    let generatedItem = {
      name: storeName ? `${storeName}の戦利品` : '謎のアイテム',
      type: cost > 5000 ? 'weapon' : cost > 1000 ? 'armor' : 'potion',
      price: cost,
      bonus: cost > 5000 ? `攻撃力+${Math.floor(cost / 200)}` : `防御力+${Math.floor(cost / 300)}`,
    };

    setItems([generatedItem, ...items]);
    setStoreName('');
    setAmount('');
  };

  const handleSalaryReset = () => {
    setHp(maxHp);
    alert('✨ 給料日イベント発動！HP（所持金）が全回復しました！ ✨');
  };

  return (
    <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif', color: '#333' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', color: '#2c3e50' }}>🛡️ レシートRPG家計簿</h1>
        <p style={{ fontSize: '14px', color: '#7f8c8d' }}>買い物を冒険に変える、痛快マネー管理</p>
      </header>

      <section style={{ background: '#f8f9fa', border: '2px solid #e9ecef', borderRadius: '12px', padding: '16px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 'bold' }}>
          <span>プレイヤーHP（残高）</span>
          <span>{hp.toLocaleString()} / {maxHp.toLocaleString()} G</span>
        </div>
        <div style={{ width: '100%', background: '#e0e0e0', borderRadius: '8px', height: '16px', overflow: 'hidden' }}>
          <div style={{ width: `${(hp / maxHp) * 100}%`, background: hp < 50000 ? '#e74c3c' : '#2ecc71', height: '100%', transition: 'width 0.3s ease' }} />
        </div>
        <button 
          onClick={handleSalaryReset} 
          style={{ marginTop: '12px', width: '100%', background: '#f1c40f', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          💰 給料日（HP全回復）
        </button>
      </section>

      <section style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>📷 レシートを登録（装備調達）</h2>
        <form onSubmit={handleAddReceipt} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="店名（例: ドラッグストア、コンビニ）" 
            value={storeName} 
            onChange={(e) => setStoreName(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <input 
            type="number" 
            placeholder="金額（例: 1200）" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
            required
          />
          <button 
            type="submit" 
            style={{ background: '#3498db', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            レシートをアイテムに変換する！
          </button>
        </form>
      </section>

      <section>
        <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>🎒 装備・所持品インベントリ</h2>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {items.map((item, index) => (
            <li key={index} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '16px' }}>{item.name}</strong>
                <span style={{ fontSize: '12px', color: '#e67e22', background: '#fdf2e9', padding: '2px 6px', borderRadius: '4px' }}>{item.bonus}</span>
              </div>
              <span style={{ fontWeight: 'bold', color: '#c0392b' }}>-{item.price.toLocaleString()} G</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
