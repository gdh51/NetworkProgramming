# HTTP发展历史

## HTTP1.0和HTTP1.1的区别

1. **缓存处理**：HTTP1.0使用`If-Modified-Since`，`Expires`来做缓存的处理；HTTP2.0加入更多的缓存策略来做缓存处理如：`Etag`、`If-Unmodified-Since`、`If-Match`、`Cache-Control`等头部。

2. **带宽优化及网络连接的使用**：HTTP1.0中存在一些浪费带宽的现象：如客户端只想请求服务器端某个对象的一部分数据，而服务器会将整个数据发送过来，并且不支持断点续传功能。HTTP1.1中加入`range`头部，它允许只请求资源的某个部分，即返回码是206（Partial Content）。

3. **状态信息的增加**，HTTP1.1中新增了许多状态码，可以更好的处理信息的结果。

4. **Host头部的处理**：在HTTP1.0中认为每条服务器都绑定唯一的IP，因此请求的消息的URL并没有传递主机名，但随着虚拟主机技术的发展，在一台物理服务器上可以存在多个虚拟主机（Multi-homed Web Servers），并且它们共享一个IP地址。HTTP1.1的请求消息和响应消息都应支持Host头域，且请求消息中如果没有Host头域会报告一个错误（400 Bad Request）。

5. **长连接**：HTTP1.1中支持长连接和请求的流水线处理：在一个TCP连接上可以传送多个HTTP请求和响应，减少了建立和关闭TCP连接的损耗和延迟；而HTTP1.0每个HTTP请求都会经历一个TCP连接的建立和关闭。

## SPDY：HTTP1.X的优化

其为Google推出的一套方案，优化了HTTP的请求延迟，提高了安全性，并达到了以下作用：

1. **降低延迟**：针对HTTP的高延迟，SPDY采用了多路复用，通过多个请求共享一个TCP连接的方式，解决了HTTP1.1中流水线传输[头阻塞](../../HTTP/UDP,TCP协议/TCP/README.md#%e6%8f%90%e9%97%ae)的问题，降低了延迟并提高了带宽利用率。

2. **请求优先级**： 由于多路复用带来了新的问题——请求被阻塞，为了解决该问题，SPDY允许给每个请求设置一个优先级，这样优先级高的请求会优先得到响应。

3. **header压缩**：HTTP1.x的header很多时候都存在重复多余的情况。使用合适的压缩算法可以减少包的大小和数量。

4. **基于HTTPS的加密协议传输**：提升数据的安全性

5. [**服务器推送**](#%e6%9c%8d%e5%8a%a1%e5%99%a8%e6%8e%a8%e9%80%81)

SPDY位于HTTP之下，TCP和SSL之上，这样可以轻松兼容老版本的HTTP协议(将HTTP1.x的内容封装成一种新的frame格式)，同时可以使用已有的SSL功能。

## HTTP2.0：SPDY升级版

### HTTP2.0与SPDY区别

HTTP2.0跟SPDY很大部分有相似之处，但它们也存在如下区别：

1. HTTP2.0支持明文传输；SPDY使用的是HTTPS传输
2. HTTP2.0采用[HPACK](http://http2.github.io/http2-spec/compression.html)头部压缩算法，而SPDY采用[DEFLATE](http://zh.wikipedia.org/wiki/DEFLATE)

### HTTP1.0与HTTP2.0区别

1. [**报文传输格式**](#%e6%8a%a5%e6%96%87%e4%bc%a0%e8%be%93%e6%a0%bc%e5%bc%8f%e4%ba%8c%e8%bf%9b%e5%88%b6%e5%88%86%e5%b8%a7)：HTTP1.X的解析是基于文本的；HTTP2.0是基于二级制格式的传输。

2. **多路复用**：即共享连接，一个请求对应一个id，接收方可以根据id来归纳属于哪个服务器。

3. [**头部压缩**](#%e9%a6%96%e9%83%a8%e5%8e%8b%e7%bc%a9)：HTTP2.0使用`encoder`来减少需要传输的`header`大小，通讯双方各自缓存一份`header fields`表，既避免了重复`header`的传输，又减小了需要传输的大小。

4. **服务器推送**

[参考1](http://www.alloyteam.com/2016/07/httphttp2-0spdyhttps-reading-this-is-enough/)

### HTTP2.0详情

#### 报文传输格式——二进制分帧

HTTP2.0在应用层与传输层之间新增了一个二进制分帧层

![二进制分帧](./imgs/binary&#32;format.jpg)

在二进制分帧层中， HTTP/2 会将所有传输的信息分割为更小的消息和帧（`frame`）,并对它们采用二进制格式的编码 ，其中 HTTP1.x 的首部信息会被封装到 `HEADER frame`，而相应的 `Request Body` 则封装到 `DATA frame` 里面。

#### 首部压缩

HTTP/1.1并不支持 HTTP 首部压缩，为此 SPDY 和 HTTP/2 应运而生， `SPDY` 使用的是通用的`DEFLATE` 算法，而 HTTP/2 则使用了专门为首部压缩而设计的 `HPACK` 算法。

HTTP2.0具体采取以下措施：

- 在客户端与服务器端使用“首部表”来跟踪和存储之前发送的首部的键值对，对于相同的数据，不再通过请求和响应发送。
- 首部表在 HTTP/2 的连接存续期内始终存在，由客户端和服务器共同渐进地更新
- 每个新的首部键值对要么被追加到当前表的末尾，要么替换表中之前的值

![头部压缩](./imgs/header&#32;compress.jpg)
[参考](https://my.oschina.net/editorial-story/blog/3031721)

#### 服务器推送

服务器可以向客户端推送所需要的资源，避免不必要的往返传输，举个例子：

```html
<img src="pic.01.com" data-original="pic.zio.com">
```

有个上述标签存在服务器返回的html文件中，当该文件返回时，服务器会向客户端同时发送对应的css、js文件，而无需通知客户端。此时多个往返传输就变成了一个。

##### 存在的问题

**假如此时客户端恰好有一份服务器端自己推送的文件的缓存，那么该怎么办**？

因为服务器推送本身具有投机性，所以可能会出现自己推送的文件是客户端不需要的情况。

>在这种情况下，HTTP2.0允许客户端通过RESET_STREAM主动取消Push，但主动取消就意味着浪费了数据往返传输的价值。

对此的解决方法是：客户端使用一个简洁的`Cache Digest`来告诉服务器，哪些东西已经缓存，服务器知道后，就不会在push这些东西。因为 `Cache Digest` 使用的是 `Golumb Compressed Sets`，浏览器客户端可以通过一个连接发送少于 1K 字节的 `Packets` 给服务端，通知哪些是已经在缓存中存在的。

[HTTP1.0Z至HTTP2.0的迁移](https://www.w3ctech.com/topic/1563#tip7sharding)
[Nginx HTTP2.0白皮书](https://www.nginx.com/wp-content/uploads/2015/09/NGINX_HTTP2_White_Paper_v4.pdf)
[HTTP/2 对现在的网页访问，有什么大的优化呢？体现在什么地方？](https://www.zhihu.com/question/24774343/answer/96586977)
