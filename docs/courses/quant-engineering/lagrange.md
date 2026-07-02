# 拉格朗日方程

本页按课件和自测题的要求整理：先讲约束、虚位移、虚功原理和达朗伯原理，再推出基本形式与保守系的拉格朗日方程，最后用圆柱纯滚动、曲柄滑块、圆锥面质点和动量轮倒立摆做题型入口。

## 考试入口

| 题目问法 | 先定位到 | 卷面动作 |
|---|---|---|
| 约束、约束反力、几何约束、完整约束 | 约束与自由度 | 判断限制的是位置还是速度 |
| 虚位移与实位移区别 | 虚位移 | 强调“固定时刻、满足约束、假想” |
| 理想约束与虚功原理 | 虚功原理 | 写约束反力虚功为零 |
| 达朗伯原理 | 达朗伯-拉格朗日原理 | 加惯性力，把动力学写成虚拟平衡 |
| 广义坐标、广义速度、广义力、广义动量 | 广义量 | 写定义与物理含义 |
| 基本形式/保守系拉格朗日方程 | 拉格朗日方程 | 先写 $T,Q_i$，保守系写 $L=T-V$ |
| 如何选广义坐标 | 操作模板 | 自由度等于坐标数，尽量自动满足约束 |
| 动量轮倒立摆 | 应用建模 | 写 $T,V,L,D,Q_i$，再代入方程 |

## 约束与自由度

约束是对系统运动的限制。约束反力是为了维持约束而出现的力，例如光滑杆对滑块的支持力、铰链对杆的反力。

几何约束只含位置和时间：

$$
f(\mathbf r_1,\mathbf r_2,\cdots,\mathbf r_n,t)=0
$$

完整约束是可以积分成坐标关系的约束。考试中最常见的是几何约束，所以几何约束通常就是完整约束。

自由度是描述系统位形所需的独立参数个数。如果 $n$ 个质点在三维空间中运动，原本有 $3n$ 个坐标；若有 $s$ 个独立完整约束，则自由度为：

$$
N=3n-s
$$

广义坐标的个数必须等于自由度。它不一定是长度，也可以是角度、弧长或任何能唯一描述位形的参数。

::: details 点击展开：自测题答题卡：约束、自由度、广义坐标

**约束**：限制系统可能运动的条件。

**约束反力**：维持约束所需要的反作用力，方向和大小通常未知，但在理想约束下可以通过虚功原理消去。

**几何约束**：只限制位置，如摆长不变：

$$
x^2+y^2-l^2=0
$$

**完整约束**：能写成坐标和时间方程的约束。完整约束可以用来减少坐标数，从而选取独立广义坐标。

**广义坐标选取步骤**：

1. 先数原始坐标数。
2. 再数独立约束数。
3. 得到自由度。
4. 选同样数量的广义坐标。
5. 用广义坐标把所有质点位置写出来。

**记忆句**：自由度告诉你“需要几个数”；广义坐标告诉你“选哪几个数”。

:::

## 虚位移

虚位移是在固定时刻、满足约束条件的假想微小位移，记作：

$$
\delta \mathbf r_i
$$

它与实位移不同。实位移是系统在真实时间推进中发生的位移：

$$
d\mathbf r_i=\frac{\partial \mathbf r_i}{\partial t}dt+\sum_{j}\frac{\partial \mathbf r_i}{\partial q_j}dq_j
$$

虚位移固定时间，所以没有显含时间项：

$$
\delta \mathbf r_i=\sum_j\frac{\partial \mathbf r_i}{\partial q_j}\delta q_j
$$

一句话区别：实位移是“真的过了一小段时间”，虚位移是“时间冻结后，想象系统在约束允许方向上动一点”。

## 理想约束与虚功原理

理想约束是指约束反力对任意虚位移所作虚功为零：

$$
\sum_i \mathbf R_i\cdot \delta \mathbf r_i=0
$$

其中 $\mathbf R_i$ 是约束反力。光滑面、光滑铰链、不可伸长绳等常按理想约束处理。

虚功原理用于静力平衡：若系统平衡，则主动力对任意虚位移所作虚功为零：

