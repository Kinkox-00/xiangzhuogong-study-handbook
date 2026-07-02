# 自行车与轮式机器人运动学

本页根据“量化 II-运动学”课件和运动学后测题整理。重点不是机械结构细节，而是考试会让你写出的运动学约束、瞬时旋转中心、转弯半径、速度分量和状态方程。

## 考试入口

| 题目问法 | 先定位到 | 卷面动作 |
|---|---|---|
| 纯滚动、无侧滑 | 轮约束 | 沿轮面方向给速度，沿轮轴方向速度为零 |
| 两轮/自行车模型 | Bicycle model | 以后轴中心 $P_r$ 为参考点写方程 |
| 前轮转角 $\delta$ 求转弯半径 | ICR | 用 $R_r=L/\tan\delta$ |
| 已知轮半径与角速度求车速 | 后轮驱动 | 用 $v=r\omega_w$ |
| 求 $\dot x,\dot y,\dot\theta$ | 状态方程 | 代入 $\dot x=v\cos\theta,\dot y=v\sin\theta$ |
| 两轮差分驱动 | 差速模型 | 用 $v=(v_R+v_L)/2,\omega=(v_R-v_L)/B$ |
| 轮式机器人移动性 | 移动灵活度 | 分清固定轮、舵轮、脚轮、全向轮 |

## 轮式移动机器人基础

轮式移动机器人适合平整地面，优点是结构简单、能耗低、速度稳定；缺点是对崎岖地形和强侧向扰动较敏感。

课件的两个基本假设是：

1. 轮子与地面只发生纯滚动。
2. 轮子不发生侧滑。

这两个假设会直接变成运动学约束。

## 位姿与坐标系

平面移动机器人常用位姿：

$$
\xi=
\begin{bmatrix}
x\\
y\\
\theta
\end{bmatrix}
$$

其中 $x,y$ 是参考点在惯性坐标系中的位置，$\theta$ 是车体纵轴相对惯性系 $X$ 轴的偏航角，逆时针为正。

车体纵向单位向量：

$$
\mathbf e_x=
\begin{bmatrix}
\cos\theta\\
\sin\theta
\end{bmatrix}
$$

车体左侧横向单位向量：

$$
\mathbf e_y=
\begin{bmatrix}
-\sin\theta\\
\cos\theta
\end{bmatrix}
$$

如果某点 $P$ 在车体纵轴上，距参考点 $P_r$ 的距离为 $l$，则：

$$
\mathbf p=
\mathbf p_r+
l\mathbf e_x
$$

其速度为：

$$
\dot{\mathbf p}
=
\dot{\mathbf p}_r+
l\dot\theta\mathbf e_y
$$

这条式子是推前轮约束、质心速度的核心。

## 轮约束

### 纯滚动约束

纯滚动表示轮子沿轮面方向的线速度等于轮缘速度。若后轮半径为 $r$，角速度为 $\omega_w$，以后轴中心 $P_r$ 为参考点，则：

$$
\dot x_r\cos\theta+\dot y_r\sin\theta
=
r\omega_w
$$

右侧也常记为车体纵向速度：

$$
v=r\omega_w
$$

### 无侧滑约束

无侧滑表示轮子横向速度为零。后轮与车体纵轴一致，所以：

$$
-\dot x_r\sin\theta+\dot y_r\cos\theta=0
$$

这说明后轴中心速度只能沿车体纵向，不能横着滑。

## 两轮自行车模型

自行车模型把前后轮各抽象为一个接地点。以后轴中心 $P_r(x_r,y_r)$ 为参考点，前后轴距为 $L$，前轮转角为 $\delta$。

