import React from 'react';
import { Trophy, Gift, CheckCircle, Circle, Settings } from 'lucide-react';
import { Task } from '../types';

interface HomeViewProps {
  score: number;
  tasks: Task[];
  onNavigate: (view: 'MANAGEMENT' | 'REWARDS') => void;
  onToggleTask: (taskId: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ score, tasks, onNavigate, onToggleTask }) => {
  const publishedTasks = tasks.filter(t => t.isPublished);
  const completedCount = publishedTasks.filter(t => t.isCompleted).length;
  const progress = publishedTasks.length > 0 ? (completedCount / publishedTasks.length) * 100 : 0;

  // Format today's date with Weekday
  const today = new Date();
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日 ${weekDays[today.getDay()]}`;

  return (
    <div className="space-y-6">
      {/* Header Overview */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-white opacity-10"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Trophy size={48} className="text-yellow-300" />
            </div>
            <div>
              <h2 className="text-lg opacity-90 font-medium">当前积分</h2>
              <div className="text-6xl font-extrabold tracking-tight text-yellow-300 drop-shadow-md">
                {score}
              </div>
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <button
              onClick={() => onNavigate('MANAGEMENT')}
              className="flex-1 md:flex-none flex flex-col items-center justify-center gap-2 bg-white/10 hover:bg-white/20 active:scale-95 transition-all p-4 rounded-2xl border border-white/10"
            >
              <Settings size={24} />
              <span className="text-sm font-semibold">管理任务</span>
            </button>
            <button
              onClick={() => onNavigate('REWARDS')}
              className="flex-1 md:flex-none flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 active:scale-95 transition-all p-4 rounded-2xl shadow-lg transform hover:-translate-y-1"
            >
              <Gift size={28} className="text-white animate-pulse" />
              <span className="text-sm font-bold text-white">兑换奖励</span>
            </button>
          </div>
        </div>
      </div>

      {/* Task Board */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">📝</span>
            今日任务板 <span className="text-lg font-normal text-slate-500">({dateStr})</span>
          </h2>
          <div className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
            已完成 {completedCount} / {publishedTasks.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 mb-8 overflow-hidden">
          <div 
            className="bg-green-500 h-3 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {publishedTasks.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <p>还没有发布今天的任务哦，请爸爸妈妈去管理页发布吧！</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publishedTasks.map((task) => (
              <div
                key={task.id}
                className={`group relative flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 ${
                  task.isCompleted
                    ? 'bg-green-50 border-green-200 shadow-sm opacity-80'
                    : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className={`flex-shrink-0 transition-transform active:scale-90 ${
                      task.isCompleted ? 'text-green-500' : 'text-slate-300 group-hover:text-indigo-400'
                    }`}
                  >
                    {task.isCompleted ? (
                      <CheckCircle size={32} className="fill-green-50" />
                    ) : (
                      <Circle size={32} />
                    )}
                  </button>
                  <div>
                    <h3 className={`font-bold text-lg ${task.isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                        +{task.points} 分
                      </span>
                    </div>
                  </div>
                </div>
                
                {task.isCompleted && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <span className="text-4xl opacity-20 rotate-12 select-none">👍</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeView;