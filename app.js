let express = require("express"),
    session = require("express-session"),
    ejs = require("ejs"),
    app = express();

// 静态资源托管
app.use(express.static("public"));

// ejs模板
app.set("view engine", "ejs");

// 登录页面
app.get("/login", (req, res) => {
    res.render("login")
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