<div class="graph-figure graph-wide" role="img" aria-label="自行车模型参数图">
  <svg viewBox="0 0 860 420" width="100%" height="auto">
    <defs>
      <marker id="kin-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--vp-c-text-1)" />
      </marker>
      <marker id="kin-arrow-soft" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--vp-c-brand-1)" />
      </marker>
    </defs>
    <g stroke="rgba(80,80,80,.35)" stroke-width="2">
      <line x1="70" y1="335" x2="800" y2="335" />
      <line x1="80" y1="360" x2="80" y2="70" />
    </g>
    <g fill="var(--vp-c-text-2)" font-family="Inter, Microsoft YaHei, sans-serif" font-size="18">
      <text x="805" y="341">X</text>
      <text x="68" y="65">Y</text>
    </g>
    <g transform="translate(270 275) rotate(-24)">
      <line x1="0" y1="0" x2="380" y2="0" stroke="var(--vp-c-text-1)" stroke-width="14" stroke-linecap="round" />
      <rect x="-36" y="-17" width="72" height="34" rx="5" fill="var(--vp-c-text-1)" />
      <g transform="translate(380 0) rotate(-25)">
        <rect x="-38" y="-17" width="76" height="34" rx="5" fill="var(--vp-c-text-1)" />
      </g>
      <circle cx="0" cy="0" r="6" fill="var(--vp-c-brand-1)" />
      <circle cx="190" cy="0" r="6" fill="var(--vp-c-brand-1)" />
      <line x1="0" y1="-42" x2="380" y2="-42" stroke="var(--vp-c-brand-1)" stroke-width="3" marker-end="url(#kin-arrow-soft)" />
      <text x="176" y="-58" class="svg-label">L</text>
      <line x1="0" y1="0" x2="0" y2="-88" stroke="var(--vp-c-brand-1)" stroke-width="3" marker-end="url(#kin-arrow-soft)" />
      <text x="12" y="-78" class="svg-label">v</text>
      <line x1="380" y1="0" x2="380" y2="-82" stroke="var(--vp-c-brand-1)" stroke-width="3" marker-end="url(#kin-arrow-soft)" />
      <text x="394" y="-72" class="svg-label">v_f</text>
      <text x="-68" y="44" class="svg-label">P_r(x_r,y_r)</text>
      <text x="168" y="32" class="svg-label">C</text>
    </g>
    <path d="M 270 275 A 120 120 0 0 1 384 225" fill="none" stroke="var(--vp-c-text-2)" stroke-width="2" marker-end="url(#kin-arrow)" />
    <text x="330" y="274" class="svg-label">θ</text>
    <path d="M 650 120 A 72 72 0 0 0 704 103" fill="none" stroke="var(--vp-c-text-2)" stroke-width="2" marker-end="url(#kin-arrow)" />
    <text x="684" y="132" class="svg-label">δ</text>
  </svg>
</div>

前轮中心：

$$
x_f=x_r+L\cos\theta
$$

$$
y_f=y_r+L\sin\theta
$$

前轮中心速度：

$$
\dot x_f=\dot x_r-L\dot\theta\sin\theta
$$

$$
\dot y_f=\dot y_r+L\dot\theta\cos\theta
$$

前轮方向为 $\theta+\delta$，其无侧滑约束为：

$$
-
\dot x_f\sin(\theta+\delta)
+
\dot y_f\cos(\theta+\delta)
=0
$$

代入前轮速度，得到：

$$
-
\left(
\dot x_r-L\dot\theta\sin\theta
\right)
\sin(\theta+\delta)
+
\left(
\dot y_r+L\dot\theta\cos\theta
\right)
\cos(\theta+\delta)
=0
$$

再结合后轮无侧滑和纯滚动：

$$
\dot x_r=v\cos\theta
$$

$$
\dot y_r=v\sin\theta
$$

可化简为：

$$
\dot\theta=\frac{v}{L}\tan\delta
$$

所以两轮自行车模型的运动学方程为：

$$
\begin{bmatrix}
\dot x_r\\
\dot y_r\\
\dot\theta
\end{bmatrix}
=
\begin{bmatrix}
\cos\theta\\
\sin\theta\\
\dfrac{\tan\delta}{L}
\end{bmatrix}
v
$$

如果以后轮角速度作为输入：

$$
v=r\omega_w
$$

则：

$$
\begin{bmatrix}
\dot x_r\\
\dot y_r\\
\dot\theta
\end{bmatrix}
=
r\omega_w
\begin{bmatrix}
\cos\theta\\
\sin\theta\\
\dfrac{\tan\delta}{L}
\end{bmatrix}
$$

## 瞬时旋转中心与转弯半径

无侧滑时，刚体在平面上的瞬时运动可以看作绕某一点旋转，这一点称为瞬时旋转中心：

$$
\mathrm{ICR}
$$

自行车模型中，后轴中心的转弯半径为：

$$
R_r=\frac{v}{\dot\theta}
$$

代入 $\dot\theta=v\tan\delta/L$：

$$
R_r=\frac{L}{\tan\delta}
$$

若 $\delta>0$ 表示向左转，则 ICR 位于车体左侧：

$$
\mathbf p_{\mathrm{ICR}}
=
\mathbf p_r+
R_r
\begin{bmatrix}
-\sin\theta\\
\cos\theta
\end{bmatrix}
$$

若质心 $C$ 在后轴前方 $l_r$ 处：

$$
\mathbf p_C=
\mathbf p_r+
l_r
\begin{bmatrix}
\cos\theta\\
\sin\theta
\end{bmatrix}
$$

质心到 ICR 的距离为：

$$
R_C=\sqrt{R_r^2+l_r^2}
$$

质心速度为：

