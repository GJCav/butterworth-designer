# Butterworth Filter Designer

> Contact: gjm20@mails.tsinghua.edu.cn



## 预部署地址

网页地址：[https://btw-designer.gjm20.top/](https://btw-designer.gjm20.top/)



## 本地构建

1. 克隆仓库：
   ```bash
   git clone https://github.com/GJCav/butterworth-designer.git
   ```

2. 安装依赖：
   ```bash
   cd butterworth-designer/web
   yarn install
   yarn generate
   ```

3. 本地预览、调试：
   ```bash
   yarn dev
   ```

   然后浏览器打开 `http://localhost:3000` 或上述指令提示地址。

4. 构建项目：
   ```bash
   yarn generate
   ```

   

该项目构建之后是一个纯静态网站，所有文件位于 `web/dist` 文件夹下，你可以在任意 HTTP 服务器上部署这个文件。



## 使用预构建文件

从 `Github Release` 下载最新的网站文件压缩包，在任意目录解压，可以使用 Python 预览这些文件：

```bash
cd ./where-you-unzip-the-files
python3 -m http.server 8080
```

然后浏览器打开 `https://localhost:8080` 即可看到网页。



## 若您是中国大陆用户

若您能打开 `Github` 那您应该理解并拥有一个特定的工具，因为该项目使用了 `jsdeliver`，所以建议在使用那个工具的前提下使用该项目，否则网页加载速度会比较慢，可能造成公式渲染错误等诡异情况。







