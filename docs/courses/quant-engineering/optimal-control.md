# 动态系统最优化控制方法

本页按教材第 10 章的知识顺序整理：先理解最优控制问题是什么，再学变分法、极小值原理，最后进入线性二次型最优控制。作业题放在对应知识点下面当补充例题，不再按题号硬排。

整理原则很简单：只保留能解决作业和考试题的必要内容；教材中更扩展的证明、离散系统极小值原理、优化设计细节，先不展开。

## 10-1 最优控制的一般概念

### 最优控制问题在问什么

最优控制研究的是：在系统运动规律已经给定时，怎样选择控制函数 $u(t)$，让系统从初始状态运动到目标状态，同时让性能指标 $J$ 最小或最大。

最常见的标准形式是：

$$
\dot{x}=f(x,u,t)
$$

$$
J=\varphi(x(t_f),t_f)+\int_{t_0}^{t_f}L(x,u,t)\,dt
$$

这里 $x(t)$ 是状态，$u(t)$ 是控制，$L$ 是过程代价，$\varphi$ 是终端代价。

### 四个必须先找的量

做题时先不要急着求导，先把题目拆成四块：

| 要找什么 | 在题里通常长什么样 | 作用 |
|---|---|---|
| 状态方程 | $\dot{x}=f(x,u,t)$ | 说明系统怎样运动 |
| 初末条件 | $x(t_0)=x_0$、$x(t_f)=x_f$ | 决定边界或目标 |
| 控制约束 | $\lvert u\rvert\leq 1$、$u\in U$ | 决定能不能直接令导数为零 |
| 性能指标 | $J=\int L\,dt+\varphi$ | 决定 Hamilton 函数怎么写 |

### 性能指标的常见类型

教材会把性能指标分成不同应用类型。对这份作业来说，主要记这三类就够：

1. 最小能量或二次型指标：常见形式是 $\int u^2\,dt$ 或 $\int (x^TQx+u^TRu)\,dt$。
2. 最短时间指标：常见形式是 $J=t_f$，或者 $J=\int_{t_0}^{t_f}1\,dt$。
3. 末端目标指标：终端有 $x(t_f)$、$t_f$ 或目标集约束，需要补横截条件。

### 本章方法地图

| 教材位置 | 解决什么题 | 第一反应 |
|---|---|---|
| 10-2 变分法 | 只有函数 $x(t)$ 和导数 $\dot{x}(t)$，没有控制 $u(t)$ | 写 Euler 方程 |
| 10-3 极小值原理 | 有状态方程 $\dot{x}=f(x,u,t)$，要求 $u^*(t)$ | 构造 Hamilton 函数 |
| 10-3 最小时间控制 | 指标含 $t_f$，控制又受限 | 判断 bang-bang 控制 |
| 10-4 线性二次型问题 | 线性系统加二次型指标 | 写 Riccati 方程 |

### 题型地图

| 高频题型 | 识别信号 | 破题入口 | 要补的条件 | 最容易丢分的点 |
|---|---|---|---|---|
| 变分求 $\delta J$ | 只问变分，不问最优函数 | 先写被积函数 $L$，再把 $\delta \dot{x}$ 分部积分 | 端点固定时端点项为 0 | 把 $\delta \dot{x}$ 直接当成 $\delta x$ |
| Euler 方程 | $J=\int L(t,x,\dot{x})dt$ | 套 $\frac{\partial L}{\partial x}-\frac{d}{dt}\frac{\partial L}{\partial \dot{x}}=0$ | 用边界条件定通解常数 | 漏掉通解常数，或边界条件代错 |
| 约束消元 | 题目给出 $x_1,x_2$ 的代数约束 | 先看能否把一个变量消掉 | 消元后的端点条件 | 把 $x_1,x_2$ 误当独立函数 |
| 横截条件 | 端点自由、$t_f$ 自由、终端落在曲线/曲面上 | 先判断端点能不能动 | $\lambda(t_f)=\Phi_x$ 或 $H(t_f)+\Phi_t=0$ | 终端状态固定时还乱补 $\lambda(t_f)$ |
| PMP 无约束控制 | 给出 $\dot{x}=f(x,u,t)$ 且 $u$ 无范围限制 | 写 $H=L+\lambda^Tf$ | $\dot{x}=H_\lambda,\ \dot{\lambda}=-H_x,\ H_u=0$ | 只求 $u$，忘记协态方程 |
| 控制受限 bang-bang | $\lvert u\rvert\le 1$、$u\in U$ 或饱和控制 | 在允许集合内让 $H$ 最小 | 切换函数的符号与变号点 | 仍然令 $\partial H/\partial u=0$ |
| 终端目标集 | 末端不是固定点，而是落在 $g(x_f,t_f)=0$ | 用目标集法向量写横截条件 | $\lambda(t_f)=\varphi_x+g_x^T\nu$ | 把目标集当成固定终端点 |
| 固定/自由终端时间 | 同一题比较 $t_f$ 固定和自由 | 固定时间不用时间横截，自由时间要补 | 自由时补 $H(t_f)+\Phi_t=0$ | 把固定时间解直接套到自由时间 |
| 最小时间控制 | $J=t_f$ 或 $J=\int 1dt$ | 写 $H=1+\lambda^Tf$ | 控制受限时常变成 bang-bang | 忘记 Hamilton 函数里的常数 1 |
| 有限时域 LQ | 有固定终止时刻和终端项 $x^T(t_f)Sx(t_f)$ | 写 Riccati 微分方程 | $P(t_f)=S$，从终端往前解 | 把有限时域题误做成代数 Riccati |
| 无限时域 LQR/输出调节器 | $J=\int_0^\infty(x^TQx+u^TRu)dt$ 或惩罚输出 $y$ | 解代数 Riccati | $u=-R^{-1}B^TPx$ | 输出惩罚时忘记 $Q=C^TQ_yC$ |

