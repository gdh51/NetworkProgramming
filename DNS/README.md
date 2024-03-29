# DNS

## DNS 服务器分类

DNS 规范规定了 2 种类型的 DNS 服务器，一个叫主 DNS 服务器，一个叫辅助 DNS 服务器。在一个区域中主 DNS 服务器从自己本机的数据库中读取该区的 DNS 数据信息，而辅助 DNS 服务器则从区域中的主 DNS 服务器中读取该区的 DNS 数据信息。当一个辅助 DNS 服务器启动时，它需要与主 DNS 服务器通信，并加载数据信息，这就叫做**区域传送**（zone transfer）。这种情况下，使用 TCP 协议。

## DNS 如何将域名解析为 IP

1. 首先浏览器查询自身缓存中是否解析过该 IP
2. 然后浏览器会查询本地`hosts`文件是否存在自定义配置
3. 如没有，则会向本地域名服务器查询（本地域名服务器为网络运行商如电信移动）
4. 本地域名解析服务器先向缓存中查找是否有该域名 IP 信息
5. 如果本地域名服务器没有，则本地域名服务器会**迭代查询**，它会代表客户端向**根域名服务器**进行查询
6. 根域名服务器返回其域名所在的顶级域名地址
7. 本地域名服务器又向**顶级域名服务器**中查询该地址的二级域名
8. 最后本地域名服务器再向**权威域名服务器**查询该地址的三级域名
9. 如过有则直接返回`IP`，没有则报错

整个查询过程，客户端只发送了一次请求，查询过程由本地 DNS 服务器**递归查询**完成。
![域名服务器结构](./img/DNS服务器.svg)

![DNS查询过程](./img/解析dns过程.svg)

### 查询种类

-   **递归查询**：在 DNS 查询过程中，客户端向本地服务器进行查询后，如果未查询到，就由本地服务器作为客户端代替客户端分别向根域名、顶级域名、权威域名服务器进行查询。
-   **迭代查询**：在本地服务器向客户端向根域名、顶级域名、权威域名服务器进行查询的过程就是迭代查询，这个过程中的中间结果是某个域名服务器告诉本地服务器下一步该向谁进行查询。

## 全局负载均衡器 GSLB

### 就近访问

> 为了使应用保持高可用性，数据可能会部署在多个机房，每个机房都有自己的 IP 且它们有自己的运营商和地域。当我们作为用户去访问这些应用时，我们希望竟可能近地域同运营商访问该应用。

为了做到上述特点，我们需要借助全局负载均衡器。在本地服务器递归查询过程的最后一步权威域名服务器查询的过程中;为了实现就近访问，于是**该域名在权威域名服务器中配置的不是`IP`而是`CNAME`别名**，之后本地域名解析服务器将继续请求全局负载均衡器，它收到请求后会查询请求它的本地运营商和地址来获取用户运营商和地址，找到符合此要求的`IP`后就返回给本地域名服务器，之后通过本地域名服务器返回给客户端。

过程：

1. 如上，进行到权威域名服务器查询时
2. 从权威域名服务器中取出`CNAME`向全局负载均衡器进行查询
3. 获取就近运营商和地址的`IP`，返回给本地服务器
4. 返回给客户端

![负载均衡过程](./img/CSLB.svg)

## 提问

1. **DNS 在域名解析上用的 UDP 还是 TCP 协议，为什么？**
   域名解析用的是 UDP 协议，因为 DNS 协议的开始和结果就是一个请求和一个响应，如果我们选用 TCP 协议的话还要经历三次握手、数据发送、四次挥手等阶段，而选用 UDP 协议没有这些过程，且较快速，服务器不用负载太大，响应更迅速。

2. **DNS 在区域传送时为什么用 TCP 协议？**
   主要出于两个原因：

    1. 辅域名服务器会定时向主域名服务器进行查询以便了解数据是否有变动。如有变动则会执行一次区域传送，进行数据同步。此时数据量一般较大，出于 UDP 协议报文大小限制。
    2. TCP 提供可靠的连接，确保了数据的精准。

3. **为什么要用 CNAME，使用 CNAME 的好处是？**
   CNAME 又称为别名记录，这种记录允许将多个名称映射到同一台服务器上，此时如果每台计算机的 IP 要变动，只需要修改该台计算机 IP 即可，而不需要修改其 CNAME 中的域名，便于维护。下面举个例子
   | 域名 | 类型 | 地址 |
   | --------------- | ----- | --------------- |
   | www.domain.com | CNAME | host.domain.com |
   | mail.domain.com | CNAME | host.domain.com |
   | host.domain.com | A | 192.168.1.1 |
   在上表中，CNAME 都指向同一个域名，当该域名下 IP 改变时，我们不需要修改 CNAME 指向的域名，只需要修改 A 记录(**A 记录用来记录域名到 IP 的记录**)中的 IP 即可。

[参考 1](https://zhuanlan.zhihu.com/p/79350395)
[参考 2](https://www.cnblogs.com/wuyun-blog/p/8183234.html)