$$
\dot{\mathbf p}_C
=
\dot{\mathbf p}_r+
l_r\dot\theta
\begin{bmatrix}
-\sin\theta\\
\cos\theta
\end{bmatrix}
$$

## 两轮差分驱动模型

课件还给出两轮差分驱动的三轮式移动机构。设左右轮线速度分别为 $v_L,v_R$，两轮间距为 $B$，车体参考点在两轮中点，则：

$$
v=\frac{v_R+v_L}{2}
$$

$$
\omega=\dot\theta=\frac{v_R-v_L}{B}
$$

运动方程为：

$$
\dot x=v\cos\theta
$$

$$
\dot y=v\sin\theta
$$

$$
\dot\theta=\omega
$$

合起来：

$$
\begin{bmatrix}
\dot x\\
\dot y\\
\dot\theta
\end{bmatrix}
=
\begin{bmatrix}
\dfrac{v_R+v_L}{2}\cos\theta\\
\dfrac{v_R+v_L}{2}\sin\theta\\
\dfrac{v_R-v_L}{B}
\end{bmatrix}
$$

如果给的是左右轮角速度 $\omega_L,\omega_R$，轮半径为 $r$：

$$
v_L=r\omega_L,\qquad v_R=r\omega_R
$$

## 轮式机器人移动性

课件将轮子分为标准轮和特殊轮。

标准轮包括：

| 类型 | 特点 | 运动能力 |
|---|---|---|
| 固定轮 | 方向固定，不能主动转向 | 约束最强，常形成非完整约束 |
| 舵轮 | 可改变方向角 | 可控方向更多 |
| 脚轮 | 可被动转向，常有偏心距 | 常用于支撑 |
| 全向轮/麦卡纳姆轮/瑞士轮 | 允许横向分速度 | 可实现全方位移动 |

移动灵活度 $\delta_m$ 描述机器人在不改变轮子方向时瞬时能动的自由度。方向可控度 $\delta_s$ 描述通过改变舵轮方向获得的可控方向数。

课件给出的典型分类：

| 类型 | $\delta_m$ | $\delta_s$ | 例子 |
|---|---:|---:|---|
| 全方位移动 | 3 | 0 | 瑞士轮、球轮、麦卡纳姆轮 |
| 差分/同轴固定轮 | 2 | 0 | 轮椅、差分驱动小车 |
| 舵轮类 | 2 | 1 | 三轮舵轮移动平台 |
| 汽车/自行车模型 | 1 | 1 | 小轿车、自行车模型 |
| 多舵轮类 | 1 | 2 | 多转向轮平台 |

记忆方式：固定轮越多，瞬时运动限制越强；全向轮横向不再强约束，所以移动灵活度最高。

## 后测题解析

::: details 点击展开：题型一：推导后轮纯滚动与无侧滑约束

题目采用后轮驱动、前轮转向自行车模型。参数：

$$
L=1.2\ \mathrm m,\qquad r=0.3\ \mathrm m,\qquad l_r=0.6\ \mathrm m
$$

以后轴中心 $P_r(x_r,y_r)$ 为参考点，车体偏航角为 $\theta$，前轮转角为 $\delta$。

后轮轮面方向与车体纵轴一致，纵向单位向量为：

$$
\mathbf e_x=
\begin{bmatrix}
\cos\theta\\
\sin\theta
\end{bmatrix}
$$

后轮纯滚动约束：

$$
\dot x_r\cos\theta+\dot y_r\sin\theta
=
r\omega_w
$$

记：

$$
v=r\omega_w
$$

则：

$$
\dot x_r\cos\theta+\dot y_r\sin\theta=v
$$

后轮横向单位向量为：

$$
\mathbf e_y=
\begin{bmatrix}
-\sin\theta\\
\cos\theta
\end{bmatrix}
$$

无侧滑约束：

$$
-\dot x_r\sin\theta+\dot y_r\cos\theta=0
$$

由这两式可解出：

$$
\dot x_r=v\cos\theta
$$

$$
\dot y_r=v\sin\theta
$$

前轮无侧滑约束需要先写前轮中心速度。前轮中心为：

$$
\mathbf p_f=
\mathbf p_r+
L
\begin{bmatrix}
\cos\theta\\
\sin\theta
\end{bmatrix}
$$

所以：

$$
\dot{\mathbf p}_f=
\begin{bmatrix}
\dot x_r\\
\dot y_r
\end{bmatrix}
+
L\dot\theta
\begin{bmatrix}
-\sin\theta\\
\cos\theta
\end{bmatrix}
$$

前轮横向方向为：

$$
\begin{bmatrix}
-\sin(\theta+\delta)\\
\cos(\theta+\delta)
\end{bmatrix}
$$

