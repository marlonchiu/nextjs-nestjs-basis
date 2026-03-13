## 一、环境准备

确认你的阿里云服务器系统：

```bash
# 查看系统版本（确保是 Ubuntu 20.04/22.04/24.04 LTS） // 在这里后续都是 24.04
lsb_release -a
```

## 二、安装 PostgreSQL（官方源，稳定最新）

### 0. 安装前向清除失败的缓存非必须

```bash
# 1. 清理失败的安装缓存和损坏依赖
sudo apt clean
sudo apt --fix-broken install -y

# 2. 移除所有PostgreSQL相关残留包
sudo apt remove --purge -y postgresql*
sudo apt autoremove -y
```

### 1. 配置官方源（避免阿里云镜像源版本过旧）

```bash
# 1.安装依赖
sudo apt update && sudo apt install -y wget ca-certificates

# 2. 添加官方GPG密钥（适配2026年最新）
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo gpg --dearmor -o /usr/share/keyrings/postgresql-keyring.gpg

# 3. 添加Ubuntu 24.04 (noble) 专属源（关键修正！）
echo "deb [signed-by=/usr/share/keyrings/postgresql-keyring.gpg] http://apt.postgresql.org/pub/repos/apt/ noble-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list
```

### 2. 安装 PostgreSQL

```bash
# 更新源并安装（推荐 16 版本，LTS 稳定）
sudo apt update && sudo apt install -y postgresql-16 postgresql-client-16
```

### 3. 验证安装

```bash
# 检查服务状态（显示 active (running) 即为成功）
sudo systemctl status postgresql

# 查看版本
psql --version
```

## 三、基础配置（阿里云服务器必做）

### 1. 切换到 postgres 系统用户

PostgreSQL 默认创建 postgres 用户，需用该用户操作数据库：

```bash
sudo su - postgres
```

### 2. 登录 PostgreSQL 并修改密码

```bash
# 登录数据库
psql

# 修改 postgres 数据库用户密码（替换 your_strong_password 为你的密码，建议包含大小写+数字+符号）
ALTER USER postgres WITH PASSWORD 'your_strong_password';

# 退出数据库
\q

# 退出 postgres 用户
exit
```

### 3. 允许远程访问（阿里云服务器关键步骤）

默认 PostgreSQL 只监听本地，需配置允许阿里云内网 / 公网访问：

```bash
# 1. 修改配置文件（监听地址）
sudo vim /etc/postgresql/16/main/postgresql.conf
# 找到 listen_addresses = 'localhost'，改为：
listen_addresses = '*'  # 允许所有地址访问

# 2. 修改访问权限
sudo vim /etc/postgresql/16/main/pg_hba.conf
# 在文件末尾添加以下内容（根据需求选一种）：
# 允许内网访问（推荐，更安全）
host    all             all             172.16.0.0/12            md5
# 允许公网访问（谨慎，仅测试用）
host    all             all             0.0.0.0/0                md5

# 3. 重启服务生效
sudo systemctl restart postgresql
```

### 4. 阿里云安全组放行端口

PostgreSQL 默认端口是 5432，必须在阿里云控制台放行：

```bash
登录阿里云服务器控制台 → 找到对应实例 → 安全组 → 配置规则
新增入站规则：
端口范围：5432/5432
授权对象：如果是内网访问填 VPC 网段，公网访问填 0.0.0.0/0（谨慎）
协议：TCP
```

## 四、测试连接

### 1. 本地服务器测试

```bash
# 使用 postgres 用户登录
psql -U postgres -h localhost

# 登录成功后可创建数据库/用户（示例）
CREATE DATABASE mydb;
CREATE USER myuser WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;
```

### 2. 远程客户端测试（如 Navicat/DBeaver）

主机：阿里云服务器公网 IP / 内网 IP
端口：5432
用户名：postgres（或你创建的 myuser）
密码：你设置的密码
数据库：postgres（或你创建的 mydb）

## 五、常用命令（备查）

```bash
# 启动/停止/重启服务
sudo systemctl start postgresql
sudo systemctl stop postgresql
sudo systemctl restart postgresql

# 设置开机自启
sudo systemctl enable postgresql

# 查看 PostgreSQL 日志
sudo tail -f /var/log/postgresql/postgresql-16-main.log
```

## 四、基础配置（和之前一致，快速复用）

```bash
# 1. 切换到postgres用户修改密码
sudo su - postgres
psql -c "ALTER USER postgres WITH PASSWORD '你的强密码';"
exit

# 2. 配置远程访问（监听所有地址）
sudo sed -i "s/^listen_addresses = 'localhost'/listen_addresses = '*'/g" /etc/postgresql/16/main/postgresql.conf

# 3. 允许公网/内网访问
echo "host    all             all             0.0.0.0/0                md5" | sudo tee -a /etc/postgresql/16/main/pg_hba.conf

# 4. 重启服务生效
sudo systemctl restart postgresql
```

### 五、验证安装结果

```bash
# 1. 查看PostgreSQL版本
psql --version

# 2. 本地登录测试
sudo -u postgres psql -c "SELECT version();"
```