$$
\sum_i \mathbf F_i\cdot \delta \mathbf r_i=0
$$

这里的 $\mathbf F_i$ 是主动力，不包含已被理想约束消去的约束反力。

::: details 点击展开：自测题答题卡：理想约束为什么有用

很多动力学题里，约束反力数量多、方向复杂。如果用牛顿法，必须把这些反力也列进方程；如果用拉格朗日法，理想约束的虚功为零，约束反力自动消失。

所以理想约束的价值不是“约束反力不存在”，而是：

$$
\text{约束反力不进入广义坐标方程}
$$

这就是拉格朗日方法比直接受力分析省力的核心原因。

:::

## 达朗伯-拉格朗日原理

达朗伯原理把动力学问题转化为形式上的静力平衡问题。对第 $i$ 个质点，引入惯性力：

$$
\mathbf F_i^{\,*}=-m_i\mathbf a_i
$$

于是主动力与惯性力的虚功和为零：

$$
\sum_i
\left(
\mathbf F_i-m_i\mathbf a_i
\right)
\cdot
\delta \mathbf r_i=0
$$

这就是达朗伯-拉格朗日原理。它的物理意义是：真实运动过程中，主动力和惯性力在所有允许虚位移上的虚功平衡。

::: details 点击展开：思想题：动力学能否归结为静力平衡

可以，但要加一句限定：这不是普通静力平衡，而是引入惯性力后的“虚拟静力平衡”。

牛顿第二定律写作：

$$
\mathbf F=m\mathbf a
$$

移项后：

$$
\mathbf F-m\mathbf a=0
$$

达朗伯原理把 $-m\mathbf a$ 看作惯性力，于是动力学方程在形式上像平衡方程。再结合虚位移和理想约束，就能消去约束反力，得到拉格朗日方程。

卷面表达可以写：

“动力学问题可在达朗伯意义下化为虚拟静力平衡问题，但该平衡包含惯性力，并不表示系统真实静止。”

:::

## 广义坐标、广义力与广义动量

设系统位形由广义坐标 $q_1,q_2,\cdots,q_s$ 描述：

$$
\mathbf r_i=\mathbf r_i(q_1,q_2,\cdots,q_s,t)
$$

广义速度是：

$$
\dot q_i
$$

广义力由虚功定义：

$$
\delta W=\sum_i \mathbf F_i\cdot \delta \mathbf r_i
=
\sum_{j=1}^{s}Q_j\delta q_j
$$

所以：

$$
Q_j=
\sum_i
\mathbf F_i\cdot
\frac{\partial \mathbf r_i}{\partial q_j}
$$

广义动量定义为：

$$
p_j=\frac{\partial L}{\partial \dot q_j}
$$

它的量纲由广义坐标决定。若 $q_j$ 是长度，$p_j$ 常是线动量；若 $q_j$ 是角度，$p_j$ 常是角动量。因此可以有“广义角动量”，它本质上就是角坐标对应的广义动量。

## 基本形式的拉格朗日方程

对理想、完整约束的系统，如果用独立广义坐标描述运动，则基本形式为：

$$
\frac{d}{dt}
\left(
\frac{\partial T}{\partial \dot q_i}
\right)
-
\frac{\partial T}{\partial q_i}
=
Q_i
$$

其中 $T$ 是系统在惯性系中的动能，$Q_i$ 是非约束主动力对应的广义力。

这个形式适合非保守力也存在的情形，例如外力、驱动力矩、摩擦力矩。

## 保守系的拉格朗日方程

若主动力都是保守力，存在势能：

$$
V=V(q_1,q_2,\cdots,q_s,t)
$$

广义力满足：

$$
Q_i=-\frac{\partial V}{\partial q_i}
$$

定义拉格朗日函数：

$$
L=T-V
$$

保守系的拉格朗日方程为：

$$
\frac{d}{dt}
\left(
\frac{\partial L}{\partial \dot q_i}
\right)
-
\frac{\partial L}{\partial q_i}
=0
$$

如果还有非保守广义力 $Q_i^{(nc)}$，则写成：

$$
\frac{d}{dt}
\left(
\frac{\partial L}{\partial \dot q_i}
\right)
-
\frac{\partial L}{\partial q_i}
=
Q_i^{(nc)}
$$

