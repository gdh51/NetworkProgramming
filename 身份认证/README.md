# 身份认证

由于 HTTP 是无状态的服务，所以我们无法通过一个连接来判断连接另一端的用户是否为哪一个用户，所以应运而生的，出现了`cookie`这一产物来记录连接左右用户的各种状态。`cookie`作为一种携带数据的凭证，在服务器端必须要将某些用户数据存储起来，以确保这个凭证对应某个用户，这种记录用户与服务器之间处于何种会话的状态的凭证就叫`session`。随着时间推移，各种新的用于描述会话状态的凭证出现，比如`Token`、`JWT`。

目录：

-   [Token](./Token/README.md)
-   [JWT](./JsonWebToken/README.md)
-   [Oauth2.0](./Oauth2.0/README.md)