## 10-2 最优控制中的变分法

### 泛函与变分

变分法处理的不是“求一个数”，而是“求一条函数”。典型问题写成：

$$
J=\int_{t_0}^{t_f}L(t,x,\dot{x})\,dt
$$

如果最优函数是 $x^*(t)$，可以给它加一个很小的扰动：

$$
x(t)=x^*(t)+\varepsilon\eta(t)
$$

当 $x^*(t)$ 使 $J$ 取极值时，一阶变分要为零：

$$
\delta J=0
$$

这一步的直觉是：最优轨线附近轻轻挪一下，指标的一阶变化应该消失。

### 如何求变分

求变分可以按固定模板做，不要一上来背 Euler 方程。先把 $x$ 和 $\dot{x}$ 都看成会被扰动的量：

$$
x(t)\rightarrow x(t)+\delta x(t)
$$

$$
\dot{x}(t)\rightarrow \dot{x}(t)+\delta\dot{x}(t)
$$

对泛函

$$
J=\int_{t_0}^{t_f}L(t,x,\dot{x})\,dt
$$

一阶变分是：

$$
\delta J
=
\int_{t_0}^{t_f}
\left(
\frac{\partial L}{\partial x}\delta x
+
\frac{\partial L}{\partial\dot{x}}\delta\dot{x}
\right)dt
$$

这里最关键的是第二项，因为 $\delta\dot{x}$ 不是最后想保留的形式。要用分部积分把它变成 $\delta x$：

$$
\int_{t_0}^{t_f}
\frac{\partial L}{\partial\dot{x}}\delta\dot{x}\,dt
=
\left[
\frac{\partial L}{\partial\dot{x}}\delta x
\right]_{t_0}^{t_f}
-
\int_{t_0}^{t_f}
\frac{d}{dt}
\left(
\frac{\partial L}{\partial\dot{x}}
\right)
\delta x\,dt
$$

所以求变分的最终常用形态是：

$$
\delta J
=
\left[
\frac{\partial L}{\partial\dot{x}}\delta x
\right]_{t_0}^{t_f}
+
\int_{t_0}^{t_f}
\left[
\frac{\partial L}{\partial x}
-
\frac{d}{dt}
\left(
\frac{\partial L}{\partial\dot{x}}
\right)
\right]\delta x\,dt
$$

考试时记住一句话：先求偏导，再把 $\delta\dot{x}$ 分部积分成 $\delta x$。

::: details 点击展开：补充例题：作业第 1 题

题型入口：题目只要求求 $\delta J$，还没有要求求极值函数，所以目标是把变分写出来，不必先解微分方程。

题目中的性能指标为：

$$
J=\int_{t_0}^{t_f}
\left(
t^2+x^2+\dot{x}^2
\right)dt
$$

先认出：

$$
L=t^2+x^2+\dot{x}^2
$$

求两个偏导：

$$
\frac{\partial L}{\partial x}=2x
$$

$$
\frac{\partial L}{\partial\dot{x}}=2\dot{x}
$$

代入一阶变分：

$$
\delta J
=
\int_{t_0}^{t_f}
\left(
2x\delta x+2\dot{x}\delta\dot{x}
\right)dt
$$

对含 $\delta\dot{x}$ 的项分部积分：

为什么一定要分部积分：极值条件最后要利用“$\delta x$ 任意”推出括号内为 0，但 $\delta\dot{x}$ 不是独立扰动，它来自 $\delta x$ 的导数。分部积分就是把导数从扰动上挪回原函数上，同时保留端点项。

