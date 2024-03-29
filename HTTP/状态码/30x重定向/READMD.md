# 重定向

重定向的状态码有`301、302、303、304、307、308`，下面来具体的对它们进行解释：

## 永久重定向

### 301 Moved Permanently

301 表示永久重定向，表明目标资源被永久的移动到了一个新的 URI，任何未来对这个资源的引用都应该使用新的 URI。

### 308 Permanent Redirect

308 的定义实际上和 301 是一致的，唯一的区别在于，308 状态码**不允许浏览器将原本为 POST 的请求重定向到 GET 请求上**。

### 产生两个重定向的原因

和 302 一样，301 在浏览器中的实现和标准是不同的，这个时间一直延续到 2014 年的 RFC 7231，301 定义中的[Note](https://tools.ietf.org/html/rfc7538)还是提到了这个问题。直到 2015 年 4 月，RFC 7538 提出了 308 的标准，类似`307 Temporary Redirect`之于`302 Found`的存在，308 成为了 301 的补充。

## 临时重定向

### 302 Found

302 表示把目标资源临时移动到另一个 URL 上。由于重定向是临时发生的，所以客户端在之后的请求中还应该使用之前的 URL

注意：由于历史原因，用户代理可能会**在重定向后的请求中把 POST 方法改为 GET 方法**。

### 303 See Other

303 状态码表示服务器要将浏览器重定向到另一个资源，这个资源的 URI 会被写在响应 `Header` 的 `Location` 字段。从语义上讲，重定向到的资源并不是你所请求的资源，而是对你所请求资源的一些描述。

> 303 常用于将 POST 请求重定向到 GET 请求，比如你上传了一份个人信息，服务器发回一个 303 响应，将你导向一个“上传成功”页面。

不管原请求是什么方法，重定向请求的方法都是 GET（或 HEAD，不常用）。

### 307 Temporary Redirect

307 的定义实际上和 302 是一致的，唯一的区别在于，**307 状态码不允许浏览器将原本为 POST 的请求重定向到 GET 请求上**。

### 临时重定向三者的区别

302 允许各种各样的重定向，一般情况下会实现为到 GET 的重定向，但不能保证 POST 重定向后还为 POST ；在 303 中，只允许到 GET 的重定向；307 行为和 302 一致，但不允许 POST 到 GET 的重定向。

### 产生三种重定向的原因

那为什么有了 307 和 303 还需要 302 呢？把总结放在最前面。302 在最初的定义中，内容和现在的 307 是一样的，不允许重定向方法的改写（从 POST 到 GET，由于 GET 不应该有 body，实际上 body 也被改了）。但是**早期浏览器在实现的时候有的实现成 303 的效果，有的实现成 307 的效果**。于是在之后的标准，302 在某些浏览器中错误的实现被写进规范，成为 303，而 302 原本的效果被复制了到了 307。在最近的一次标准修订中，302 标准被修改成不再强制需要维持原请求的方法。所以就产生了现在的 302、303 和 307

| 描述                                 | 永久重定向 | 临时重定向 |
| :----------------------------------- | :--------- | :--------- |
| 允许将请求的方法由 POST 重定向为 GET | 301        | 302        |
| 不允许将请求方法由 POST 重定向为 GET | 308        | 307        |

Reference:
[1. 知乎-HTTP 中的 301、302、303、307、308 响应状态码](https://zhuanlan.zhihu.com/p/60669395)
[2. StackOverflow-What's the difference between HTTP 301 and 308 status codes](https://stackoverflow.com/questions/42136829/whats-the-difference-between-http-301-and-308-status-codes)

## 两种重定向对 SEO 的影响

-   永久重定向：搜索引擎在抓取新内容的同时也将旧的网址替换为重定向之后的网址。
-   临时重定向：搜索引擎会**抓取新的内容而保留旧的网址**。因为服务器返回 302 代码，搜索引擎认为新的网址只是暂时的。
