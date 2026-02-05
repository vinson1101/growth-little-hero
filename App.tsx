
import React, { useState, useEffect } from 'react';
import { ViewType, Task, RewardItem, GachaItem, AppState, Redemption } from './types';
import { initialData } from './initialData';

import HomeView from './components/HomeView';
import { ManagementView } from './components/ManagementView';
import RewardsView from './components/RewardsView';

const STORAGE_KEY = 'hero_growth_app_v4_data_final';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('HOME');

  const [appData, setAppData] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const todayStr = new Date().toDateString();

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AppState;
        // 确保旧版本数据迁移时包含奖励池字段
        if (!parsed.redemptions) parsed.redemptions = []; 
        
        if (parsed.lastActiveDate !== todayStr) {
          return {
            ...parsed,
            lastActiveDate: todayStr,
            tasks: parsed.tasks.map(t => t.isDaily ? { ...t, isCompleted: false } : t)
          };
        }
        return parsed;
      } catch (e) {
        console.error("Storage parse error", e);
      }
    }

    return {
      score: 0,
      tasks: initialData.tasks,
      shopRewards: initialData.shopRewards,
      gachaPool: initialData.gachaPool,
      redemptions: [],
      lastActiveDate: todayStr
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
  }, [appData]);

  const handleToggleTask = (taskId: string) => {
    setAppData(prev => {
      let scoreAdjustment = 0;
      const newTasks = prev.tasks.map(t => {
        if (t.id === taskId) {
          const newCompleted = !t.isCompleted;
          scoreAdjustment = newCompleted ? t.points : -t.points;
          return { ...t, isCompleted: newCompleted };
        }
        return t;
      });

      return {
        ...prev,
        tasks: newTasks,
        score: Math.max(0, prev.score + scoreAdjustment)
      };
    });
  };

  const updateTasks = (tasks: Task[]) => setAppData(prev => ({ ...prev, tasks }));
  const updateRewards = (rewards: RewardItem[]) => setAppData(prev => ({ ...prev, shopRewards: rewards }));
  const updateGacha = (gacha: GachaItem[]) => setAppData(prev => ({ ...prev, gachaPool: gacha }));
  const updateScore = (score: number) => setAppData(prev => ({ ...prev, score }));
  const updateRedemptions = (redemptions: Redemption[]) => setAppData(prev => ({ ...prev, redemptions }));
  
  const importFullData = (newData: Partial<AppState>) => {
    setAppData(prev => {
      // 深度合并或覆盖，确保 redemptions 字段优先使用导入的数据
      return {
        ...prev,
        ...newData,
        score: typeof newData.score === 'number' ? newData.score : prev.score,
        tasks: newData.tasks || prev.tasks,
        shopRewards: newData.shopRewards || prev.shopRewards,
        gachaPool: newData.gachaPool || prev.gachaPool,
        redemptions: newData.redemptions || [], // 如果导入文件没这个字段，设为空而不是保持旧的
        lastActiveDate: new Date().toDateString()
      };
    });
  };

  const handleRedeemReward = (cost: number, itemName: string) => {
    if (appData.score >= cost) {
      const newRedemption: Redemption = {
        id: Date.now().toString(),
        title: itemName,
        timestamp: new Date().toLocaleString(),
        isUsed: false,
        source: 'SHOP'
      };

      setAppData(prev => ({ 
        ...prev, 
        score: prev.score - cost,
        redemptions: [newRedemption, ...prev.redemptions]
      }));

      setTimeout(() => alert(`🎉 兑换成功！"${itemName}" 已存入你的奖励记录。`), 100);
    }
  };

  const handlePlayGacha = (cost: number): string | null => {
    if (appData.score >= cost && appData.gachaPool.length > 0) {
      const randomIndex = Math.floor(Math.random() * appData.gachaPool.length);
      const result = appData.gachaPool[randomIndex].title;
      
      const newRedemption: Redemption = {
        id: Date.now().toString(),
        title: result,
        timestamp: new Date().toLocaleString(),
        isUsed: false,
        source: 'GACHA'
      };

      setAppData(prev => ({ 
        ...prev, 
        score: prev.score - cost,
        redemptions: [newRedemption, ...prev.redemptions]
      }));
      return result;
    }
    return null;
  };

  const renderView = () => {
    switch (currentView) {
      case 'HOME':
        return (
          <HomeView 
            score={appData.score} 
            tasks={appData.tasks} 
            onNavigate={setCurrentView}
            onToggleTask={handleToggleTask}
          />
        );
      case 'MANAGEMENT':
        return (
          <ManagementView 
            score={appData.score}
            tasks={appData.tasks}
            shopRewards={appData.shopRewards}
            gachaPool={appData.gachaPool}
            redemptions={appData.redemptions}
            onBack={() => setCurrentView('HOME')}
            onUpdateTasks={updateTasks}
            onUpdateRewards={updateRewards}
            onUpdateGacha={updateGacha}
            onUpdateScore={updateScore}
            onUpdateRedemptions={updateRedemptions}
            onImportFullData={importFullData}
          />
        );
      case 'REWARDS':
        return (
          <RewardsView 
            score={appData.score}
            shopRewards={appData.shopRewards}
            gachaPool={appData.gachaPool}
            onBack={() => setCurrentView('HOME')}
            onRedeemReward={handleRedeemReward}
            onPlayGacha={handlePlayGacha}
          />
        );
      default:
        return <div>View Error</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
        {currentView === 'HOME' && (
          <div className="flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-top-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
              🚀
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-800">
              成长小英雄 <span className="text-indigo-500 text-sm font-medium bg-indigo-50 px-2 py-1 rounded-md ml-2">v4.0</span>
            </h1>
          </div>
        )}
        {renderView()}
      </div>
    </div>
  );
};

export default App;
