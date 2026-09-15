# 七天试用与正式登录

## 已实现

- 试用从 Clerk 服务端注册时间起计算，持续七天。
- user_access 使用用户 ID 主键，首次写入后不可由重复登录或客户端请求重置。
- /api/account 返回服务端账户状态，所有响应禁止缓存。
- 解题和练习提交在服务端检查试用期限；过期仍允许读取自己的历史。
- 前端显示试用截止时间、免费无需绑卡、无自动扣款，过期给出明确提示。
- 正式 Clerk 会话仅接受 https://quiz.ckautoflow.com 来源。
- 数据库迁移 002_access 已执行。六项单元测试、三项数据库集成测试通过；lint 与 build 通过。

## 正式登录配置

Clerk production instance 已绑定 quiz.ckautoflow.com，使用 secondary application 配置以隔离 CRM：clerk.quiz.ckautoflow.com 与 accounts.quiz.ckautoflow.com。
Vercel Marketplace production domain 同步完成，Hobby 免费套餐，三个付费 add-on 均未启用。
DNS 五条记录现已全部 Verified，SSL 已签发。已确认 Vercel production 为 live keys，并部署 dpl_Hj68purKGHuvW4nL355XrPJaYqXe 至 https://quiz.ckautoflow.com。浏览器已验证七天试用提示与正式邮箱登录弹窗；尚未完成真实邮箱验证码登录后的端到端验证。
开发和正式用户属于不同 Clerk 实例，测试账户不会自动迁移到正式环境。

## 待完成的支付工作

当前没有开放付款，也没有自动扣款。
等待用户确认 Stripe 条款及账户共享，并提供商户所在地、是否已有 Stripe、售价和购买有效期。
接入真实 Stripe 测试环境后实现 Checkout、签名校验 webhook、付款金额/币种/商品验证、重复通知幂等和退款处理。
付费授权只能由已验证的付款通知创建，禁止依赖浏览器 success URL。
支付宝和微信的可用性须以商户账户实际审核结果为准；正式收款须用户完成商户身份和结算账户资料。

用户确认有澳大利亚商户资料／银行账户及个人支付宝、微信。优先澳大利亚 Stripe 商户接支付宝／微信，最终支付方式取决于账户审核。Stripe 条款安装页面已打开，等待明确接受条款及账户信息共享；未创建支付 SDK 或虚拟结账。

## Stripe 安装进展

用户已接受 Stripe 条款，确认 ¥29.90 CNY／30 天，不自动续费。
Stripe 沙箱 stripe-bole-fountain 已通过 Marketplace 创建并连接 pg-quiz-app，开发环境密钥已由集成写入 .env.local；SDK 已安装。
资源 ir_oQHPwf06P9napBDX，安装 icfg_x9mepjppmXSJAq8EEnIeUBPl。
认领流程已到 Stripe 登录页，等待用户登录或创建自己的账户认领。尚未实现 Checkout/webhook，也未启用真实支付。后续继续付款通知验签、幂等、测试与正式权限隔离、退款处理及端到端验证。

## 已认领后的实现与验证

Stripe 沙箱 acct_1UEj5vD7aEmn401m 已登录认领，国家 AU。真实账户尚未创建：UI 点击退出沙盒后明确提示“获取真实账号”，需要验证用户与企业信息，已停在该按钮交由用户操作。
已实现 /billing、/api/checkout、/api/stripe/webhook；Webhook 测试签名密钥写入 Vercel sensitive production 环境变量，未开启 PAYMENTS_ENABLED。
生产部署 dpl_ANVsWfbKBQtyDGRbbt5R67vuhBeK 已 READY。生产环境强制 live API key 才能开启 checkout，测试购买无法修改正式 user_access.paid_until。
验证：10 项单元/数据库测试通过，lint/build 通过，真实 Stripe 沙箱创建 CNY 2990 测试 Checkout 后过期关闭；线上有效签名未付款通知返回 Pending，伪造签名返回 400。/billing 浏览器显示价格与禁用购买按钮。
未完成：真实账户认证、支付宝/微信实际开通、live key 和 live webhook 配置、成功付款完整端到端验证、收费开启。全额退款会撤销对应付费授权，部分退款不改变有效期。需最终核对退款政策与商户信息后开放。

## 正式账户验收发现（本轮）

正式账户已进入 live dashboard，但身份任务 astask_1UEocZD7aEmn401mIJotfsZa 未提交：录入身份信息无法验证，要求更正或提供匹配证件。任务详情说明提现已暂停，支付在指定累计交易额后暂停；微信能力目前暂停。
已按用户授权提交支付宝和微信启用请求，两个支付方式配置均显示待批准。
Vercel production 仍为测试 Stripe 密钥，PAYMENTS_ENABLED 未开启；尚未切换 live webhook。
10 项自动测试重新通过；线上未登录账户、练习、结账接口返回401，购买页200。
真实注册后使用验收等待用户在 Quiz 完成邮箱登录；不可把弹窗通过当作端到端通过。真实付款也未完成。保持当前已部署的免费试用版本，不开启收费。

## 2026-09-13 正式银行卡收款上线