$$
\int_{t_0}^{t_f}2\dot{x}\delta\dot{x}\,dt
=
\left[
2\dot{x}\delta x
\right]_{t_0}^{t_f}
-
\int_{t_0}^{t_f}2\ddot{x}\delta x\,dt
$$

因此：

$$
\delta J
=
\left[
2\dot{x}\delta x
\right]_{t_0}^{t_f}
+
\int_{t_0}^{t_f}
2(x-\ddot{x})\delta x\,dt
$$

也可以把端点项展开：

$$
\delta J
=
2\dot{x}(t_f)\delta x(t_f)
-
2\dot{x}(t_0)\delta x(t_0)
+
\int_{t_0}^{t_f}
2(x-\ddot{x})\delta x\,dt
$$

如果题目进一步说两端固定，则：

$$
\delta x(t_0)=0,
\qquad
\delta x(t_f)=0
$$

端点项消失，只剩：

$$
\delta J
=
\int_{t_0}^{t_f}
2(x-\ddot{x})\delta x\,dt
$$

这时若继续要求极值，才令 $\delta J=0$，得到 Euler 方程对应的结果：

$$
x-\ddot{x}=0
$$

易错点：$\delta\dot{x}$ 不能直接当成 $\delta x$。必须先做分部积分，否则后面推不出 Euler 方程。

:::

### Euler 方程

对泛函

$$
J=\int_{t_0}^{t_f}L(t,x,\dot{x})\,dt
$$

固定端点时，必要条件是 Euler 方程：

$$
\frac{\partial L}{\partial x}
-
\frac{d}{dt}
\left(
\frac{\partial L}{\partial \dot{x}}
\right)
=0
$$

考试起手式：

1. 先认出 $L(t,x,\dot{x})$。
2. 分别求 $\partial L/\partial x$ 和 $\partial L/\partial\dot{x}$。
3. 代入 Euler 方程，解出 $x(t)$。
4. 用边界条件定常数。

::: details 点击展开：补充例题：作业第 2 题

题型入口：只有 $x$ 和 $\dot{x}$，没有 $u$，所以用 Euler 方程。

若题目给出：

$$
J=\int_0^1(1+\dot{x}^2)\,dt,
\qquad
x(0)=1,\quad x(1)=2
$$

则

$$
L=1+\dot{x}^2
$$

因此

$$
\frac{\partial L}{\partial x}=0,
\qquad
\frac{\partial L}{\partial\dot{x}}=2\dot{x}
$$

代入 Euler 方程：

$$
0-\frac{d}{dt}(2\dot{x})=0
$$

这里 $\frac{\partial L}{\partial x}=0$，说明被积函数不直接含 $x$；$\frac{\partial L}{\partial\dot{x}}=2\dot{x}$ 再对 $t$ 求导，才得到 $2\ddot{x}$。这一行不是跳步，而是把 Euler 方程完整代入。

所以

$$
\ddot{x}=0
$$

积分两次：

$$
x(t)=c_1t+c_2
$$

再由边界条件得到：

$$
x^*(t)=t+1
$$

这类题的记忆点：如果 $L$ 只含 $\dot{x}^2$，Euler 方程通常会把问题化成 $\ddot{x}=0$，最优轨线就是直线。

:::

### 带约束的泛函极值

如果题目给出几何约束或函数约束，先判断能不能用约束消去变量。作业第 3 题就是这个思路。

若有约束：

$$
t^2+x_1^2=R^2
$$

可以先写成：

$$
x_1(t)=-\sqrt{R^2-t^2}
$$

这一步的含义是：约束已经把 $x_1$ 绑在圆弧上，真正还能自由选择的只剩 $x_2(t)$。所以不能把 $x_1,x_2$ 当两个独立函数分别套 Euler 方程。

这样原问题就从两个未知函数变成只需要处理 $x_2(t)$。如果新的被积函数不显含 $x_2$，Euler 方程会化简为：

$$
\frac{d}{dt}
\left(
\frac{\partial L}{\partial\dot{x}_2}
\right)=0
$$

也就是：

$$
\frac{\partial L}{\partial\dot{x}_2}=C
$$

作业参考结果是：

$$
x_2^*(t)=2R\arcsin\frac{t}{R}
$$

易错点：不要把 $x_1$、$x_2$ 当成两个完全独立的函数各套一遍普通 Euler 方程；约束已经说明它们之间有关系。

### 横截条件

端点固定时，端点扰动为零；端点自由或终端时间自由时，端点项不能直接丢掉，这时要补横截条件。

#### 哈密顿函数下横截条件一般式

Hamilton 形式下最常见的是 Bolza 型问题：

$$
J=\varphi(x(t_f),t_f)+\int_{t_0}^{t_f}L(x,u,t)\,dt,
\qquad
H=L+\lambda^Tf
$$

