var express = require("express"),
    router = express.Router();

router.get("/", (req, res) => {
    res.send("商城首页正在施工中。");
});

router.get("/product", (req, res) => {
    res.send("商城商品列表页。");
});

module.exports = router;