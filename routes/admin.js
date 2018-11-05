var express = require("express"),
    login = require("./admin/login"),
    product = require("./admin/product"),
    sort = require("./admin/sort"),
    router = express.Router();

/* 判断权限 */
router.use((req, res, next) => {
    if (req.url == "/login" || req.url == "/login/doLogin") {
        next();
    } else {
        if (req.session.userInfo && req.session.userInfo.username != "") {
            // app.locals // 可以设置全局变量
            // req.app.locals // 可以设置请求中的全局变量
            req.app.locals["userInfo"] = req.session.userInfo;
            next();
        } else {
            res.redirect("/admin/login")
        }
    }
});

router.use("/login", login); //登录页面
router.use("/product", product); //商品列表页
router.use("/sort", sort); //商品分类

module.exports = router;