如果终端状态不是固定点，而是落在目标集

$$
\psi(x(t_f),t_f)=0
$$

先构造终端增广函数：

$$
\Phi=\varphi+\nu^T\psi
$$

其中 $\nu$ 是终端约束对应的乘子。终端状态横截条件为：

$$
\lambda(t_f)=\frac{\partial\Phi}{\partial x_f}
=
\varphi_x(x_f,t_f)+\psi_x^T(x_f,t_f)\nu
$$

如果终端时间 $t_f$ 自由，还要补时间横截条件：

$$
H(t_f)+\frac{\partial\Phi}{\partial t_f}=0
$$

也就是：

$$
H(t_f)+\varphi_{t_f}(x_f,t_f)+\nu^T\psi_{t_f}(x_f,t_f)=0
$$

注意一个很容易混淆的点：如果终端状态固定，则 $\delta x(t_f)=0$，通常直接使用边界条件 $x(t_f)=x_f$，不再额外规定 $\lambda(t_f)$。

横截条件速查表：

| 终端情况 | 该写什么 | 记忆方式 |
|---|---|---|
| 终端状态固定 | $x(t_f)=x_f$ | 末端不能动，只用边界条件 |
| 终端状态自由 | $\lambda(t_f)=\varphi_x$ | 末端能动，协态接上终端代价梯度 |
| 终端时间自由 | $H(t_f)+\varphi_{t_f}=0$ | 时间也能动，所以 Hamilton 要补条件 |
| 终端目标集 | $\lambda(t_f)=\varphi_x+\psi_x^T\nu$ | 协态沿目标集法向量方向补偿 |
| 终端目标集且时间自由 | 再补 $H(t_f)+\varphi_t+\nu^T\psi_t=0$ | 状态能沿集合动，时间也能动 |

::: details 点击展开：补充例题：作业第 4 题

题型入口：起点固定，末端有约束，且 $t_f$ 自由。

做题顺序：

1. 先用 Euler 方程求通解。
2. 用起点条件和末端约束定一部分常数。
3. 因为 $t_f$ 自由，再用横截条件补最后一个方程。

这里的难点不是 Euler 方程，而是末端条件。起点固定表示 $\delta x(t_0)=0$，起点端点项可以扔掉；末端有约束且 $t_f$ 自由，表示末端点可以沿着给定约束曲线滑动，$\delta x(t_f)$ 和 $\delta t_f$ 之间有关系，不能分别当成 0。

所以破题时要先把末端约束写成：

$$
\psi(x(t_f),t_f)=0
$$

再用约束的微分关系：

$$
\psi_x\delta x(t_f)+\psi_t\delta t_f=0
$$

把端点项合并，补出横截条件。直觉上看，末端不是“钉死的点”，而是在一条曲线上选最优落点，所以必须多一个末端最优性条件。

作业参考结果为：

$$
x^*(t)=t^2-6t+9
$$

$$
t_f=5
$$

$$
J_{\min}=\frac{64}{3}
$$

:::

## 10-3 极小值原理及其应用

### 为什么要用极小值原理

变分法适合处理 $J=\int L(t,x,\dot{x})\,dt$ 这类问题。但最优控制题通常多了状态方程：

$$
\dot{x}=f(x,u,t)
$$

这时要把状态方程作为约束放进问题里，教材用的核心工具就是 Pontryagin 极小值原理。

### Hamilton 函数

先构造 Hamilton 函数：

$$
H=L+\lambda^Tf
$$

其中 $\lambda(t)$ 是协态变量，也可以理解成“状态约束的拉格朗日乘子函数”。

极小值原理的基本方程是：

$$
\dot{x}=\frac{\partial H}{\partial\lambda}
$$

$$
\dot{\lambda}=-\frac{\partial H}{\partial x}
$$

如果控制 $u$ 不受约束，最优控制满足：

$$
\frac{\partial H}{\partial u}=0
$$

如果控制 $u$ 受约束，则不能直接令导数为零，而要在允许集合里让 $H$ 最小：

$$
H(x^*,u^*,\lambda,t)
=
\min_{u\in U}H(x^*,u,\lambda,t)
$$

### 末端自由与末端约束

如果终端状态自由，且终端代价是 $\varphi(x(t_f),t_f)$，常用条件是：

$$
\lambda(t_f)=\frac{\partial\varphi}{\partial x(t_f)}
$$

如果终端状态固定，比如 $x(t_f)=x_f$，那么 $x(t_f)$ 不能变，通常由终端状态方程直接给边界条件。

如果终端时间 $t_f$ 自由，还要补：

$$
H(t_f)+\frac{\partial\varphi}{\partial t_f}=0
$$

::: details 点击展开：补充例题：作业第 5 题

