'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ReceiptRpgApp() {
  const [hp, setHp] = useState<number>(300000);
  const [maxHp] = useState<number>(300000);
  const [storeName, setStoreName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [partyName, setPartyName] = useState<string>('我が家パーティ');
  const [items, setItems] = useState<Array<{ name: string; type: string; price: number; bonus: string }>>([
    { name: '旅立ちの布服', type: 'armor', price: 1500, bonus: '防御力+5' },
    { name: 'ポーション（お茶）', type: 'potion', price: 150, bonus: 'HP微回復' },
  ]);
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);

  // レシート登録＆アイテム変換（AI解析＆Supabase同期シミュレーション含む）
  const handleAddReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseInt(amount, 10);
    if (isNaN(cost) || cost <= 0) return;

    const nextHp = Math.max(0, hp - cost);
    setHp(nextHp);

    let generatedItem = {
      name: storeName ? `${storeName}の戦利品` : '謎の魔石',
      type: cost > 5000 ? 'weapon' : cost > 1000 ? 'armor' : 'potion',
      price: cost,
      bonus: cost > 5000 ? `攻撃力+${Math.floor(cost / 200)}` : `防御力+${Math.floor(cost / 300)}`,
    };

    setItems([generatedItem, ...items]);
    setStoreName('');
    setAmount('');
    alert(`⚔️ 討伐完了！ ${cost.g ? cost : cost.toLocaleString()}G のダメージと引き換えに新しい装備を手に入れた！`);
  };

  // AIレシート画像解析シミュレーション
  const handleAiScan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAiProcessing(true);
    setTimeout(() => {
      // AIが画像を解析したと仮定して自動入力
      setStoreName('冒険者ギルド前スーパー');
      setAmount('2480');
      setIsAiProcessing(false);
      ✨ alert('🔮 AI画像解析完了！レシートから店名と金額を自動抽出しました！');
    }, 1500);
  };

  // 給料日全回復イベント
  const handleSalaryReset = () => {
    setHp(maxHp);
    alert('✨ 給料日イベント発動！パーティ全体のHP（所持金）が全回復しました！ ✨');
  };

  return (
    <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif', color: '#333' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', color: '#2c3e50' }}>🛡️ レシートRPG家計簿（完全版）</h1>
        <p style={{ fontSize: '14px', color: '#7f8c8d' }}>AI解析 & パーティ共有で、毎月の買い物を大冒険に！</p>
      </header>

      {/* パーティ（家族）ステータス */}
      <section style={{ background: '#e8f8f5', border: '2px solid #a3e4d7', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontWeight: 'bold', color: '#117a65' }}>🏰 パーティ名: {partyName}</span>
          <span style={{ fontSize: '12px', background: '#117a65', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>マルチプレイ中</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 'bold' }}>
          <span>パーティ共有 HP（残高）</span>
          <span>{hp.toLocaleString()} / {maxHp.toLocaleString()} G</span>
        </div>
        <div style={{ width: '100%', background: '#d1f2eb', borderRadius: '8px', height: '16px', overflow: 'hidden' }}>
          <div style={{ width: `${(hp / maxHp) * 100}%`, background: hp < 50000 ? '#e74c3c' : '#1abc9c', height: '100%', transition: 'width 0.3s ease' }} />
        </div>
        <button 
          onClick={handleSalaryReset} 
          style={{ marginTop: '12px', width: '100%', background: '#f1c40f', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          💰 給料日（パーティHP全回復）
        </button>
      </section>

      {/* AIレシート自動解析 ＆ 手動登録フォーム */}
      <section style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>📷 レシート登録（AI自動解析対応）</h2>
        
        {/* AIカメラ読み込みボタン */}
        <div style={{ marginBottom: '15px', background: '#ebf5fb', padding: '12px', borderRadius: '8px', border: '1px dashed #3498db', textAlign: 'center' }}>
          <label style={{ cursor: 'pointer', color: '#2980b9', fontWeight: 'bold', display: 'block' }}>
            {isAiProcessing ? '🔮 AIがレシートを解析中...' : '📸 レシート画像を撮影して自動入力'}
            <input type="file" accept="image/*" onChange={handleAiScan} style={{ display: 'none' }} disabled={isAiProcessing} />
          </label>
        </div>

        <form onSubmit={handleAddReceipt} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="店名（例: スーパー、コンビニ）" 
            value={storeName} 
            onChange={(e) => setStoreName(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
            required
          />
          <input 
            type="number" 
            placeholder="金額（例: 2480）" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
            required
          />
          <button 
            type="submit" 
            style={{ background: '#3498db', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            レシートをアイテムに変換してダメージを受ける！
          </button>
        </form>
      </section>

      {/* 冒険の戦利品（インベントリ） */}
      <section>
        <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>🎒 パーティのインベントリ（戦利品一覧）</h2>
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