如果用瑞利耗散函数 $D$ 表示线性阻尼，常写为：

$$
\frac{d}{dt}
\left(
\frac{\partial L}{\partial \dot q_i}
\right)
-
\frac{\partial L}{\partial q_i}
+
\frac{\partial D}{\partial \dot q_i}
=
Q_i
$$

## 解题模板

课件给出的应用步骤可以压缩成六步：

1. 明确系统，确定自由度。
2. 选取广义坐标 $q_i$。
3. 用 $q_i$ 写出各质点或刚体的位置、速度。
4. 写动能 $T$ 和势能 $V$。
5. 写拉格朗日函数 $L=T-V$，必要时写广义力 $Q_i$ 或耗散函数 $D$。
6. 代入拉格朗日方程，整理运动微分方程。

### 常用动能表达

质点：

$$
T=\frac{1}{2}mv^2
$$

刚体平面运动：

$$
T=\frac{1}{2}m v_C^2+\frac{1}{2}J_C\omega^2
$$

绕固定轴转动：

$$
T=\frac{1}{2}J_O\omega^2
$$

势能通常取重力势能：

$$
V=mgh
$$

## 典型例题

::: details 点击展开：圆柱体沿斜面纯滚动

题型：确定自由度、选取广义坐标，并写出拉格朗日方程。

设圆柱质量为 $m$，半径为 $R$，转动惯量为 $I_C$，斜面倾角为 $\alpha$。取圆柱沿斜面向下的位移为广义坐标：

$$
q=s
$$

纯滚动约束为：

$$
s=R\theta
$$

所以系统只有一个自由度。动能为平动加转动：

$$
T=
\frac{1}{2}m\dot s^2+
\frac{1}{2}I_C\dot\theta^2
$$

由 $\dot\theta=\dot s/R$ 得：

$$
T=
\frac{1}{2}
\left(
m+\frac{I_C}{R^2}
\right)
\dot s^2
$$

若 $s$ 沿斜面向下为正，则势能可写作：

$$
V=-mg s\sin\alpha
$$

拉格朗日函数：

$$
L=
\frac{1}{2}
\left(
m+\frac{I_C}{R^2}
\right)
\dot s^2
+
mg s\sin\alpha
$$

代入方程：

$$
\frac{d}{dt}
\left(
\frac{\partial L}{\partial \dot s}
\right)
-
\frac{\partial L}{\partial s}
=0
$$

得到：

$$
\left(
m+\frac{I_C}{R^2}
\right)
\ddot s
=
mg\sin\alpha
$$

若为均质实心圆柱：

$$
I_C=\frac{1}{2}mR^2
$$

则：

$$
\ddot s=\frac{2}{3}g\sin\alpha
$$

易错点：不要把滚动角 $\theta$ 和位移 $s$ 当成两个独立自由度；纯滚动已经给出约束。

:::

::: details 点击展开：曲柄滑块机构的自由度与广义坐标

题型：确定机构自由度并选取广义坐标。

设曲柄 $OA$ 长为 $r$，连杆 $AB$ 长为 $l$，滑块 $B$ 在水平滑道内运动。若取曲柄转角为：

$$
q=\theta
$$

则滑块位置由几何关系确定：

$$
x_B
=
r\cos\theta+
\sqrt{
l^2-r^2\sin^2\theta
}
$$

因此该机构的位形由一个参数确定，自由度为：

$$
N=1
$$

如果题目说曲柄绕 $O$ 点匀速转动：

$$
\theta=\omega t
$$

那么它的运动已经被外部驱动规定。卷面上可以写：机构本身有一个运动自由度，可选 $\theta$ 为广义坐标；若 $\theta=\omega t$ 已给定，则动力学求解中不再是未知广义坐标，而是已知输入。

:::

::: details 点击展开：质点在圆锥面上运动

题型：根据约束选广义坐标，建立运动微分方程。

设圆锥半顶角为 $\alpha$，质点质量为 $m$。取沿母线到顶点的距离 $r$ 和绕轴转角 $\varphi$ 为广义坐标。位置可写为：

$$
x=r\sin\alpha\cos\varphi
$$

