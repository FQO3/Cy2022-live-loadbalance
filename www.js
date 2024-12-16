const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const NodeMediaServer = require("node-media-server");
const { exec } = require("child_process");
const port = 1308;

//开启推流服务器
const config = {
    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 60,
        ping_timeout: 30,
    },
    http: {
        port: 8001,
        allow_origin: "*",
    },
};
const nms = new NodeMediaServer(config);
nms.run();

//初始化
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//设置跨域响应头
function setHeaders(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
}
app.use(setHeaders);
//网页发送系统
app.get("/", function (req, res) {
    res.redirect("/index.html");
});
app.use(express.static("PC"));
app.post("/api/create/:id", async (req, res) => {
    var code = req.params;
    const command = `ffmpeg -i rtmp://fqo3.site:1935/live/${code.id} -c copy -f flv rtmp://127.0.0.1:1935/live/${code.id}`;
    try {
        const { stdout, stderr } = exec(command);
        console.log(`已【成功】创建${code.id}的视频流`);
        res.sendStatus(200);
    } catch (error) {
        console.error(`Failed to execute command: ${error}`);
        res.sendStatus(403);
    }
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});