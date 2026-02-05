
import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, Gift, Sparkles, AlertCircle } from 'lucide-react';
import { RewardItem, GachaItem } from '../types';
import { GACHA_COST } from '../constants';

interface RewardsViewProps {
  score: number;
  shopRewards: RewardItem[];
  gachaPool: GachaItem[];
  onBack: () => void;
  onRedeemReward: (cost: number, itemName: string) => void;
  onPlayGacha: (cost: number) => string | null;
}

const RewardsView: React.FC<RewardsViewProps> = ({ 
  score, 
  shopRewards, 
  gachaPool, 
  onBack, 
  onRedeemReward,
  onPlayGacha 
}) => {
  const [activeTab, setActiveTab] = useState<'SHOP' | 'GACHA'>('SHOP');
  
  // Gacha States
  const [isSpinning, setIsSpinning] = useState(false);
  const [gachaResult, setGachaResult] = useState<string | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const handleShopBuy = (item: RewardItem) => {
    // 确保积分足够
    if (score >= item.cost) {
      // 执行兑换逻辑
      onRedeemReward(item.cost, item.title);
    }
  };

  const handleStartGacha = () => {
    if (score < GACHA_COST || gachaPool.length === 0) return;
    
    setIsSpinning(true);
    
    setTimeout(() => {
      const resultName = onPlayGacha(GACHA_COST);
      if (resultName) {
        setGachaResult(resultName);
        setShowResultModal(true);
      }
      setIsSpinning(false);
    }, 1500);
  };

  const closeResultModal = () => {
    setShowResultModal(false);
    setGachaResult(null);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold bg-white px-4 py-2 rounded-full shadow-sm">
          <ArrowLeft size={20} /> 返回主页
        </button>
        <div className="flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-extrabold shadow-sm">
          <span className="text-xl">🌟</span>
          <span>{score} 分</span>
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          星光游乐场
        </h1>
        <p className="text-slate-500 font-medium mt-1">用努力换取小确幸！</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200 inline-flex">
          <button
            onClick={() => setActiveTab('SHOP')}
            className={`px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all ${
              activeTab === 'SHOP' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <ShoppingBag size={20} /> 奖励商店
          </button>
          <button
            onClick={() => setActiveTab('GACHA')}
            className={`px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all ${
              activeTab === 'GACHA' 
                ? 'bg-purple-500 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Gift size={20} /> 幸运抽奖
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-2">
        
        {/* === SHOP VIEW === */}
        {activeTab === 'SHOP' && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 animate-pop">
            {shopRewards.map((item) => {
              const canAfford = score >= item.cost;
              return (
                <div key={item.id} className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border-2 border-slate-100 flex flex-col items-center text-center gap-3 transition-all hover:shadow-md">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 rounded-full flex items-center justify-center text-3xl md:text-4xl">
                    {item.icon || '🎁'}
                  </div>
                  <h3 className="font-bold text-base md:text-lg text-slate-800 leading-tight min-h-[2.5rem] flex items-center justify-center">
                    {item.title}
                  </h3>
                  <div className="font-bold text-slate-400 text-xs md:text-sm">{item.cost} 积分</div>
                  
                  <button
                    onClick={() => handleShopBuy(item)}
                    disabled={!canAfford}
                    className={`w-full py-2.5 md:py-3 rounded-xl font-bold transition-all text-sm md:text-base ${
                      canAfford
                        ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-100 active:scale-95'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? '立即兑换' : `分不够`}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* === GACHA VIEW === */}
        {activeTab === 'GACHA' && (
          <div className="flex flex-col items-center animate-pop">
            {gachaPool.length === 0 ? (
              <div className="w-full max-w-md bg-white border-4 border-dashed border-slate-200 rounded-[3rem] p-12 text-center">
                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={48} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-400 mb-2">奖池空空如也</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  这里目前还没有惊喜奖励哦！<br/>快叫爸爸妈妈去管理页面的“抽奖奖池”里添加一些宝贝吧。
                </p>
              </div>
            ) : (
              <div className="relative w-full max-w-md bg-gradient-to-b from-purple-600 to-indigo-800 rounded-[3rem] p-8 shadow-2xl border-4 border-purple-400/30 text-center">
                <div className="mt-8 mb-8 relative">
                  <div className={`text-[8rem] transition-all duration-300 ${isSpinning ? 'animate-wiggle scale-110' : 'hover:scale-105'}`}>
                    🎁
                  </div>
                  {isSpinning && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center">
                      <Sparkles className="text-yellow-300 w-32 h-32 animate-spin-slow opacity-80" />
                    </div>
                  )}
                </div>

                <div className="bg-black/20 rounded-2xl p-4 mb-6 backdrop-blur-sm">
                  <p className="text-purple-200 text-sm font-medium uppercase tracking-wider">每次抽奖消耗</p>
                  <p className="text-3xl font-extrabold text-white">{GACHA_COST} 积分</p>
                </div>

                <button
                  onClick={handleStartGacha}
                  disabled={score < GACHA_COST || isSpinning}
                  className={`w-full py-4 rounded-2xl text-xl font-black uppercase tracking-wide transition-all ${
                    score >= GACHA_COST && !isSpinning
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-xl hover:scale-105 active:scale-95'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isSpinning ? '寻找幸运中...' : '开始抽奖!'}
                </button>
                
                {score < GACHA_COST && (
                  <p className="text-red-300 font-bold mt-4 text-sm">积分不够啦，快去做任务吧！</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-pop">
           <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden shadow-2xl">
             <div className="relative z-10">
               <div className="text-6xl mb-4 animate-bounce-fast">🎉</div>
               <h2 className="text-2xl font-black text-slate-800 mb-2">恭喜获得!</h2>
               <p className="text-slate-500 mb-6">惊喜已存入你的奖励记录：</p>
               
               <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-2xl border-2 border-orange-200 mb-8">
                 <p className="text-xl font-bold text-orange-600 leading-relaxed">
                   {gachaResult}
                 </p>
               </div>

               <button 
                 onClick={closeResultModal}
                 className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 w-full shadow-lg shadow-indigo-100"
               >
                 收下惊喜
               </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default RewardsView;