$$
y=r\sin\alpha\sin\varphi
$$

$$
z=r\cos\alpha
$$

速度平方为：

$$
v^2=\dot r^2+r^2\sin^2\alpha\,\dot\varphi^2
$$

动能：

$$
T=
\frac{1}{2}m
\left(
\dot r^2+r^2\sin^2\alpha\,\dot\varphi^2
\right)
$$

势能：

$$
V=mg r\cos\alpha
$$

拉格朗日函数：

$$
L=
\frac{1}{2}m
\left(
\dot r^2+r^2\sin^2\alpha\,\dot\varphi^2
\right)
-
mg r\cos\alpha
$$

对 $r$：

$$
\ddot r-r\sin^2\alpha\,\dot\varphi^2+g\cos\alpha=0
$$

对 $\varphi$：

$$
\frac{d}{dt}
\left(
m r^2\sin^2\alpha\,\dot\varphi
\right)
=0
$$

第二个方程说明 $\varphi$ 是循环坐标，对应广义动量守恒。

易错点：如果你把 $r$ 的正方向取反，重力项符号会变；只要坐标定义和势能表达一致即可。

:::

::: details 点击展开：动量轮倒立摆建模模板

题型：用拉格朗日方程建立机电耦合系统动力学。

课件中的模型包含摆杆和安装在顶端的动量轮。取：

$$
\theta=\text{摆杆相对竖直向上的夹角}
$$

$$
\varphi=\text{动量轮相对摆杆的转角}
$$

令摆杆和轮心平动折算到支点的转动惯量为 $J_p$，动量轮自转惯量为 $J_w$，重力项系数为：

$$
K=Mgl_p+mgl_w
$$

若动量轮绝对角速度为：

$$
\dot\theta+\dot\varphi
$$

则动能可写为：

$$
T=
\frac{1}{2}J_p\dot\theta^2+
\frac{1}{2}J_w
\left(
\dot\theta+\dot\varphi
\right)^2
$$

若 $\theta=0$ 为竖直向上位置，势能可取：

$$
V=K\cos\theta
$$

拉格朗日函数：

$$
L=T-V
$$

若电机力矩 $\tau$ 作用在相对转角 $\varphi$ 上，并考虑瑞利耗散：

$$
D=
\frac{1}{2}c_\theta\dot\theta^2+
\frac{1}{2}c_\varphi\dot\varphi^2
$$

则方程为：

$$
\frac{d}{dt}
\left(
\frac{\partial L}{\partial \dot\theta}
\right)
-
\frac{\partial L}{\partial \theta}
+
\frac{\partial D}{\partial \dot\theta}
=0
$$

$$
\frac{d}{dt}
\left(
\frac{\partial L}{\partial \dot\varphi}
\right)
-
\frac{\partial L}{\partial \varphi}
+
\frac{\partial D}{\partial \dot\varphi}
=\tau
$$

整理得：

$$
\left(
J_p+J_w
\right)\ddot\theta
+
J_w\ddot\varphi
-
K\sin\theta
+
c_\theta\dot\theta
=0
$$

$$
J_w
\left(
\ddot\theta+\ddot\varphi
\right)
+
c_\varphi\dot\varphi
=\tau
$$

若在直立点附近线性化：

$$
\sin\theta\approx \theta
$$

得到线性近似：

$$
\left(
J_p+J_w
\right)\ddot\theta
+
J_w\ddot\varphi
-
K\theta
+
c_\theta\dot\theta
=0
$$

这就是后续做控制建模、状态空间表达式和线性化分析的入口。

说明：如果把动量轮绝对角 $\psi=\theta+\varphi$ 作为广义坐标，则电机广义力会写成 $Q_\theta=-\tau,Q_\psi=\tau$。两种写法本质一致，关键是坐标定义要前后一致。

:::

## 自测题高频答法

::: details 点击展开：拉格朗日方程与虚功、达朗伯原理的关系

可以按三层逻辑写：

第一层，虚功原理处理静力学平衡，核心是：

$$
\sum_i \mathbf F_i\cdot\delta\mathbf r_i=0
$$

第二层，达朗伯原理把动力学加入惯性力，得到：