题型入口：有状态方程 $\dot{x}=u$，终端时间自由，所以用极小值原理加横截条件。

题目核心结构：

$$
\dot{x}=u,
\qquad
x(0)=1,
\qquad
x(t_f)=0
$$

$$
J=2t_f+\frac{1}{2}\int_0^{t_f}u^2(t)\,dt
$$

这道题最容易卡在横截条件为什么写成 $H(t_f)=0$。关键是 $2t_f$ 可以有两种等价处理方式。

第一种写法：把 $2t_f$ 当成终端项：

$$
\varphi(x(t_f),t_f)=2t_f,
\qquad
L=\frac{1}{2}u^2
$$

这时 Hamilton 函数不含那个常数 2：

$$
H_0=\frac{1}{2}u^2+\lambda u
$$

因为 $t_f$ 自由，时间横截条件是：

$$
H_0(t_f)+\frac{\partial\varphi}{\partial t_f}=0
$$

也就是：

$$
H_0(t_f)+2=0
$$

第二种写法：把 $2t_f$ 写成积分项：

$$
2t_f=\int_0^{t_f}2\,dt
$$

于是：

$$
L=2+\frac{1}{2}u^2,
\qquad
\varphi=0
$$

这时 Hamilton 函数为：

$$
H=2+\frac{1}{2}u^2+\lambda u
$$

因为采用的是第二种写法，终端项 $\varphi=0$，又因为终端时间 $t_f$ 自由，所以横截条件变成：

$$
H(t_f)+\frac{\partial\varphi}{\partial t_f}=0
\quad\Rightarrow\quad
H(t_f)=0
$$

终端状态 $x(t_f)=0$ 是固定的，所以它只提供边界条件，不额外规定 $\lambda(t_f)$。

协态方程：

$$
\dot{\lambda}
=
-\frac{\partial H}{\partial x}
=0
$$

所以 $\lambda$ 是常数，记为 $c$。无约束控制满足：

$$
\frac{\partial H}{\partial u}=u+\lambda=0
$$

因此：

$$
u^*=-\lambda=-c
$$

代回状态方程：

$$
\dot{x}=u=-c
$$

由 $x(0)=1$ 得：

$$
x(t)=1-ct
$$

再用终端状态 $x(t_f)=0$：

$$
1-ct_f=0
\quad\Rightarrow\quad
t_f=\frac{1}{c}
$$

最后用自由终端时间的横截条件：

$$
H(t_f)=0
$$

代入 $u=-c,\lambda=c$：

$$
H
=
2+\frac{1}{2}c^2-c^2
=
2-\frac{1}{2}c^2
=0
$$

所以：

$$
c^2=4
$$

由于 $t_f=\frac{1}{c}>0$，取 $c=2$，于是：

$$
u^*(t)=-2
$$

$$
t_f=\frac{1}{2}
$$

$$
J_{\min}=2
$$

易错点：如果你选第一种写法，就要写 $H_0(t_f)+2=0$；如果你选第二种写法，就写 $H(t_f)=0$。两种写法等价，但不能把常数 2 既写进 $H$，又再额外加一次。

:::

### 控制受限与 bang-bang 控制

如果 $H$ 关于 $u$ 是线性的，而 $u$ 又有界，例如：

$$
\lvert u\rvert\leq 1
$$

那么最优控制通常取边界值，而不是取中间值。这就是 bang-bang 控制。

典型判断形式：

$$
H=\cdots+\lambda u
$$

为了使 $H$ 最小：

$$
u^*=
\begin{cases}
-1, & \lambda>0\\
1, & \lambda<0
\end{cases}
$$

如果 $\lambda$ 变号，控制也会在边界之间切换。

::: details 点击展开：补充例题：作业第 6 题

题型入口：有控制约束，不能直接写 $\partial H/\partial u=0$。

做题时先写：

$$
H=L+\lambda f
$$

再看 $H$ 中关于 $u$ 的项。如果它是线性的，就比较 $u=1$ 和 $u=-1$ 哪个让 $H$ 更小。

通用写法是：

$$
u^*(t)=
\operatorname*{arg\,min}_{\lvert u\rvert\leq 1}H(x^*,u,\lambda,t)
$$

这比直接套一阶导数更稳，因为有界控制的最优值经常出现在边界。

为什么不能令 $\partial H/\partial u=0$：一阶导数为零只适合“最优点可能在开区间内部”的情况；但 $\lvert u\rvert\le 1$ 把可选控制限制在闭区间里，如果 $H$ 对 $u$ 是线性的，最小值一定在端点。考试时看 $u$ 前面的系数，系数为正就取 $u=-1$，系数为负就取 $u=1$。

:::

### 终端目标集

有些题不是要求到达一个固定点，而是要求末端落在某个目标集上：

$$
g(x(t_f),t_f)=0
$$

