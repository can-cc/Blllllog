title: Web前端架构杂谈：单页面应用和服务器模板系统
date: 2015-01-11 12:16:07
tags:
- spa
- Web前端架构
- 单页面应用
- 服务器模板
---

单页Web应用程序：

单页应用（Single Page Application）越来越受web开发者欢迎，单页应用的体验可以模拟原生应用，一次开发，多端兼容。单页应用并不是一个全新发明的技术，而是随着互联网的发展，满足用户体验的一种综合技术，更大有吹捧者。

这种技术近几年随着移动端的大热也渐渐升温，BackBone，Angular等前端框架兴起，结合NodeJs，使得前后端语言同一，前端开发可以兼容后端开发等等，并有替代前几年一统天下的jQuery趋势。

jQuery的缺点其实非常明显，臃肿和维护性差。

这里推荐一篇文章：http://www.angularjs.cn/A0bz

确实，前端框架非常诱人，不过也有着致命的缺点，SEO问题，要知道，搜索引擎届领跑者Google在Ajax爬取方面尚未取得突破性的成就，更别提国内竞价排名的百度了。


Ajax爬取也称为暗网爬取，爬虫需要很复杂的算法支持，而单页面前端和后端的连接也基本上通过ReSTful Api，ReSTful Api最近几年的流行程度大家也是知道的了，大家选择ReSTful Api的原因之一可能是“ReSTful Api对搜索引擎友好”，但据我所知，国内的百度对ReSTful Api的支持尚不及传统的Web风格（呵呵一笑了）。


所以，当你选择了单页面前端应用的时候，里面的内容基本上是很难被搜索引擎获取到的了，单页面前端做信息和展示的想法基本上可以否决掉，商业上的应用也是不用想的了，或许可以做一个功能，不过像Angular这个高度封装的框架对这样的构想不太支持，所以可能又会回到jQuery的路线。


但是，单页面应用对移动端的响应式支持又十分诱人，不想放弃，而且单页面应用的前端效果也非常理想。


或许可以用一种取中的方法，传统前端与单页面前端结合！


不过这种想法很快就被我自己否决掉了，例如J2EE平台，用Jsp或者velocity做view层，再耦合Angular，因为Jsp和velocity属于模板系统的范畴，${}等等标签，遇到angular的双括号会不兼容的，必须转义，python平台的Django框架也一样，造成代码的混乱，可维护和可读性非常差。


就我个人觉得，单页面应用和模板前端的结合，是一个Bad Idea！
