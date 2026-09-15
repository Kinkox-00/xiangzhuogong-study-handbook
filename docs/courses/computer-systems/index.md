---
title: 计算机系统
description: CSAPP 计算机系统复习：数值表示、x86 汇编、虚拟内存与 Cache、链接重定位、进程信号与程序优化。
course: computer-systems
---

<CourseOverview />

## 复习路线

1. **数据与程序**：从补码、浮点数到汇编，练习 C 与 x86 的相互推导。
2. **地址与存储**：串起 TLB、页表和 Cache，画清地址字段与查询顺序。
3. **程序运行**：掌握链接重定位、进程与信号，再分析程序优化和实验链路。

## 知识点入口

| 模块 | 学习目标 |
| --- | --- |
| [数值表示](./exam-review#数值表示) | 补码、浮点、舍入与类型转换 |
| [汇编与 C 互推](./exam-review#汇编与-c-互推) | 栈帧、循环、数组与结构体 |
| [虚拟内存与 Cache](./exam-review#虚拟内存与-cache) | 地址划分、TLB、页表与组相联 Cache |
| [链接与重定位](./exam-review#链接重定位与符号) | 强弱符号、ELF 节与重定位 |
| [进程、信号与优化](./exam-review#进程信号与程序优化) | SIGCHLD、waitpid 与循环优化 |
| [实验串线](./exam-review#实验串线) | Bomb Lab、VSPM 与 Minicc |

## 资料范围

内容由 CSAPP 课程学习笔记与历年试题复盘整理，汇编例子主要采用 32 位 x86。具体指令约定、考试范围和实验要求，请结合所在课程核对。

[反馈错误或补充内容](/feedback)。