这时终端协态通常要和目标集约束的梯度有关。记成考试可用的形式：

$$
\lambda(t_f)
=
\frac{\partial\varphi}{\partial x(t_f)}
+
\nu^T
\frac{\partial g}{\partial x(t_f)}
$$

其中 $\nu$ 是终端约束的乘子。

::: details 点击展开：补充例题：作业第 7 题

题型入口：末端不是给定单点，而是给定目标集。

做题顺序：

1. 写 Hamilton 函数。
2. 写状态方程和协态方程。
3. 写 $u$ 的极小值条件。
4. 用目标集方程给末端约束。
5. 用目标集的横截条件补齐方程。

如果目标集写成：

$$
g(x(1))=x_1(1)+x_2(1)-1=0
$$

那么目标集的法向量是：

$$
g_x=
\begin{bmatrix}
1\\
1
\end{bmatrix}
$$

没有终端代价时，横截条件给出：

$$
\lambda(1)=\nu g_x
=
\nu
\begin{bmatrix}
1\\
1
\end{bmatrix}
$$

所以：

$$
\lambda_1(1)=\lambda_2(1)
$$

这不是凭空相等，而是因为末端只能落在直线 $x_1+x_2=1$ 上，协态方向必须沿着这条直线的法向量。

易错点：目标集题不能只写 $x(t_f)=x_f$。它的末端条件来自集合方程和集合的法向量方向。

:::

### 固定终端时间与自由终端时间

固定 $t_f$ 时，不需要 $H(t_f)=0$ 这一类终端时间条件；自由 $t_f$ 时必须补。

| 终端时间 | 要不要补时间横截条件 | 常见结果 |
|---|---|---|
| $t_f$ 固定 | 不补 | 只用状态和协态边界条件 |
| $t_f$ 自由 | 要补 | 多一个 $H(t_f)+\partial\varphi/\partial t_f=0$ |

作业第 8 题的关键就是比较这两种情形。不要把固定终端时间的解和自由终端时间的解混用。

判断时先问一句：题目有没有给死 $t_f$ 的数值？给了，比如 $t_f=1$，就不能再写 $H(t_f)=0$；没给而要求一起优化，就要把 $t_f$ 当未知量，多列时间横截条件。

### 最小时间控制

最小时间问题通常把性能指标写成：

$$
J=t_f
$$

也可以写成：

$$
J=\int_{t_0}^{t_f}1\,dt
$$

所以 Hamilton 函数中常出现常数项：

$$
H=1+\lambda^Tf
$$

如果控制受限，并且 $H$ 对控制线性，最小时间控制往往也是 bang-bang 控制。

::: details 点击展开：补充例题：作业第 9 题

题型入口：最短时间加控制有界。

起手写：

$$
H=1+\lambda^Tf
$$

这个常数 1 来自最小时间指标 $J=\int 1dt$。如果漏掉它，后面的 $H(t_f)=0$ 会整体错位。

然后按以下顺序：

1. 写协态方程 $\dot{\lambda}=-\partial H/\partial x$。
2. 看 $H$ 里含 $u$ 的项。
3. 在允许范围内选让 $H$ 最小的边界控制。
4. 若 $t_f$ 自由，补 $H(t_f)=0$。

这类题的核心不是“求导等于零”，而是“在控制边界上选方向”。

判断有没有切换时，看切换函数，也就是 $H$ 中乘在 $u$ 前面的系数。它在整个区间不变号，就是无切换；只变号一次，就是一次切换；如果变号点算出来不在允许时间区间内，也按无切换处理。

:::

## 10-4 线性二次型问题的最优控制

### LQ 与 LQR 标准型

线性二次型问题的系统一般写成：

$$
\dot{x}=Ax+Bu
$$

指标一般写成：

$$
J=\int_0^\infty
\left(
x^TQx+u^TRu
\right)dt
$$

其中 $Q$ 用来惩罚状态偏差，$R$ 用来惩罚控制能量。

如果 $R>0$，最优控制通常写成状态反馈：

$$
u^*=-R^{-1}B^TPx
$$

其中 $P$ 由 Riccati 方程确定。

### Riccati 方程

无限时间定常 LQR 的代数 Riccati 方程为：

$$
A^TP+PA-PBR^{-1}B^TP+Q=0
$$

解出 $P$ 后，反馈矩阵是：

$$
K=R^{-1}B^TP
$$

所以：

$$
u^*=-Kx
$$

最优指标常写为：

$$
J^*=x^T(0)Px(0)
$$

有限时域 LQ 不用上面的代数 Riccati，而是用 Riccati 微分方程。若

$$
J=\frac{1}{2}x^T(t_f)Sx(t_f)+\frac{1}{2}\int_0^{t_f}
\left(
x^TQx+u^TRu
\right)dt
$$

