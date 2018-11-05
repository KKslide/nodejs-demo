var express = require("express"),
    md5 = require("md5-node"),
    bodyParser = require("body-parser"),
    DB=require("../../lib/db"),
    router = express.Router();

// 配置body-parser中间件
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// 登录页面
router.get("/", (req, res) => {
    res.render("admin/login");
});

// 登录操作
router.post("/doLogin", (req, res) => {
    let userInfo = {
        username: req.body.username,
        password: md5(req.body.password), // 这里要进行加密
    }
    DB.find("user", userInfo, (err, data) => {
        if (data.length > 0) {
            req.session.userInfo = data[0];
            res.redirect("/admin/product");
        } else {
            res.send(`<script>alert("登录失败，请重试！");window.location.href="/admin/login"</script>`);
        }
    });
});

// 退出登录操作
router.get("/logOut", (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.send("服务器有点小问题了，请刷新试试看~");
        res.redirect("/admin/login");
    });
});

module.exports = router;