$$
\sum_i
\left(
\mathbf F_i-m_i\mathbf a_i
\right)
\cdot
\delta\mathbf r_i
=0
$$

第三层，把虚位移写成广义坐标变分：

$$
\delta \mathbf r_i=
\sum_j
\frac{\partial \mathbf r_i}{\partial q_j}
\delta q_j
$$

再利用 $\delta q_j$ 的独立性，就得到拉格朗日方程。

所以它们的关系是：虚功原理提供消去约束反力的思想，达朗伯原理把动力学写成虚功形式，广义坐标变换把它整理成拉格朗日方程。

:::

::: details 点击展开：拉格朗日方法的优势和缺点

优势：

1. 不必显式求理想约束反力。
2. 可以直接使用广义坐标，坐标数等于自由度。
3. 对复杂机构、刚体系统、耦合系统特别方便。
4. 能量表达往往比逐个方向受力分析更简洁。

缺点：

1. 必须正确选择广义坐标。
2. 必须准确写出动能和势能。
3. 非完整约束、非保守力、摩擦和碰撞问题需要额外处理。
4. 方程物理直观性有时不如牛顿受力图。

卷面记忆句：拉格朗日法用能量和坐标替代受力分解，优点是少处理约束反力，难点是坐标和能量不能写错。

:::

::: details 点击展开：基本形式与保守系形式怎么区分

如果题目出现外力、驱动力、非保守力，优先写基本形式：

$$
\frac{d}{dt}
\left(
\frac{\partial T}{\partial \dot q_i}
\right)
-
\frac{\partial T}{\partial q_i}
=Q_i
$$

如果题目明确是保守系，或只涉及重力、弹簧力等保守力，优先写：

$$
L=T-V
$$

$$
\frac{d}{dt}
\left(
\frac{\partial L}{\partial \dot q_i}
\right)
-
\frac{\partial L}{\partial q_i}
=0
$$

如果同时有保守力和驱动力，写混合形式：

$$
\frac{d}{dt}
\left(
\frac{\partial L}{\partial \dot q_i}
\right)
-
\frac{\partial L}{\partial q_i}
=Q_i^{(nc)}
$$

:::

## 最小知识清单

考前至少要能闭眼写出这些：

| 知识点 | 必背表达 |
|---|---|
| 虚位移 | 固定时刻、满足约束、假想微小位移 |
| 理想约束 | $\sum_i \mathbf R_i\cdot\delta\mathbf r_i=0$ |
| 达朗伯-拉格朗日原理 | $\sum_i(\mathbf F_i-m_i\mathbf a_i)\cdot\delta\mathbf r_i=0$ |
| 广义力 | $Q_j=\sum_i\mathbf F_i\cdot\partial\mathbf r_i/\partial q_j$ |
| 广义动量 | $p_j=\partial L/\partial\dot q_j$ |
| 基本形式 | $\frac{d}{dt}(\partial T/\partial\dot q_i)-\partial T/\partial q_i=Q_i$ |
| 保守系形式 | $\frac{d}{dt}(\partial L/\partial\dot q_i)-\partial L/\partial q_i=0$ |
| 拉氏函数 | $L=T-V$ |
| 瑞利耗散 | 方程左边加 $\partial D/\partial\dot q_i$ |
| 解题步骤 | 定自由度、选坐标、写 $T,V,Q$、代方程 |

## 参考顺序

这页的组织顺序以你的课件和自测题为主，同时参考了大学力学课程常见讲法：先从广义坐标和约束进入，再用虚功/达朗伯原理引出拉格朗日方程，最后处理非保守力、耗散和工程系统建模。

- [MIT OpenCourseWare: Engineering Dynamics, Lagrange Equations](https://ocw.mit.edu/courses/2-003sc-engineering-dynamics-fall-2011/pages/lagrange-equations/)
- [MIT OpenCourseWare: 16.07 Dynamics, Lagrange's Equations](https://ocw.mit.edu/courses/16-07-dynamics-fall-2009/pages/lecture-notes/)
- [Physics LibreTexts: Lagrangian Mechanics](https://phys.libretexts.org/Bookshelves/Classical_Mechanics)

