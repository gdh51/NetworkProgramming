# CSRF

`CSRF(Cross-site Request Forgery)`即跨站请求伪造，也被称为`XSRF`。

## CSRF 的危害及其攻击手段

攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送**跨站**请求。利用受害者在被攻击网站已经获取的**注册凭证**，绕过后台的用户验证，达到冒充用户对被攻击的网站执行某项操作的目的。

> 注意这里是跨站不是跨域，跨站指**顶级域名**和**二级域名**与**协议**相同，端口可以不一样，则为跨站；跨域为主机、端口、协议三者都一样。所以**跨站一定跨域，但跨域不一定跨站**。

攻击者可以利用被攻击者的身份，发送请求，来进行一系列的操作，比如：用你的账号关注他的账号、用你的账号转账、删除你账号的内容等等。

---

1. 用户登录会产生凭证的网站 A(该凭证短时间不会过期)
2. 用户登录攻击者的网站 B，在网站 B 中向 A 中
3. A 网站信息被盗

### 具体的攻击手段

1. `html+js`通过`src/href`属性发送请求

```html
<link href="…" />
<img src="…" />
<iframe src="…">
    <meta http-equiv="refresh" content="0; url=…" />
    <script src="…">
        <video src="…">
        <audio src="…">
        <a href="…">
        <table background="…">
        <script>
            new Image().src = 'url';
    </script></iframe
>
```

以上方式都可以用来发送`get`类型的请求，通过表单可以发送 post 类型的请求

2. `JSON HiJacking`：我们通过`JSONP`发送请求时，攻击者拦截 JSONP 请求返回的数据，将数据发送至自己的服务器。

## CSRF 的攻击原理

`CSRF`攻击产生的原因来源于`WEB`的隐式身份验证机制：其可以保证请求来源于同一个浏览器，但却不能保证请求来源于同一个用户。

而**用户在 B 网站中向 A 发送请求时，默认情况下会携带 A 的`cookie`**。

## CSRF 预防方法

### 客户端方面

1. 在表单提交时，加入一个`token`，因为第三方网站原则上是无法获取`cookie`中的这个`token`的。这个`token`由服务器端下发，再接收用户请求时，在对其进行验证。

2. 验证码：在每次提交表单时都需要提交验证码。

3. 双重`Cookie`验证，按以下流程进行验证：
    1. 用户访问页面时，服务器向客户端发送一个`token`
    2. 当用户向服务器再次发送请求时，将该`token`拼接至 URL 的查询字符串
    3. 后端验证`Cookie`中的字段是否与`URL`中的`token`是否相同

这种方法后端就需要存储和查询`token`了

#### 随机 token 方法的改进

第一个方法的缺点在于如何生成这个随机的`token`与如何防止其泄漏。还需要一台单独的服务器来对这个`token`和表单进行处理。增对这些缺点以下有个新方法：在提交表单时，客户端通过 JS 生成一个临时的`Cookie`字段，并在提交后立即过期，服务器端只需验证该`Cookie`是否存在即可。(由于同源策略，攻击者无法跨域设置`cookie`)

---

这种方法只使用单域名的站点，或者安全需求不需要“当子域发生 XSS 隔离父域”。因为子域是可以操作父域的`Cookie`的（通过设置当前域为父域的方式），所以这种方法的缺点也比较明显：**这种方法无法防御由于其他子域产生的 XSS 所进行的表单伪造提交**（注意：使用`token`可能也会有这样的问题，马上说到）。但如果对于单域站点而言，这种防御方法的安全性可能会略大于`token`。

### 服务器方面

因为这些请求都是跨域的，所以服务器可以针对这点对其`Referer`字段进行检测。但如何攻击者通过`XSS`攻击进行结合不进行跨域攻击时，这个方法就无效了。

1. 检测客户端请求的`Referer`与`Origin`是否跨域

由于请求是伪造的，所以用户必须有一个身份凭证，那么我们可以针对这个凭证的有效时间进行防御：

2. 限制`Session`的生命周期(不太好哦)

针对`JSONP HiJacking`这种攻击方式，服务器端可以在返回脚本的开始部分加入`'while(1);'`：

3. 加入该字段可以使攻击者代码陷入死循环中，而客户端可以先将该段代码去掉再进行处理。

4. 设置`Cookie`的`Samesite`属性：当设置该值为`Lax`时部分跨站请求携带第三方`Cookie`，设置为`Strict`时完全不允许。

Reference:

1. [Why does Google prepend while(1); to their JSON responses?](https://stackoverflow.com/questions/2669690/why-does-google-prepend-while1-to-their-json-responses)

#### Cookie 的 SameSite

`Cookie`的`SameSite`属性，可以在**跨站**请求时，不发送三方`Cookie`一共有三个值：

-   `Lax`：跨站时，允许部分三方请求携带`Cookie`
-   `Strict`：完全禁止三方`Cookie`
-   `None`：完全不禁止任何三方`Cookie`。

> `Chrome`中`SameSite`默认值为`Lax`；`Safari`中`SameSite`默认值为`Strict`

当我们设置`SameSite`值为`Lax`时，仅以下请求可以携带三方`Cookie`

-   `<a href=""/>`：链接标签
-   `<link rel="prerender" href="" />`：预渲染
-   `<form action="POST" />`：`POST`的表单提交

当`SameSite`的值为`None`时也需要注意，其只支持`HTTPS`协议，所以对应的`Cookie`还需设置`Secure`字段

Reference:

1. [知乎-Cookie SameSite 简析](https://zhuanlan.zhihu.com/p/266282015)

## NodeJs 例子

1. 首先使用客户端在正常的情况下获取`cookie`
2. 在使用其他客户端内嵌`iframe`去请求之前的网站
3. 发送请求携带`cookie`且未服务器端未设置`CROS`

在该目录的`app`文件中附属一个`node`服务器，可以自己改改实践一下。

Reference:

1. [邪恶的 CSRF](https://juejin.im/post/5aa11982f265da23a1417935#heading-6)
2. [浅谈 CSRF 攻击方式](https://www.cnblogs.com/hyddd/archive/2009/04/09/1432744.html)
3. [前端安全系列之二：如何防止 CSRF 攻击？](https://juejin.im/post/5bc009996fb9a05d0a055192#heading-24)