- Stripe 正式后台已无账户待办，支付和 Payouts 显示活跃；商家资料已列出 ID 文件。支付宝、微信仍为待批准，不能视为身份资料再次被驳回。
- 用户明确授权创建正式受限密钥及配置 Vercel 生产敏感环境变量，并完成验证器二次验证。密钥名称为 pg-quiz-app-production；不记录密钥值。
- STRIPE_SECRET_KEY 与 STRIPE_WEBHOOK_SECRET 已作为 sensitive 变量仅用于 Production；Preview/Development 保留沙箱密钥。生产公钥已同步，PAYMENTS_ENABLED 已开启。
- live webhook we_1UF3g2D7aEmn401mKfWOagT3 指向 https://quiz.ckautoflow.com/api/stripe/webhook，监听 checkout.session.completed、checkout.session.async_payment_succeeded、charge.refunded。旧沙箱 webhook 已禁用，避免向正式 URL 发送测试通知。
- 正式部署 dpl_GRs6SFtaoa5UZgKhWuvaP5BruPDB 已 READY 并绑定 quiz.ckautoflow.com。购买页展示 Visa/Mastercard 支持及 CNY 价格；Checkout 自动选择语言，商品描述中英文并列。
- 验证：17 项单元/数据库集成测试全部通过，lint/build 通过。正式 Stripe 创建 ¥29.90 CNY 的未付款配置检查会话，返回 card 和 link；浏览器验证结账页面展示银行卡，检查会话均已过期关闭，未执行扣款。线上 webhook 有效签名的未付款通知返回 200 Pending，伪造签名返回 400 Invalid signature。
- 尚未执行真实扣款、真实已付款 webhook 开通权益和真实退款的完整端到端验收。现有规则仍限制试用期内购买；用户当前仍处于试用期。是否允许保留剩余试用时间并提前购买，已向用户询问，尚未改变该规则。

## 2026-09-13 用户确认试用期购买规则

- 用户明确要求：试用期内允许购买；付款确认后立即开始 30 天付费使用权，不叠加剩余七天试用。保留原价 ¥29.90 CNY 和不自动续费。
- Checkout 允许 trial/expired 用户购买；有效 paid 用户仍阻止重复购买。
- 数据库迁移 004_paid_access_starts_immediately.sql 已执行，新的授权为 now() + 30 days，重复通知不会重置有效期。已存在的历史授权不改写。
- 购买页和账户提示已同步中英文说明。新增真实数据库回归测试先在旧逻辑下失败，迁移后通过；共 18 项测试通过，lint/build 通过。
- 部署 dpl_2CMPJBd4b6n2T8JuHWKuYuaBCg2K 已 READY 并绑定正式域名。浏览器使用当前真实试用账户点击购买，成功进入 ¥29.90 正式 Stripe Checkout（cs_live_a1xLG33GFdNMWSObIy9jqsQbKdSgNX1G5Zq9zsmPPrTgBcaXQWjhyxDy59），显示 Mastercard 支付。页面已交给用户，尚未代为扣款。

## 2026-09-14 — USD 9.99 launch

- New purchases cost USD 9.99 for 30 days from fulfillment, with no automatic renewal or extra trial days. Shared price module drives Checkout and billing UI; adaptive pricing disabled to keep USD checkout.
- Migration 005 permits both historical CNY 2990 and USD 999 orders. Legacy defaults intentionally retained for compatibility during rollout; the new route explicitly writes USD 999. Webhook validates against each order's stored price, so delayed legacy payments remain fulfillable.
- Checkout retires expired/old-price sessions and creates a current-price order; completed sessions remain pending confirmation rather than permitting another purchase.
- Migration 004 gained a statement-breakpoint marker so the migration runner preserves its PL/pgSQL function body.
- Validation: all 20 tests passed with RUN_DB_TESTS=1, including USD trial purchase/30-day expiry/idempotency and legacy currency validation. Lint and production build passed.
- Production deployment dpl_BPBUXfwtcn3gAmcPNFA29wjMz4nR confirmed Ready and aliased to quiz.ckautoflow.com.
- Live browser: billing shows US$9.99 USD; trial user creates a live Stripe Checkout session showing US$9.99 and saved Mastercard. Session cs_live_a191cmzcsoM8tcDT6VGUDKQG54872qR17amzYjhfxzVGfVx20BTXTALY3V. No final payment clicked; real charge, successful live webhook, and access grant remain to verify after user payment.
- Production forged-signature webhook request correctly returned HTTP 400 Invalid signature.

## 2026-09-15 — temporary AUD 0.50 user payment test

User approved A$0.50 after Stripe's A$0.50 minimum prevented the requested A$0.01. Published shared price AUD 50 cents; migration 006 preserves legacy USD/CNY orders. Four payment tests, lint and build passed. Deployment dpl_2LWu73amPJmj7fZ6YGNJ6QSMRQfH READY, canonical alias updated. This is a temporary public price for the user's manual live payment test; restore USD 9.99 after testing. No automatic restoration scheduled.

## 2026-09-15 — live payment verified; restore USD 9.99

User confirmed the manual test succeeded and requested restoration of the original USD 9.99 price. Database independently confirms session cs_live_a13Qp3eRLYgLaHKrQhUsQ9PDskknKxTuFuhCD2dBsu2QAg1HpYAXnt490I is live, AUD 50 cents, paid; order granted_until and user paid_until both 2026-10-15T00:58:42.769Z (Sydney 11:58). This verifies live payment fulfillment and access grant. Shared product restored to USD 999 cents; historical AUD orders remain supported by webhook validation. Price tests, lint and build passed.

## 2026-09-15 — standard price changed to AUD 9.90

User requested AUD 9.90 following verification that Alipay/WeChat Pay remain pending approval and Australian merchants have currency restrictions for those wallets. Shared billing/Checkout price now AUD 990 cents. Migration 007 allows the new amount while preserving historic CNY, USD and AUD 50-cent orders. Four payment tests with real DB passed, including AUD 990 fulfillment; lint and build passed. Duration remains 30 days from confirmation, no unused-trial extension or automatic renewal. This currency change does not itself approve Alipay or WeChat Pay.