则：

$$
-\dot{P}=A^TP+PA-PBR^{-1}B^TP+Q,
\qquad
P(t_f)=S
$$

然后：

$$
u^*(t)=-R^{-1}B^TP(t)x(t)
$$

::: details 点击展开：补充例题：自测第 10 题（有限时域 LQ）

题型入口：线性系统、二次型指标、终端时刻固定为 3，并且指标里有终端项。所以它是有限时域 LQ，不是无限时域 LQR。

系统为：

$$
\dot{x}_1=x_2,
\qquad
\dot{x}_2=u
$$

写成矩阵：

$$
\dot{x}=Ax+Bu,
\qquad
A=
\begin{bmatrix}
0 & 1\\
0 & 0
\end{bmatrix},
\quad
B=
\begin{bmatrix}
0\\
1
\end{bmatrix}
$$

性能指标可整理成：

$$
J=
\frac{1}{2}x^T(3)Sx(3)
+
\frac{1}{2}\int_0^3
\left(
x^TQx+u^TRu
\right)dt
$$

其中终端项

$$
\frac{1}{2}\left[x_1^2(3)+2x_2^2(3)\right]
$$

给出：

$$
S=
\begin{bmatrix}
1 & 0\\
0 & 2
\end{bmatrix}
$$

积分项

$$
2x_1^2+4x_2^2+2x_1x_2+\frac{1}{2}u^2
$$

对应：

$$
Q=
\begin{bmatrix}
2 & 1\\
1 & 4
\end{bmatrix},
\qquad
R=\frac{1}{2}
$$

注意交叉项为什么是 $Q_{12}=Q_{21}=1$：因为

$$
x^TQx=Q_{11}x_1^2+2Q_{12}x_1x_2+Q_{22}x_2^2
$$

所以 $2Q_{12}x_1x_2=2x_1x_2$，得到 $Q_{12}=1$。

有限时域 Riccati 边值问题为：

$$
-\dot{P}
=
A^TP+PA-PBR^{-1}B^TP+Q,
\qquad
P(3)=S
$$

设

$$
P(t)=
\begin{bmatrix}
p_{11}(t) & p_{12}(t)\\
p_{12}(t) & p_{22}(t)
\end{bmatrix}
$$

则最优控制写成：

$$
u^*(t)
=
-R^{-1}B^TP(t)x(t)
=
-2\left[p_{12}(t)x_1(t)+p_{22}(t)x_2(t)\right]
$$

这题的答案重点不是算出闭式 $P(t)$，而是把“终端条件 $P(3)=S$，从 $t=3$ 往前解 Riccati 微分方程”这个结构写对。

:::

### 输出调节器

如果指标惩罚的是输出 $y=Cx$，比如：

$$
J=\int_0^\infty
\left(
y^TQ_y y+u^TRu
\right)dt
$$

要先把它改写成状态形式：

$$
y^TQ_y y=x^TC^TQ_yCx
$$

因此状态权重矩阵是：

$$
Q=C^TQ_yC
$$

这一步是自测第 11 题最容易错的地方：题目惩罚输出，不一定惩罚所有状态。

::: details 点击展开：补充例题：自测第 11 题（输出调节器）

题型入口：线性系统、二次型指标、输出 $y=x_1$。

如果：

$$
y=x_1
$$

那么：

$$
C=
\begin{bmatrix}
1 & 0
\end{bmatrix}
$$

如果输出权重 $Q_y=1$，则：

$$
Q=
\begin{bmatrix}
1 & 0\\
0 & 0
\end{bmatrix}
$$

这正是 $Q=C^TQ_yC$ 的来源：指标惩罚的是 $y^2=x_1^2$，不是同时惩罚 $x_1^2+x_2^2$。

不是：

$$
Q=
\begin{bmatrix}
1 & 0\\
0 & 1
\end{bmatrix}
$$

参考答案中给出的 Riccati 解为：

$$
P=
\begin{bmatrix}
2 & 2\\
2 & 4
\end{bmatrix}
$$

所以：

$$
u^*
=
-\frac{1}{4}
\begin{bmatrix}
0 & 1
\end{bmatrix}
\begin{bmatrix}
2 & 2\\
2 & 4
\end{bmatrix}
\begin{bmatrix}
x_1\\
x_2
\end{bmatrix}
$$

化简得：

$$
u^*=-\frac{1}{2}x_1-x_2
$$

若 $y=x_1$ 且 $\dot{y}=x_2$，也可以写成：

$$
u^*=-\frac{1}{2}y-\dot{y}
$$

:::

::: details 点击展开：补充例题：单摆控制系统

题型入口：先把二阶微分方程化为状态空间，再套 LQR。

原系统：

