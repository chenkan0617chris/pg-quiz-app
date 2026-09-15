# 账户与服务端解题实施计划

依据：product-upgrade-review.md。用户已批准执行，直接在当前任务实施。

- [ ] 安装已开通的 Clerk SDK，配置 src/proxy.ts、全局 Provider、登录和注册路由，公开页面保持可浏览。
- [ ] 创建 src/lib/solver-input.ts 验证网络输入，限制管道组合数、数字题 token 数和数字范围；tests/solver-input.test.ts 验证畸形输入和资源上限。
- [ ] 创建 /api/solve/pipeline 与 /api/solve/numerical，先 auth() 验证身份，未登录返回 401，输入非法返回 400；计算仅在服务端执行。
- [ ] 两个解题页面使用公共请求 hook，支持登录弹窗、加载、失败和重试；保留用户题目输入。
- [ ] 验证单元测试、lint、build，以及未登录 API 请求与公开页面。

本阶段只实施登录门槛。数据库尚待条款授权，会员权益和支付接入在真实资源开通后实施，不能声称付费保护已经完成。
