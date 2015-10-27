C++简明教程
=========================================

简单易懂的C++教程。全部翻译自 [LearnCpp.com](http://www.learncpp.com/)。

本项目网站：http://www.cpp-learning.com ，此项目为网站源码以及翻译内容。

### 运行该网站

### 运行环境
1. NodeJS 4.0+
2. NPM 2.3+
3. Make
4. Python


### 安装依赖

    npm install babel-node -g

then,

    npm install

### 运行网站

    make server

打开 http://localhost:8000

### 编写文章、编译

`src/chapters`目录下为每章的目录，章目录下为每个小节的内容；采用markdown语法，所以文件的后缀都为`.md`。

写好markdown以后进行编译：

    make

然后可以在 http://localhost:8000 看到更新。

### 贡献

对本项目有兴趣并且希望贡献翻译内容的，可以fork按照上面的规范进行翻译，然后发pull request。

