# 自闭症患者工作融入支持工具 - 实现计划

## [x] 任务1: 项目初始化与环境搭建

- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 创建Flutter项目结构
  - 配置Python后端环境
  - 搭建基础开发环境
  - 配置本地SQLite存储，所有数据本地化，无云端上传
- **Acceptance Criteria Addressed**: AC-14, AC-15
- **Test Requirements**:
  - `programmatic` TR-1.1: 项目能够成功构建和运行
  - `programmatic` TR-1.2: 开发环境配置正确，所有依赖安装完成
  - `programmatic` TR-1.3: 本地SQLite存储配置完成，数据能够本地存储
- **Notes**: 选择Flutter的稳定版本，确保跨平台兼容性，所有数据100%本地存储，不上传云端

## [x] 任务2: 核心UI框架搭建

- **Priority**: P0
- **Depends On**: 任务1
- **Description**:
  - 设计并实现基础UI框架
  - 实现响应式布局，支持PC端和APP端
  - 设计符合自闭症患者使用习惯的界面风格，文字内容精简，字体大小适中（比较大但不夸张）
  - 实现无闪烁、无刺耳音效、大字体、极简职场风格
- **Acceptance Criteria Addressed**: AC-13, AC-14, AC-16
- **Test Requirements**:
  - `programmatic` TR-2.1: 界面在不同设备上显示正常
  - `human-judgment` TR-2.2: 界面设计符合要求，使用不刺眼的亮色，文字内容精简，字体大小适中（比较大但不夸张），字数少
  - `human-judgment` TR-2.3: 界面无闪烁、无刺耳音效，采用大字体和极简职场风格
- **Notes**: 使用Flutter的Material Design或Cupertino风格，确保界面简洁明了

## [x] 任务3: 文字排序游戏模块

- **Priority**: P0
- **Depends On**: 任务2
- **Description**:
  - 实现文字排序游戏的核心逻辑
  - 设计游戏界面和交互方式
  - 实现游戏判断和反馈机制
  - 内容包括职场指令排序、工作流程排序、办公文案整理
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `programmatic` TR-3.1: 游戏能够正确打乱和排序文字
  - `programmatic` TR-3.2: 正确判断排序结果并给出相应反馈
- **Notes**: 游戏难度命名为L1（职场入门）、L2（职场基础）、L3（职场进阶）、L4（职场熟练）、L5（职场独立）

## [x] 任务4: 数字计算游戏模块

- **Priority**: P1
- **Depends On**: 任务2
- **Description**:
  - 实现数字计算游戏的核心逻辑
  - 设计游戏界面和交互方式
  - 实现游戏判断和反馈机制
  - 内容包括考勤核算、薪资计算、办公数据统计
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `programmatic` TR-4.1: 游戏能够正确生成数字计算任务
  - `programmatic` TR-4.2: 正确判断计算结果并给出相应反馈
- **Notes**: 游戏难度命名为L1（职场入门）、L2（职场基础）、L3（职场进阶）、L4（职场熟练）、L5（职场独立）

## [ ] 任务5: 英文拼接游戏模块

- **Priority**: P1
- **Depends On**: 任务2
- **Description**:
  - 实现英文拼接游戏的核心逻辑
  - 设计游戏界面和交互方式
  - 实现游戏判断和反馈机制
  - 内容包括职场常用词汇、办公英文短语
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `programmatic` TR-5.1: 游戏能够正确生成英文拼接任务
  - `programmatic` TR-5.2: 正确判断拼接结果并给出相应反馈
- **Notes**: 游戏难度命名为L1（职场入门）、L2（职场基础）、L3（职场进阶）、L4（职场熟练）、L5（职场独立）

## [ ] 任务6: 简单编程游戏模块

- **Priority**: P1
- **Depends On**: 任务2
- **Description**:
  - 实现简单编程游戏的核心逻辑
  - 设计游戏界面和交互方式
  - 实现游戏判断和反馈机制
  - 内容包括工作自动化流程积木编程
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `programmatic` TR-6.1: 游戏能够正确生成编程任务
  - `programmatic` TR-6.2: 正确判断编程结果并给出相应反馈
- **Notes**: 使用Python3语言，以搭积木形式进行编程练习，游戏难度命名为L1（职场入门）、L2（职场基础）、L3（职场进阶）、L4（职场熟练）、L5（职场独立）

## [ ] 任务7: 混合模式游戏模块

- **Priority**: P1
- **Depends On**: 任务3, 任务4, 任务5, 任务6
- **Description**:
  - 实现混合模式游戏的核心逻辑
  - 设计游戏界面和交互方式
  - 实现游戏判断和反馈机制
  - 内容包括职场综合任务处理
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `programmatic` TR-7.1: 游戏能够正确生成混合任务
  - `programmatic` TR-7.2: 正确判断任务结果并给出相应反馈
- **Notes**: 混合模式包含职场相关的文字、数字、英文综合任务，游戏难度命名为L1（职场入门）、L2（职场基础）、L3（职场进阶）、L4（职场熟练）、L5（职场独立）

