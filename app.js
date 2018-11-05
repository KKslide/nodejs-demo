var express = require("express"),
    session = require("express-session"),
    app = express(),
    _frontEndRouter = require("./routes/index"),
    _adminRouter = require("./routes/admin");

// 静态资源托管
app.use(express.static("public"));
app.use("/upload", express.static("upload"));

// 配置session中间件
app.use(session({
    secret: "session_id",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 600 * 1000  // 保存一分钟
    },
    rolling: true
}));

// ejs模板
app.set("view engine", "ejs");

app.use("/", _frontEndRouter);
app.use("/admin", _adminRouter);

app.listen(8989, () => {
    console.log('http://127.0.0.1:8989');
});