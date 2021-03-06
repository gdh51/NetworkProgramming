# 一些常见的状态码

首先状态码是按编号分类的，主要分为5大类：

1. 1xx —— 请求已被接受，需要客户端继续处理
2. 2xx —— 请求成功，操作被成功接收并处理
3. 3xx —— 重定向类信息，需要进一步的操作以完成请求
4. 4xx —— 客户端错误，请求包含语法错误或无法完成请求
5. 5xx —— 服务器端错误，服务器在处理请求的过程中发生了错误

## 常见的状态码以及解释

状态码|英文名称|含义|举例
-|-|-|-
100|Continue|这个临时响应是用来通知客户端它的部分请求已经被服务器接收，且仍未被拒绝。客户端应当继续发送请求的剩余部分，或者如果请求已经完成，忽略这个响应。|无
101|Switching Protocols|更换协议，服务器根据客户端请求切换协议。只能切换到更高级的协议。|使用websocket时，将会升级为ws或wss协议
200|OK|请求成功。一般用于GET和POST请求|一般的请求成功时，都为200
204|No Content|无实体的主体内容。服务器成功处理，但未返回内容，客户端无需离开其当前页面|作为PUT请求的结果返回，更新资源，而不更改向用户显示的页面的当前内容。
206|Partial Content|部分内容。服务器成功处理部分GET请求|服务器向客户端传输一个文件
