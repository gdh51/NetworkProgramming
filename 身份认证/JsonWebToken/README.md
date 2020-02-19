# JsonWebToken

## 什么是JsonWebToken

沿用官网的解释：[RFC 7519](https://tools.ietf.org/html/rfc7519)规范定义其为一种紧凑的、自包含且使用JSON对象形式进行**安全**传输的方式。我们可以验证和信任这些信息，因为它是经过密钥加密并签名的。

## JsonWebToken的原理

JsonWebToken由三部分组成，每个部分由`.`分隔。：

- Header(头部)
- Payload(数据荷载)
- Signature(签名)

它的大致形式为`xxxxx.yyyyyy.zzzzz`，下面对每个部分详细介绍

### Header(头部)

在头部通常由两部分组成：`token`的类型与其所使用的哈希算法。

比如：

```js
{
  "alg": "HS256",
  "typ": "JWT"
}
```

之后这些`JSON`对象便通过`Base64Url`编码后称为`JWT`的第一部分。

### Payload(数据荷载)

数据荷载也是JWT的第二部分，它包含了一些声明，也就是描述一些用户信息和其他数据，按照分类它能分为保留、公共、私有声明，这里就不详细描述了。

一个具体的荷载可以为：

```js
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```

之后这个荷载也要被Base64Url编码后添加到JWT的第二部分。

### Signature(签名)

在创建签名之前，我们必须要有之前编码的两个部分，然后我们通过之前要说明要使用的密钥和加密算法对其进行签名。

比如上述两个部分，经过签名后就为：

```js
HMACSHA256(
    base64UrlEncode(header) + "." +
    base64UrlEncode(payload),
    secret)
```

签名主要是用于验证`JWT`的发送方和确保我们的数据荷载未被篡改。

### JsonWebToken的工作方式

了解了它的组成，那么它是如何工作的呢？

首先在用户认证登录时，认证成功时，服务器会返回一个`JWT`给用户。因为`JWT`是一个凭证，所以我们需要注意其安全问题，一般来说不应该保留太久。

之后用户每次访问页面时，都会在报文头部中添加该凭证：

```js
Authorization: Bearer <token>
```

因为`JWT`是无状态的，所以它并不会存储在服务器端以及数据库，这就避免了服务器访问数据库带来的开销；同时它是自包含的，所以我们完全可以直接从它身上直接获取有关信息；由于它不使用`cookie`所以它并不会产生`CORS`问题。

[JWT详细说明](https://auth0.com/learn/json-web-tokens/)
[JWT规范RFC](https://tools.ietf.org/html/rfc7519)