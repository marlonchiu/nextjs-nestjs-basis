# 数据库操作

## 参考文档

> [drizzle](https://orm.drizzle.team/) > [Zod](https://zod.dev/)

## 操作指南

```bash
# https://orm.drizzle.team/docs/get-started/postgresql-new

# 安装
pnpm add drizzle-orm pg dotenv
pnpm add -D drizzle-kit @types/pg

# 创建数据库
CREATE DATABASE "image-saas";

# 生成数据库操作代码
npx drizzle-kit push

# 运行数据库操作代码
npx drizzle-kit studio

# 打开访问数据库 https://local.drizzle.studio/
```

## Zod 数据验证

```bash
pnpm add zod
```
