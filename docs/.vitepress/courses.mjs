export const repository = 'https://github.com/Kinkox-00/xiangzhuogong-study-handbook'
export const siteUrl = 'https://quant-engineering-review-kinoja.netlify.app'

// Shared by the catalog, course overviews, navigation and reading tools.
export const courses = [
  {
    id: 'quant-engineering', number: '01', title: '量化工程分析',
    category: '工程与数学', english: 'ENGINEERING & MATHEMATICS', color: 'green',
    description: '从图的连接关系，到系统的最优控制与运动建模。',
    scope: '图论、最优化控制、力学与轮式机器人运动学',
    image: '/images/engineering.png', imageAlt: '六个顶点及其连接关系的无向图',
    chapters: [
      { title: '图论基础', slug: 'graph-theory', description: '矩阵表示、连通性、最短路、树与网络流', keywords: 'Warshall Euler Hamilton TSP Dijkstra Huffman Kruskal Prim 欧拉 哈密顿' },
      { title: '最优化控制方法', slug: 'optimal-control', description: '变分法、Euler 方程、最小值原理与 LQR', keywords: 'Riccati Pontryagin 横截条件' },
      { title: '拉格朗日力学', slug: 'lagrange', description: '约束、虚位移、能量与动力学方程', keywords: '动量轮 倒立摆 达朗伯' },
      { title: '轮式机器人运动学', slug: 'kinematics', description: '自行车模型、纯滚动与转弯半径', keywords: '两轮 无侧滑 运动学' }
    ]
  },
  {
    id: 'computer-systems', number: '02', title: '计算机系统',
    category: '计算机', english: 'COMPUTER SYSTEMS', color: 'blue',
    description: '沿着一段程序，理解数据、指令与存储如何协作。',
    scope: '以 CSAPP 为主线的计算机系统期末复习',
    image: '/images/systems.png', imageAlt: '虚拟地址经 TLB 和页表转换为物理地址的示意图',
    chapters: [
      { title: '计算机系统期末复习', slug: 'exam-review', description: '数值表示、汇编、Cache、链接与进程', keywords: 'CSAPP x86 C TLB 页表 内存 浮点 信号 优化 Bomb Lab' }
    ]
  },
  {
    id: 'automatic-control', number: '03', title: '自动控制原理',
    category: '控制', english: 'AUTOMATIC CONTROL', color: 'violet',
    description: '从状态空间出发，理解系统的稳定、反馈与解耦。',
    scope: '当前收录现代控制理论；经典控制部分待补充',
    image: '/images/control.png', imageAlt: '欠阻尼二阶系统的单位阶跃响应曲线',
    chapters: [
      { title: '现代控制高频题型', slug: 'modern-control', description: '状态空间、能控能观、反馈、观测器与稳定性', keywords: 'Lyapunov 李雅普诺夫 极点配置' },
      { title: '镇定与解耦', slug: 'stabilization-decoupling', description: '可镇定性、状态反馈与系统解耦', keywords: '5.3 5.4 MIMO 前馈' }
    ]
  },
  {
    id: 'math-physics-1', number: '04', title: '数理综合（一）',
    category: '工程与数学', english: 'MATHEMATICS & PHYSICS I', color: 'blue',
    description: '数理综合系列课程的第一部分。',
    scope: '课程内容待补充',
    image: '/images/math-physics.png', imageAlt: '坐标系中的函数曲线示意图',
    chapters: []
  },
  {
    id: 'math-physics-2', number: '05', title: '数理综合（二）',
    category: '工程与数学', english: 'MATHEMATICS & PHYSICS II', color: 'violet',
    description: '数理综合系列课程的第二部分。',
    scope: '课程内容待补充',
    image: '/images/math-physics.png', imageAlt: '坐标系中的函数曲线示意图',
    chapters: []
  }
]

export const coursePath = (course) => `/courses/${course.id}/`
export const chapterPath = (course, chapter) => `${coursePath(course)}${chapter.slug}`
export const findCourse = (path) => courses.find((course) => path.startsWith(coursePath(course)))
