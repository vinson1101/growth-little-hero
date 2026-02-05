
export const initialData = {
  tasks: [
    { id: "1", title: "按时起床刷牙", points: 5, isPublished: true, isCompleted: false, isDaily: true },
    { id: "2", title: "完成数学作业", points: 15, isPublished: true, isCompleted: false, isDaily: true },
    { id: "3", title: "练习钢琴30分钟", points: 20, isPublished: true, isCompleted: false, isDaily: true },
    { id: "4", title: "整理自己的玩具", points: 10, isPublished: false, isCompleted: false, isDaily: true },
    { id: "5", title: "阅读绘本1本", points: 10, isPublished: true, isCompleted: false, isDaily: true }
  ],
  shopRewards: [
    { id: "1", title: "乐高时间 (1小时)", cost: 100, icon: "🧩" },
    { id: "2", title: "看动画片 (30分钟)", cost: 50, icon: "📺" },
    { id: "3", title: "购买一本新书", cost: 200, icon: "📚" },
    { id: "4", title: "去公园玩耍", cost: 80, icon: "🌳" },
    { id: "5", title: "麦当劳儿童套餐", cost: 300, icon: "🍔" }
  ],
  gachaPool: [] // 抽奖奖池默认为空
};
