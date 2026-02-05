
import React, { useState, useRef } from 'react';
import { ArrowLeft, Plus, Trash2, RefreshCw, ShoppingBag, Dice5, ListTodo, CalendarCheck, RotateCcw, Coins, Database, Download, Upload, CheckCircle, Save, AlertTriangle, ClipboardList, History, Check, X, Filter } from 'lucide-react';
import { Task, RewardItem, GachaItem, AppState, Redemption } from '../types';

interface ManagementViewProps {
  score: number;
  tasks: Task[];
  shopRewards: RewardItem[];
  gachaPool: GachaItem[];
  redemptions: Redemption[];
  onBack: () => void;
  onUpdateTasks: (tasks: Task[]) => void;
  onUpdateRewards: (rewards: RewardItem[]) => void;
  onUpdateGacha: (items: GachaItem[]) => void;
  onUpdateScore: (newScore: number) => void;
  onUpdateRedemptions: (redemptions: Redemption[]) => void;
  onImportFullData: (data: Partial<AppState>) => void;
}

export const ManagementView: React.FC<ManagementViewProps> = ({
  score,
  tasks,
  shopRewards,
  gachaPool,
  redemptions,
  onBack,
  onUpdateTasks,
  onUpdateRewards,
  onUpdateGacha,
  onUpdateScore,
  onUpdateRedemptions,
  onImportFullData
}) => {
  const [activeTab, setActiveTab] = useState<'TASKS' | 'REWARDS' | 'GACHA' | 'RECORDS' | 'SCORE' | 'DATA'>('TASKS');
  const [recordFilter, setRecordFilter] = useState<'ALL' | 'UNUSED' | 'USED'>('UNUSED');
  
  // Forms states
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPoints, setNewTaskPoints] = useState(10);
  const [newTaskIsDaily, setNewTaskIsDaily] = useState(true);

  const [newRewardTitle, setNewRewardTitle] = useState('');
  const [newRewardCost, setNewRewardCost] = useState(100);
  const [newGachaTitle, setNewGachaTitle] = useState('');
  
  // Score Management State
  const [scoreAdjustAmount, setScoreAdjustAmount] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Data Import State
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pendingImportData, setPendingImportData] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 逻辑处理器 ---
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      points: Number(newTaskPoints),
      isPublished: false,
      isCompleted: false,
      isDaily: newTaskIsDaily,
    };
    onUpdateTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskPoints(10);
  };

  const handleManualAdjust = (type: 'ADD' | 'SUBTRACT') => {
    const amount = Number(scoreAdjustAmount);
    if (!amount || amount <= 0) return;
    onUpdateScore(type === 'ADD' ? score + amount : Math.max(0, score - amount));
    setScoreAdjustAmount('');
  };

  const handleExportData = () => {
    const data = { 
      version: "4.0", 
      timestamp: new Date().toISOString(), 
      score, 
      tasks, 
      shopRewards, 
      gachaPool, 
      redemptions // 明确导出奖励池记录
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `英雄成长记录_全量备份_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (Array.isArray(imported.tasks) || typeof imported.score === 'number') {
          setPendingImportData(imported);
          setShowImportConfirm(true);
        }
      } catch (err) { alert('文件解析失败，请确保选择了正确的 JSON 备份文件'); }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const toggleRedemptionStatus = (id: string) => {
    const updated = redemptions.map(r => r.id === id ? { ...r, isUsed: !r.isUsed } : r);
    onUpdateRedemptions(updated);
  };

  const filteredRecords = redemptions.filter(r => {
    if (recordFilter === 'ALL') return true;
    if (recordFilter === 'UNUSED') return !r.isUsed;
    if (recordFilter === 'USED') return r.isUsed;
    return true;
  });

  return (
    <div className="bg-white rounded-3xl shadow-2xl min-h-[640px] flex flex-col md:flex-row overflow-hidden border border-slate-200">
      
      {/* 侧边栏 */}
      <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-6 flex flex-col gap-2">
        <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 font-bold py-2">
          <ArrowLeft size={20} /> 返回主页
        </button>
        
        <nav className="flex-1 flex flex-col gap-1">
          {[
            { id: 'TASKS', icon: ListTodo, label: '任务库管理', color: 'indigo' },
            { id: 'REWARDS', icon: ShoppingBag, label: '奖励商店', color: 'pink' },
            { id: 'GACHA', icon: Dice5, label: '抽奖奖池', color: 'amber' },
            { id: 'RECORDS', icon: ClipboardList, label: '孩子奖励池', color: 'green' },
            { id: 'SCORE', icon: Coins, label: '积分中心', color: 'yellow' },
            { id: 'DATA', icon: Database, label: '数据备份', color: 'slate' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all font-bold ${
                activeTab === tab.id 
                ? `bg-white text-${tab.color}-600 shadow-sm border border-slate-200` 
                : 'text-slate-500 hover:bg-slate-200/50'
              }`}
            >
              <tab.icon size={20} /> {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 p-6 md:p-10 bg-white overflow-y-auto max-h-[800px]">
        {/* 其他 Tab 的内容保持不变... */}
        {activeTab === 'TASKS' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-800">任务库管理</h2>
              <button onClick={() => onUpdateTasks(tasks.map(t => t.isDaily ? { ...t, isPublished: true } : t))} className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-green-600 shadow-lg shadow-green-100 transition-all">
                <CalendarCheck size={18} /> 发布日常
              </button>
            </div>
            <div className="flex flex-wrap gap-3 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <input type="text" placeholder="任务名称（如：收拾书包）" className="flex-1 min-w-[200px] p-3 rounded-xl border-2 border-slate-200 bg-white text-slate-800 focus:border-indigo-500 outline-none" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} />
              <input type="number" className="w-24 p-3 rounded-xl border-2 border-slate-200 bg-white text-slate-800 focus:border-indigo-500 outline-none" value={newTaskPoints} onChange={e => setNewTaskPoints(Number(e.target.value))} />
              <button onClick={handleAddTask} className="bg-indigo-600 text-white px-6 rounded-xl font-black hover:bg-indigo-700 transition-all"><Plus size={24} /></button>
            </div>
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-sm">
                  <div className="flex items-center gap-4">
                    <button onClick={() => onUpdateTasks(tasks.map(t => t.id === task.id ? { ...t, isPublished: !t.isPublished } : t))} className={`w-12 h-6 rounded-full relative transition-colors ${task.isPublished ? 'bg-green-500' : 'bg-slate-300'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${task.isPublished ? 'left-7' : 'left-1'}`} />
                    </button>
                    <span className="font-bold text-slate-700">{task.title} <span className="text-amber-500 ml-2">({task.points}分)</span></span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => onUpdateTasks(tasks.map(t => t.id === task.id ? { ...t, isDaily: !t.isDaily } : t))} className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${task.isDaily ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>{task.isDaily ? '日常任务' : '单次任务'}</button>
                    <button onClick={() => onUpdateTasks(tasks.filter(t => t.id !== task.id))} className="text-red-300 hover:text-red-500 p-2"><Trash2 size={20} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'REWARDS' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800">奖励商店管理</h2>
            <div className="flex flex-wrap gap-3 p-5 bg-pink-50 rounded-2xl border border-pink-100">
              <input type="text" placeholder="新奖励名称..." className="flex-1 min-w-[200px] p-3 rounded-xl border-2 border-slate-200 bg-white text-slate-800 outline-none focus:border-pink-500" value={newRewardTitle} onChange={e => setNewRewardTitle(e.target.value)} />
              <input type="number" placeholder="分数" className="w-24 p-3 rounded-xl border-2 border-slate-200 bg-white text-slate-800 outline-none focus:border-pink-500" value={newRewardCost} onChange={e => setNewRewardCost(Number(e.target.value))} />
              <button onClick={() => {
                if (!newRewardTitle.trim()) return;
                onUpdateRewards([...shopRewards, { id: Date.now().toString(), title: newRewardTitle, cost: Number(newRewardCost), icon: '🎁' }]);
                setNewRewardTitle('');
              }} className="bg-pink-600 text-white px-6 rounded-xl font-black hover:bg-pink-700 transition-all"><Plus size={24} /></button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {shopRewards.map(reward => (
                <div key={reward.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl">
                  <span className="font-bold text-slate-700">🎁 {reward.title} <span className="text-pink-500 ml-2">({reward.cost}分)</span></span>
                  <button onClick={() => onUpdateRewards(shopRewards.filter(r => r.id !== reward.id))} className="text-red-300 hover:text-red-500 p-2"><Trash2 size={20} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'GACHA' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800">抽奖奖池管理</h2>
            <div className="flex gap-3 p-5 bg-amber-50 rounded-2xl border border-amber-100">
              <input type="text" placeholder="奖池惊喜奖励内容..." className="flex-1 p-3 rounded-xl border-2 border-slate-200 bg-white text-slate-800 outline-none focus:border-amber-500" value={newGachaTitle} onChange={e => setNewGachaTitle(e.target.value)} />
              <button onClick={() => {
                if (!newGachaTitle.trim()) return;
                onUpdateGacha([...gachaPool, { id: Date.now().toString(), title: newGachaTitle }]);
                setNewGachaTitle('');
              }} className="bg-amber-500 text-white px-6 rounded-xl font-black hover:bg-amber-600 transition-all"><Plus size={24} /></button>
            </div>
            {gachaPool.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">奖池目前是空的，请添加一些惊喜吧！</div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {gachaPool.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl">
                    <span className="font-bold text-slate-700">✨ {item.title}</span>
                    <button onClick={() => onUpdateGacha(gachaPool.filter(g => g.id !== item.id))} className="text-red-300 hover:text-red-500 p-2"><Trash2 size={20} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'RECORDS' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-800">奖励池 (兑换历史)</h2>
              <button onClick={() => onUpdateRedemptions([])} className="text-red-500 text-sm font-bold flex items-center gap-1 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
                <Trash2 size={16} /> 清空所有历史
              </button>
            </div>
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit">
              <button onClick={() => setRecordFilter('UNUSED')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${recordFilter === 'UNUSED' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>未使用 ({redemptions.filter(r => !r.isUsed).length})</button>
              <button onClick={() => setRecordFilter('USED')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${recordFilter === 'USED' ? 'bg-white text-slate-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>已使用 ({redemptions.filter(r => r.isUsed).length})</button>
              <button onClick={() => setRecordFilter('ALL')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${recordFilter === 'ALL' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>全部记录</button>
            </div>
            <div className="space-y-3">
              {filteredRecords.length === 0 ? (
                <div className="text-center py-12 text-slate-400 bg-white border border-dashed border-slate-300 rounded-3xl">没有符合条件的记录</div>
              ) : (
                filteredRecords.map(record => (
                  <div key={record.id} className={`flex items-center justify-between p-4 border rounded-2xl transition-all ${record.isUsed ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-green-100 shadow-sm'}`}>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${record.source === 'SHOP' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>{record.source === 'SHOP' ? '商店' : '抽奖'}</span>
                        <span className={`font-bold text-lg ${record.isUsed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{record.title}</span>
                      </div>
                      <span className="text-xs text-slate-400 mt-1 flex items-center gap-1"><History size={12} /> {record.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleRedemptionStatus(record.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${record.isUsed ? 'bg-slate-200 text-slate-600' : 'bg-green-500 text-white shadow-lg shadow-green-100 hover:bg-green-600'}`}>{record.isUsed ? <RotateCcw size={16} /> : <Check size={16} />}{record.isUsed ? '重设为未使用' : '标记已使用'}</button>
                      <button onClick={() => onUpdateRedemptions(redemptions.filter(r => r.id !== record.id))} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><X size={20} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'SCORE' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-black text-slate-800">积分中心控制</h2>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-10 text-center">
               <div className="text-slate-500 font-bold text-sm mb-2">当前存余积分</div>
               <div className="text-8xl font-black text-yellow-600 tabular-nums">{score}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-8 rounded-3xl space-y-4 border border-slate-200">
                <h3 className="font-bold text-slate-700">手动调整分值</h3>
                <input type="number" placeholder="分数值" className="w-full p-4 rounded-xl border-2 border-slate-200 bg-white text-slate-800 text-2xl font-bold outline-none focus:border-yellow-500" value={scoreAdjustAmount} onChange={e => setScoreAdjustAmount(e.target.value)} />
                <div className="flex gap-3">
                  <button onClick={() => handleManualAdjust('ADD')} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-black hover:bg-green-600 transition-all">奖励积分</button>
                  <button onClick={() => handleManualAdjust('SUBTRACT')} className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-black hover:bg-slate-300 transition-all">扣除积分</button>
                </div>
              </div>
              <div className="bg-red-50 p-8 rounded-3xl flex flex-col justify-center items-center text-center border border-red-100">
                <h3 className="font-bold text-red-600 mb-4">清空重置</h3>
                <button onClick={() => setShowResetConfirm(true)} className="px-8 py-3 bg-white border-2 border-red-200 text-red-500 rounded-xl font-black hover:bg-red-50 transition-all">确认积分归零</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'DATA' && (
          <div className="space-y-8 animate-in fade-in">
            <h2 className="text-2xl font-black text-slate-800">全量数据备份</h2>
            <p className="text-slate-500 -mt-4">备份包含：积分、任务、奖励配置、抽奖奖池及<b>孩子奖励池记录</b>。</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100 text-center flex flex-col items-center">
                <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                  <Download size={40} className="text-indigo-600" />
                </div>
                <h3 className="font-bold text-indigo-900 mb-2">导出全量数据</h3>
                <p className="text-indigo-700/60 text-sm mb-6 px-4">下载一个 JSON 文件，包含当前所有设置和兑换历史，可在其他设备无缝恢复。</p>
                <button onClick={handleExportData} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">导出备份文件</button>
              </div>

              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 text-center flex flex-col items-center">
                <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                  <Upload size={40} className="text-slate-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">从备份恢复</h3>
                <p className="text-slate-500 text-sm mb-6 px-4">上传之前导出的 JSON 文件。注意：这会<b>覆盖当前所有数据</b>（包括奖励池历史）。</p>
                <input type="file" accept=".json" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold hover:bg-slate-900 transition-all shadow-lg shadow-slate-100">上传并恢复数据</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 弹窗部分保持原有逻辑 */}
      {showImportConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
            <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-4">确认要恢复数据吗？</h3>
            <p className="text-slate-500 text-sm mb-8">导入将完全覆盖当前的积分、任务列表和<b>奖励池兑换历史</b>。此操作无法撤销。</p>
            <div className="flex gap-4">
              <button onClick={() => setShowImportConfirm(false)} className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold">取消</button>
              <button onClick={() => { onImportFullData(pendingImportData); setShowImportConfirm(false); setShowSuccessModal(true); }} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold">确定覆盖</button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl text-center max-w-xs w-full shadow-2xl">
            <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-800 mb-6">全量恢复成功！</h3>
            <button onClick={() => setShowSuccessModal(false)} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold">好的</button>
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center">
            <RotateCcw size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-6">确定清空所有积分？</h3>
            <div className="flex gap-4">
              <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold">放弃</button>
              <button onClick={() => { onUpdateScore(0); setShowResetConfirm(false); }} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold">确定清空</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