于是前轮无侧滑为：

$$
-
\left(
\dot x_r-L\dot\theta\sin\theta
\right)
\sin(\theta+\delta)
+
\left(
\dot y_r+L\dot\theta\cos\theta
\right)
\cos(\theta+\delta)
=0
$$

代入 $\dot x_r=v\cos\theta,\dot y_r=v\sin\theta$ 后：

$$
-v\sin\delta+L\dot\theta\cos\delta=0
$$

得到：

$$
\dot\theta=\frac{v}{L}\tan\delta
$$

:::

::: details 点击展开：题型二：已知前轮转角求后轴转弯半径

已知：

$$
\delta=15^\circ,\qquad L=1.2\ \mathrm m
$$

后轴中心到 ICR 的转弯半径：

$$
R_r=\frac{L}{\tan\delta}
$$

代入：

$$
R_r=
\frac{1.2}{\tan 15^\circ}
\approx
4.48\ \mathrm m
$$

结论：

$$
R_r\approx 4.48\ \mathrm m
$$

易错点：这是后轴中心 $P_r$ 的转弯半径，不是质心 $C$ 的转弯半径。若求质心半径，应使用：

$$
R_C=\sqrt{R_r^2+l_r^2}
$$

:::

::: details 点击展开：题型三：已知后轮角速度、转角和航向角求状态导数

已知：

$$
\omega_w=20\ \mathrm{rad/s},\qquad r=0.3\ \mathrm m
$$

$$
\delta=10^\circ,\qquad \theta=30^\circ,\qquad L=1.2\ \mathrm m
$$

后轮纯滚动给出车体纵向速度：

$$
v=r\omega_w=0.3\times 20=6\ \mathrm{m/s}
$$

运动学方程：

$$
\dot x_r=v\cos\theta
$$

$$
\dot y_r=v\sin\theta
$$

$$
\dot\theta=\frac{v}{L}\tan\delta
$$

代入数值：

$$
\dot x_r=6\cos30^\circ\approx 5.196\ \mathrm{m/s}
$$

$$
\dot y_r=6\sin30^\circ=3.000\ \mathrm{m/s}
$$

$$
\dot\theta=
\frac{6}{1.2}\tan10^\circ
\approx
0.882\ \mathrm{rad/s}
$$

因此：

$$
\begin{bmatrix}
\dot x_r\\
\dot y_r\\
\dot\theta
\end{bmatrix}
\approx
\begin{bmatrix}
5.196\\
3.000\\
0.882
\end{bmatrix}
$$

若还要求质心速度，因为 $l_r=0.6\ \mathrm m$：

$$
\dot{\mathbf p}_C=
\begin{bmatrix}
\dot x_r\\
\dot y_r
\end{bmatrix}
+
l_r\dot\theta
\begin{bmatrix}
-\sin\theta\\
\cos\theta
\end{bmatrix}
$$

代入：

$$
\dot x_C
=
5.196
-
0.6\times 0.882\times \sin30^\circ
\approx
4.932\ \mathrm{m/s}
$$

$$
\dot y_C
=
3.000
+
0.6\times 0.882\times \cos30^\circ
\approx
3.458\ \mathrm{m/s}
$$

:::

## 易错点

1. $R_r=L/\tan\delta$ 是后轴中心转弯半径，不是前轮半径，也不是质心半径。
2. $\theta$ 是车体纵轴相对惯性 $X$ 轴的角度；$\delta$ 是前轮相对车体纵轴的转角。
3. $\dot\theta$ 的单位是 $\mathrm{rad/s}$，不要换成度每秒再代公式。
4. 纯滚动给纵向速度，无侧滑给横向速度为零，两个约束不要混写。
5. 若给后轮角速度，先算 $v=r\omega_w$，再代入自行车模型。

## 最小知识清单

| 知识点 | 必背公式 |
|---|---|
| 后轮纯滚动 | $\dot x_r\cos\theta+\dot y_r\sin\theta=r\omega_w$ |
| 后轮无侧滑 | $-\dot x_r\sin\theta+\dot y_r\cos\theta=0$ |
| 自行车模型 | $\dot x_r=v\cos\theta,\ \dot y_r=v\sin\theta,\ \dot\theta=v\tan\delta/L$ |
| 后轴转弯半径 | $R_r=L/\tan\delta$ |
| ICR 位置 | $\mathbf p_{\mathrm{ICR}}=\mathbf p_r+R_r[-\sin\theta,\cos\theta]^T$ |
| 后轮驱动速度 | $v=r\omega_w$ |
| 差分驱动线速度 | $v=(v_R+v_L)/2$ |
| 差分驱动角速度 | $\omega=(v_R-v_L)/B$ |

