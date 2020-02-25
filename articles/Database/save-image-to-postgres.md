title: 保存图片到数据库 Postgres
date: 2020-02-02 18:54:02
---

在开发工作中，保存从客户端上传而来的图片这种需求十分常见。

**而众所周知，保存图片或者其他二进制文件是一种十分不推荐的做法，主要原因是IO的效率，还有会增大宝贵数据库资源的消耗**

**但是**，在 Github 有很多自由的软件，在处理图片或一些文件上传的时候，很大部分都会直接保存在数据库，一方面这些开源软件根本不考虑高并发的使用场景，另一方面为了部署的简单。

> 很多开源的软件跟企业里开发的软件有一点很大不一样的地方，在企业中开发一个软件，通常一些配置信息都会检入代码管理系统，例如通常有 `application-dev.yaml`，`config.ini` 这样东西，这些代码库都是私有的，所以也很安全，如果审查机制不严格，甚至会在代码中硬编码很多环境的信息，但是开源软件不一样，为了在前期获得更高的人气，软件的部署或使用会尽可能简单；在服务方面，或许开发企业应用会随意使用一个 redis 服务，但是在开源软件中，这以为使用者要部署一个 Redis，这无疑会加大了部署的难度和时间。

## 存储图片

例如笔者曾经做过一个需求，要求获取网站的 favicon 保存起来，当时并没有任何基础设施，直接保存在硬盘要考虑很多因素，而使用或搭建一个像 s3 一样的存储服务又来不及，所以考虑再三，还是索性保存在数据库吧，因为 favicon 本身也不大，普遍都是 32x32 的位图。

``` typescript
const domain = `www.google.com`;
axios.get(`https://www.google.com/s2/favicons?domain=${domain}`, {
    responseType: 'arraybuffer'
  }).then(r => r.data);
```


> ### ArrayBuffer
> 这段代码使用的 typescript，使用 axios 获取图片的二进制内容， array buffer 代表内存之中的一段二进制数据，可以通过“视图”进行操作。“视图”部署了数组接口，这意味着，可以用数组的方法操作内存。
> [https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

然后直接保存在数据库中，而 pg 的字段类型我们选择了 `bytea`

```
favicon bytea
```



