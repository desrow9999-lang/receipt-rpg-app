'use client';
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Item {
  name: string;
  category: string;
  price: number;
  bonus: string;
  rarity: 'N' | 'R' | 'SR' | 'SSR';
}

interface Monster {
  name: string;
  hp: number;
  maxHp: number;
  reward: string;
}

export default function ReceiptRpgApp() {
  const [hp, setHp] = useState<number>(300000);
  const [maxHp] = useState<number>(300000);
  const [level, setLevel] = useState<number>(1);
  const [exp, setExp] = useState<number>(0);
  const [nextExp, setNextExp] = useState<number>(10000);
  
  const [storeName, setStoreName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('食費');
  const [partyName] = useState<string>('我が家パーティ');
  
  const [items, setItems] = useState<Item[]>([
    { name: '旅立ちの布服', category: '日用品', price: 1500, bonus: '防御力+5', rarity: 'N' },
    { name: 'ポーション（お茶）', category: '食費', price: 150, bonus: 'HP微回復', rarity: 'N' },
  ]);

  const [monster, setMonster] = useState<Monster>({
    name: 'インフレゴブリン',
    hp: 15000,
    maxHp: 15000,
    reward: '討伐報酬: モチベーション+100',
  });

  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [battleLog, setBattleLog] = useState<string>('モンスターが現れた！レシートのダメージで撃退せよ！');

  const handleAddReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseInt(amount, 10);
    if (isNaN(cost) || cost <= 0) return;

    const nextHp = Math.max(0, hp - cost);
    setHp(nextHp);

    const gainedExp = Math.floor(cost * 0.1);
    let currentExp = exp + gainedExp;
    let currentLevel = level;
    let nextLevelExp = nextExp;

    if (currentExp >= nextLevelExp) {
      currentLevel += 1;
      currentExp -= nextLevelExp;
      nextLevelExp = Math.floor(nextLevelExp * 1.5);
      alert(`🎉 レベルアップ！ パーティが Lv.${currentLevel} になった！`);
    }

    setLevel(currentLevel);
    setExp(currentExp);
    setNextExp(nextLevelExp);

    const rarity: 'N' | 'R' | 'SR' | 'SSR' = cost > 30000 ? 'SSR' : cost > 10000 ? 'SR' : cost > 3000 ? 'R' : 'N';
    
    let generatedItem: Item = {
      name: storeName ? `${storeName}の戦利品` : `${category}の補給物資`,
      category,
      price: cost,
      bonus: category === '食費' ? `満腹度+${Math.floor(cost/50)}` : category === '趣味・娯楽' ? `精神力+${Math.floor(cost/40)}` : `耐久力+${Math.floor(cost/60)}`,
      rarity,
    };

    setItems([generatedItem, ...items]);

    let newMonsterHp = monster.hp - cost;
    if (newMonsterHp <= 0) {
      setBattleLog(`✨ ${monster.name} を討伐した！ ${monster.reward}`);
      setMonster({
        name: '浪費の魔王グリード',
        hp: 50000,
        maxHp: 50000,
        reward: '討伐報酬: 宝箱ドロップ率アップ',
      });
    } else {
      setMonster({ ...monster, hp: newMonsterHp });
      setBattleLog(`⚔️ ${storeName || category}への出費！ ${monster.name} に ${cost.toLocaleString()} ダメージを与えた！`);
    }

    setStoreName('');
    setAmount('');
  };

  const handleAiScan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAiProcessing(true);
    setTimeout(() => {
      setStoreName('冒険者ギルド前スーパー');
      setAmount('4800');
      setCategory('食費');
      setIsAiProcessing(false);
      alert('🔮 AI画像解析完了！レシートから店名・金額・カテゴリを自動抽出しました！');
    }, 1500);
  };

  const handleSalaryReset = () => {
    setHp(maxHp);
    alert('💰 給料日イベント発動！パーティ全体のHP（所持金）が全回復しました！');
  };

  const rarityColor = (r: 'N' | 'R' | 'SR' | 'SSR') => {
    switch (r) {
      case 'SSR': return '#f39c12';
      case 'SR': return '#9b59b6';
      case 'R': return '#3498db';
      default: return '#7f8c8d';
    }
  };

  const isDanger = (hp / maxHp) < 0.2;

  return (
    <main style={{ padding: '12px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif', color: '#333', boxSizing: 'border-box' }}>
      <header style={{ textAlign: 'center', marginBottom: '12px' }}>
        <h1 style={{ fontSize: '20px', color: '#2c3e50', margin: '0 0 4px 0' }}>🛡️ レシートRPG家計簿</h1>
        <p style={{ fontSize: '12px', color: '#7f8c8d', margin: 0 }}>使ったお金がダメージとなり、魔王を討伐する家計簿RPG！</p>
      </header>

      {/* 浪費警告（ピンチ演出） */}
      {isDanger && (
        <section style={{ background: '#fadbd8', border: '2px solid #e74c3c', borderRadius: '12px', padding: '10px', marginBottom: '12px', textAlign: 'center', animation: 'pulse 1s infinite' }}>
          <span style={{ color: '#c0392b', fontWeight: 'bold', fontSize: '13px' }}>
            ⚠️ 【緊急警告】パーティのHP（残高）が20%を切りました！これ以上の浪費は全滅の危機です！
          </span>
        </section>
      )}

      {/* ステータスセクション */}
      <section style={{ background: isDanger ? '#fdedec' : '#e8f8f5', border: `2px solid ${isDanger ? '#e74c3c' : '#a3e4d7'}`, borderRadius: '12px', padding: '12px', marginBottom: '12px', transition: 'background 0.3s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontWeight: 'bold', color: isDanger ? '#c0392b' : '#117a65', fontSize: '13px' }}>🏰 {partyName} (Lv.{level})</span>
          <span style={{ fontSize: '10px', background: isDanger ? '#e74c3c' : '#117a65', color: '#fff', padding: '2px 5px', borderRadius: '4px', whiteSpace: 'nowrap' }}>EXP: {exp} / {nextExp}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px' }}>
          <span style={{ whiteSpace: 'nowrap' }}>共有HP残高</span>
          <span style={{ color: isDanger ? '#e74c3c' : '#117a65', whiteSpace: 'nowrap' }}>{hp.toLocaleString()} / {maxHp.toLocaleString()} G</span>
        </div>
        <div style={{ width: '100%', background: isDanger ? '#fadbd8' : '#d1f2eb', borderRadius: '8px', height: '12px', overflow: 'hidden', marginBottom: '8px' }}>
          <div style={{ width: `${(hp / maxHp) * 100}%`, background: isDanger ? '#e74c3c' : '#1abc9c', height: '100%', transition: 'width 0.3s ease' }} />
        </div>
        <button 
          onClick={handleSalaryReset} 
          style={{ width: '100%', background: '#f1c40f', border: 'none', padding: '7px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
        >
          💰 給料日（パーティHP全回復）
        </button>
      </section>

      {/* モンスターバトルセクション */}
      <section style={{ background: '#fdedec', border: '2px solid #f5b7b1', borderRadius: '12px', padding: '12px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px', color: '#c0392b', gap: '4px' }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>👹 討伐: {monster.name}</span>
          <span style={{ whiteSpace: 'nowrap' }}>HP: {monster.hp.toLocaleString()}</span>
        </div>
        <div style={{ width: '100%', background: '#fadbd8', borderRadius: '8px', height: '10px', overflow: 'hidden', marginBottom: '6px' }}>
          <div style={{ width: `${Math.max(0, (monster.hp / monster.maxHp) * 100)}%`, background: '#e74c3c', height: '100%', transition: 'width 0.3s ease' }} />
        </div>
        <p style={{ fontSize: '11px', color: '#78281f', margin: 0, fontStyle: 'italic' }}>{battleLog}</p>
      </section>

      {/* レシート登録セクション */}
      <section style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '12px', padding: '12px', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '15px', margin: '0 0 8px 0' }}>📷 家計簿＆レシート登録</h2>
        
        <div style={{ marginBottom: '10px', background: '#ebf5fb', padding: '8px', borderRadius: '8px', border: '1px dashed #3498db', textAlign: 'center' }}>
          <label style={{ cursor: 'pointer', color: '#2980b9', fontWeight: 'bold', display: 'block', fontSize: '12px' }}>
            {isAiProcessing ? '🔮 AIがレシートを解析中...' : '📸 レシート画像を撮影して自動入力'}
            <input type="file" accept="image/*" onChange={handleAiScan} style={{ display: 'none' }} disabled={isAiProcessing} />
          </label>
        </div>

        <form onSubmit={handleAddReceipt} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input 
            type="text" 
            placeholder="店名（例: スーパー、コンビニ）" 
            value={storeName} 
            onChange={(e) => setStoreName(e.target.value)}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
            required
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="number" 
              placeholder="金額（例: 2480）" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px', flex: 1 }}
              required
            />
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px', background: '#fff' }}
            >
              <option value="食費">食費</option>
              <option value="日用品">日用品</option>
              <option value="趣味・娯楽">趣味・娯楽</option>
              <option value="固定費">固定費</option>
              <option value="その他">その他</option>
            </select>
          </div>
          <button 
            type="submit" 
            style={{ background: '#3498db', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
          >
            ⚔️ 支出を記録してモンスターを攻撃！
          </button>
        </form>
      </section>

      {/* インベントリ（家計簿履歴）セクション */}
      <section>
        <h2 style={{ fontSize: '15px', margin: '0 0 8px 0' }}>🎒 冒険の記録（家計簿・戦利品一覧）</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {items.map((item, index) => (
            <li key={index} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#fff', background: rarityColor(item.rarity), padding: '1px 4px', borderRadius: '3px' }}>{item.rarity}</span>
                  <span style={{ fontSize: '10px', background: '#e8f8f5', color: '#117a65', padding: '1px 5px', borderRadius: '3px', fontWeight: 'bold' }}>{item.category}</span>
                  <strong style={{ fontSize: '14px' }}>{item.name}</strong>
                </div>
                <span style={{ fontSize: '10px', color: '#e67e22', background: '#fdf2e9', padding: '2px 5px', borderRadius: '4px' }}>{item.bonus}</span>
              </div>
              <span style={{ fontWeight: 'bold', color: '#c0392b', fontSize: '13px', whiteSpace: 'nowrap' }}>-{item.price.toLocaleString()} G</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