## [ ] 任务8: 语音输入输出功能

- **Priority**: P1
- **Depends On**: 任务2
- **Description**:
  - 实现语音输入功能
  - 实现语音输出功能
  - 集成语音识别和合成API
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `programmatic` TR-8.1: 系统能够正确识别语音输入
  - `programmatic` TR-8.2: 系统能够正确进行语音输出
- **Notes**: 可以使用Flutter的语音识别插件和TTS插件

## [ ] 任务9: 虚拟键盘实现

- **Priority**: P1
- **Depends On**: 任务2, 任务16
- **Description**:
  - 设计并实现内置虚拟键盘
  - 确保键盘操作简单直观
  - 适配不同设备屏幕
  - 实现静音、无震动、大按键、职场配色
  - 实现AI提示功能，鼠标/触屏悬停到某个位置时进行提示
- **Acceptance Criteria Addressed**: NFR-6, AC-17
- **Test Requirements**:
  - `programmatic` TR-9.1: 虚拟键盘能够正常显示和使用
  - `human-judgment` TR-9.2: 键盘操作简单直观，适合自闭症患者使用
  - `human-judgment` TR-9.3: 键盘静音、无震动，采用大按键和职场配色
  - `programmatic` TR-9.4: 虚拟键盘具备AI提示功能，鼠标/触屏悬停到某个位置时进行提示
- **Notes**: 虚拟键盘应具备大按键、清晰标识等特点

## [ ] 任务10: 彩蛋系统实现

- **Priority**: P1
- **Depends On**: 任务2
- **Description**:
  - 实现彩蛋生成和显示逻辑
  - 设计彩蛋的出现方式和内容
  - 实现职场正向激励彩蛋
- **Acceptance Criteria Addressed**: AC-11
- **Test Requirements**:
  - `programmatic` TR-10.1: 系统能够生成职场正向激励彩蛋
  - `programmatic` TR-10.2: 彩蛋正确显示职场小技巧、治愈文案、安静动画或专属勋章
- **Notes**: 彩蛋内容包括职场小技巧、治愈文案、安静动画、专属勋章，无幼稚元素

## [ ] 任务11: 积分系统实现

- **Priority**: P1
- **Depends On**: 任务2, 任务10
- **Description**:
  - 实现积分计算逻辑
  - 设计积分存储和管理机制
  - 实现积分显示和更新功能
- **Acceptance Criteria Addressed**: AC-8
- **Test Requirements**:
  - `programmatic` TR-11.1: 系统能够正确计算积分
  - `programmatic` TR-11.2: 系统能够正确存储和更新积分
- **Notes**: 正向积分规则：独立完成+彩蛋正确：100分；提示完成+彩蛋未完成：60分；未完成游戏+彩蛋完成：20分；均未完成：0分（不扣分）

## [ ] 任务12: 积分商城实现

- **Priority**: P2
- **Depends On**: 任务11
- **Description**:
  - 实现积分商城界面
  - 设计商品兑换逻辑
  - 实现兑换记录管理
- **Acceptance Criteria Addressed**: AC-9
- **Test Requirements**:
  - `programmatic` TR-12.1: 系统能够正确显示商城商品
  - `programmatic` TR-12.2: 系统能够正确处理积分兑换
- **Notes**: 职场实用商品：50积分=职场主题头像；200积分=职场沟通卡片；1000积分=职场技能电子书；5000积分=办公文具/键盘/职场周边实物

## [ ] 任务13: 文字预测功能实现

- **Priority**: P1
- **Depends On**: 任务2, 任务8, 任务16
- **Description**:
  - 实现文字预测的核心逻辑
  - 设计预测界面和交互方式
  - 集成AI模型进行预测
- **Acceptance Criteria Addressed**: AC-6, AC-17
- **Test Requirements**:
  - `programmatic` TR-13.1: 系统能够根据输入字预测下一个字
  - `programmatic` TR-13.2: 预测结果准确合理
- **Notes**: 可以使用本地或云端AI模型进行预测

## [ ] 任务14: 家长功能实现

- **Priority**: P1
- **Depends On**: 任务2, 任务11, 任务16
- **Description**:
  - 实现家长功能界面
  - 设计自定义训练内容创建逻辑
  - 实现核心支持权限（职场相关能力评估报告查看、难度调整建议）
  - 实现训练辅助权限（训练时长上限设置、云端AI开关）
  - 实现数据安全与管理权限（数据导出、记录清除双重确认、地址管理）
  - 实现访客协作权限（临时授权码生成）
  - 实现训练内容的存储和管理
  - 实现自闭症青年端自主决策权（难度调整确认、训练时长规划、积分商城兑换确认）