$$
\ddot{x}+\omega^2x=u
$$

令：

$$
x_1=x,
\qquad
x_2=\dot{x}
$$

则：

$$
\dot{x}_1=x_2
$$

$$
\dot{x}_2=-\omega^2x_1+u
$$

所以：

$$
A=
\begin{bmatrix}
0 & 1\\
-\omega^2 & 0
\end{bmatrix},
\qquad
B=
\begin{bmatrix}
0\\
1
\end{bmatrix}
$$

若指标为：

$$
J=\int_0^\infty
\left(
\dot{x}^2+ru^2
\right)dt
$$

因为 $\dot{x}=x_2$，所以：

$$
Q=
\begin{bmatrix}
0 & 0\\
0 & 1
\end{bmatrix},
\qquad
R=r
$$

作业参考结果为：

$$
u^*(t)=-\frac{1}{r}\dot{x}(t)
$$

易错点：题目惩罚的是速度 $\dot{x}$，不是位移 $x$，所以 $Q$ 的权重落在第二个状态上。

:::

## 作业/自测题定位表

| 题号 | 对应教材知识 | 破题入口 |
|---|---|---|
| 第 1 题 | 10-2 泛函与变分 | 先写 $\delta J$，再对 $\delta\dot{x}$ 分部积分 |
| 第 2 题 | 10-2 Euler 方程 | 找 $L$，代入 Euler 方程 |
| 第 3 题 | 10-2 带约束泛函极值 | 先用约束消元 |
| 第 4 题 | 10-2 横截条件 | $t_f$ 自由，补端点条件 |
| 第 5 题 | 10-3 极小值原理 | 写 $H=L+\lambda f$ |
| 第 6 题 | 10-3 控制受限 | 在允许区间内让 $H$ 最小 |
| 第 7 题 | 10-3 终端目标集 | 目标集约束给末端条件 |
| 第 8 题 | 10-3 固定与自由终端时间 | 对比是否需要时间横截条件 |
| 第 9 题 | 10-3 最小时间控制 | $H=1+\lambda^Tf$，再判 bang-bang |
| 自测第 10 题 | 10-4 有限时域 LQ | 终端项给 $P(t_f)=S$，倒推 Riccati 微分方程 |
| 自测第 11 题 | 10-4 LQR / 输出调节器 | 先由 $y=Cx$ 构造 $Q=C^TQ_yC$ |
| 单摆题 | 10-4 LQR | 先化状态空间，再写 Riccati |

## 考前最小公式表

### 变分法

$$
J=\int_{t_0}^{t_f}L(t,x,\dot{x})\,dt
$$

$$
\frac{\partial L}{\partial x}
-
\frac{d}{dt}
\left(
\frac{\partial L}{\partial\dot{x}}
\right)
=0
$$

### 极小值原理

$$
H=L+\lambda^Tf
$$

$$
\dot{x}=\frac{\partial H}{\partial\lambda}
$$

$$
\dot{\lambda}=-\frac{\partial H}{\partial x}
$$

$$
\frac{\partial H}{\partial u}=0
$$

无约束控制用上式；有约束控制改为在允许集合内让 $H$ 取最小值。

### 横截条件

$$
\lambda(t_f)=\frac{\partial\varphi}{\partial x(t_f)}
$$

$$
H(t_f)+\frac{\partial\varphi}{\partial t_f}=0
$$

如果有终端目标集 $\psi(x(t_f),t_f)=0$，先写 $\Phi=\varphi+\nu^T\psi$，再用：

$$
\lambda(t_f)=\Phi_x,
\qquad
H(t_f)+\Phi_t=0
$$

### 有限时域 LQ

$$
\dot{x}=Ax+Bu
$$

$$
-\dot{P}=A^TP+PA-PBR^{-1}B^TP+Q,
\qquad
P(t_f)=S
$$

$$
u^*(t)=-R^{-1}B^TP(t)x(t)
$$

### 无限时域 LQR

$$
A^TP+PA-PBR^{-1}B^TP+Q=0
$$

$$
u^*=-R^{-1}B^TPx
$$

$$
J^*=x^T(0)Px(0)
$$

## 最快判断清单

1. 题目只有 $x$、$\dot{x}$：用变分法和 Euler 方程。
2. 题目出现 $\dot{x}=f(x,u,t)$：用极小值原理。
3. 控制有界：不要急着令 $\partial H/\partial u=0$，先看边界。
4. 终端时间自由：必须补时间横截条件。
5. 线性系统加二次型指标：转到 Riccati 方程。
6. 有终端项和固定终止时刻：用有限时域 Riccati 微分方程，不用代数 Riccati。
7. 指标惩罚输出 $y$：先把 $y=Cx$ 改成状态权重 $Q=C^TQ_yC$。
