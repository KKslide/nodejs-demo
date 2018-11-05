var express = require("express"),
    multiparty = require("multiparty"),
    fs = require("fs"),
    DB = require("../../lib/db"),
    router = express.Router();

// 商品列表
router.get("/", (req, res) => {
    DB.find("product", {}, (err, data) => {
        res.render("admin/product/index", {
            list: data
        });
    });
});

// 商品添加页面
router.get("/add", (req, res) => {
    res.render("admin/product/add");
});

// 商品添加操作
router.post("/doAdd", (req, res) => {
    let form = new multiparty.Form();
    form.uploadDir = "upload";
    form.parse(req, (err, fields, files) => {
        let newProduct = {
            "title": fields.title[0],
            "price": fields.price[0],
            "fee": fields.fee[0],
            "description": fields.description[0],
            "pic": files.pic[0].path
        }
        DB.insert("product", newProduct, (err, data) => {
            res.redirect("/admin/product");
        });
    });
});

// 商品修改
router.get("/edit", (req, res) => {
    let _id = req.query.id;
    DB.find("product", { "_id": DB.ObjectID(_id) }, (err, data) => {
        res.render("admin/product/edit", {
            list: data[0]
        });
    });
});

// 商品修改操作
router.post("/doEdit", (req, res) => {
    let form = new multiparty.Form();
    form.uploadDir = "upload";
    form.parse(req, (err, fields, files) => {
        var editID = fields._id[0];
        var editProduct = {
            "title": fields.title[0],
            "price": fields.price[0],
            "fee": fields.fee[0],
            "description": fields.description[0],
            "pic": files.pic[0].path
        }
        var OriginalFilename = files.pic[0].originalFilename;
        var pic = files.pic[0].path;
        if (OriginalFilename) { // 修改了图片
            editProduct['pic'] = pic;
        } else { // 没有修改图片
            delete editProduct['pic'];
            fs.unlink(pic);
        }
        DB.update("product", { "_id": DB.ObjectID(editID) }, editProduct, (err, data) => {
            res.redirect("/admin/product");
        });
    });
});

// 删除商品操作
router.get("/del", (req, res) => {
    let id = req.query.id;
    DB.delete("product", { "_id": DB.ObjectID(id) }, (err, data) => {
        res.redirect("/admin/product");
    });
});

module.exports = router;