- **Acceptance Criteria Addressed**: AC-10
- **Test Requirements**:
  - `programmatic` TR-14.1: 家长能够创建自定义训练内容
  - `programmatic` TR-14.2: 系统能够正确保存和显示自定义训练内容
  - `programmatic` TR-14.3: 家长能够使用核心支持权限、训练辅助权限、数据安全与管理权限和访客协作权限
  - `programmatic` TR-14.4: 验证青年自主决策权与数据清除双重确认机制
- **Notes**: 家长功能遵循"支持不干预、可控不打扰"核心逻辑，充分尊重自闭症青年的自主决策与工作能力

## [ ] 任务15: 渐进式解锁功能实现

- **Priority**: P1
- **Depends On**: 任务2, 任务3, 任务4, 任务5, 任务6, 任务11
- **Description**:
  - 实现解锁逻辑和条件判断
  - 设计解锁界面和提示
  - 实现功能模块的权限管理
- **Acceptance Criteria Addressed**: AC-12
- **Test Requirements**:
  - `programmatic` TR-15.1: 系统能够根据训练进度正确解锁功能
  - `programmatic` TR-15.2: 解锁后的功能能够正常使用
- **Notes**: 解锁条件基于患者的训练进度和积分情况

## [x] 任务16: AI大模型集成

- **Priority**: P0
- **Depends On**: 任务2
- **Description**:
  - 集成本地AI模型
  - 集成云端AI模型API
  - 实现模型切换功能
- **Acceptance Criteria Addressed**: AC-17, NFR-5
- **Test Requirements**:
  - `programmatic` TR-16.1: 系统能够正确调用本地AI模型
  - `programmatic` TR-16.2: 系统能够正确调用云端AI模型API
  - `programmatic` TR-16.3: 系统能够在本地和云端模型之间切换
- **Notes**: 可以使用豆包火山、千问百炼、kimi、智谱等AI模型。符合隐私设计：可选集成云端AI模型API（默认关闭，用户手动开启和配置，配置有测试api是否连接成功的功能），核心数据不上传

## [ ] 任务17: 安装包构建与部署

- **Priority**: P1
- **Depends On**: 所有任务
- **Description**:
  - 构建PC端和APP端安装包
  - 编写安装教程（图文版）
  - 测试安装流程
  - 内置轻量化AI模型，一键安装，无需手动配置
- **Acceptance Criteria Addressed**: NFR-2
- **Test Requirements**:
  - `programmatic` TR-17.1: 安装包能够成功构建
  - `human-judgment` TR-17.2: 安装教程清晰易懂，适合用户使用
  - `programmatic` TR-17.3: 安装包内置轻量化AI模型，实现一键安装，无需手动配置
- **Notes**: 确保安装包大小合理，安装过程简单明了，支持Windows/macOS/Linux/Android/iOS/鸿蒙六平台

## [x] 任务18: 系统测试与优化

- **Priority**: P0
- **Depends On**: 所有任务
- **Description**:
  - 进行功能测试
  - 进行性能测试
  - 进行安全测试
  - 进行用户体验测试
  - 进行离线功能测试
  - 进行隐私安全测试
  - 进行职场青年用户实测
  - 根据测试结果进行优化
- **Acceptance Criteria Addressed**: AC-15, AC-16
- **Test Requirements**:
  - `programmatic` TR-18.1: 所有功能能够正常运行
  - `programmatic` TR-18.2: 系统性能满足要求，无卡顿
  - `human-judgment` TR-18.3: 系统安全符合规范，用户体验良好
  - `programmatic` TR-18.4: 系统在离线情况下能够正常运行所有功能
  - `programmatic` TR-18.5: 系统数据能够安全存储，无云端上传
  - `human-judgment` TR-18.6: 职场青年用户实测反馈良好
- **Notes**: 测试过程中应邀请自闭症患者参与，收集真实使用反馈

## [x] 任务19: 本地离线功能实现

- **Priority**: P0
- **Depends On**: 任务1, 任务16
- **Description**:
  - 实现全功能离线运行
  - 实现AI模型离线调用（核心业务逻辑离线执行）
- **Acceptance Criteria Addressed**: NFR-5
- **Test Requirements**:
  - `programmatic` TR-19.1: 系统能够在断网情况下正常运行所有功能
  - `programmatic` TR-19.2: 核心业务逻辑可在本地离线执行
  - `programmatic` TR-19.3: AI模型能够在离线情况下正常调用
- **Notes**: 确保100%本地运行，断网可用

## [x] 任务20: 职场能力评估模块

- **Priority**: P0
- **Depends On**: 任务2, 任务11, 任务16
- **Description**:
  - 实现AI自动评估职场能力
  - 生成能力评估报告
  - 自动匹配游戏难度
- **Acceptance Criteria Addressed**: AC-10, AC-12
- **Test Requirements**:
  - `programmatic` TR-20.1: 系统能够自动评估职场能力
  - `programmatic` TR-20.2: 系统能够生成详细的能力评估报告
  - `programmatic` TR-20.3: 系统能够根据评估结果自动匹配游戏难度
- **Notes**: 评估维度包括逻辑推理、指令执行、社交适配、情绪管理等与工作场景相关的能力