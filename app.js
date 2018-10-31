let express = require("express"),
    session = require("express-session"),
    ejs = require("ejs"),
    md5 = require("md5-node"),
    bodyParser = require("body-parser"),
    MongoClient = require("mongodb").MongoClient,
    DBurl = "mongodb://127.0.0.1:27017/test",
    app = express();

// 静态资源托管
app.use(express.static("public"));

// 配置body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

// 判断登录状态中间件
app.use((req, res, next) => {
    if (req.url == "/login" || req.url == "/doLogin") {
        next();
    } else {
        if (req.session.userInfo && req.session.userInfo.username != "") {
            app.locals["userInfo"] = req.session.userInfo;
            next();
        } else {
            res.redirect("/login")
        }
    }
});

// 登录页面
app.get("/login", (req, res) => {
    res.render("login")
});

// 登录操作
app.post("/doLogin", (req, res) => {
    let userInfo = {
        username: req.body.username,
        password: md5(req.body.password), // 这里要进行加密
    }
    MongoClient.connect(DBurl, (err, client) => {
        let dbo = client.db("test");
        dbo.collection("user").find(userInfo).toArray((err, data) => {
            console.log(data);
            if (data.length > 0) {
                req.session.userInfo = userInfo;
                res.redirect("/");
            } else {
                res.send(`<script>alert("登录失败，请重试！");window.location.href="/login"</script>`);
            }
        });
    });
});

// 退出登录操作
app.get("/logOut", (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.send("服务器有点小问题了，请刷新试试看~");
        res.redirect("/");
    });
});

// 首页
app.get("/", (req, res) => {
    res.render("index");
});

// 列表页
app.get("/edit", (req, res) => {
    res.render("edit");
});

app.listen(8989, () => {
    console.log('http://127.0.0.1:8989');
});