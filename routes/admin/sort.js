var express = require("express"),
    multiparty = require("multiparty"),
    DB = require("../../lib/db"),
    router = express.Router();

router.get("/", (req, res) => {
    DB.find("sort", {}, (err, data) => {
        res.render("admin/sort/index", {
            list: data
        });
    });
});

router.get("/add", (req, res) => {
    res.render("admin/sort/add");
});

router.post("/doAdd", (req, res) => {
    var form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
        var postData = {
            "sortname": fields.sortname[0],
            "description": fields.description[0]
        };
        DB.insert("sort", postData, (err, data) => {
            res.redirect("/admin/sort");
        });
    });
});

router.get("/edit", (req, res) => {
    var _id = req.query.id;
    DB.find("sort", { "_id": DB.ObjectID(_id) }, (err, data) => {
        res.render("admin/sort/edit", {
            list: data[0]
        });
    });
});

router.post("/doEdit", (req, res) => {
    var _id = req.query.id;
    var form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
        var postData = {
            "sortname": fields.sortname[0],
            "description": fields.description[0]
        };
        console.log(postData);
        DB.update("sort", { "_id": DB.ObjectID(_id) }, postData, (err, data) => {
            res.redirect("/admin/sort");
        });
    });
});

router.get("/del", (req, res) => {
    var _id = req.query.id;
    DB.delete("sort", { "_id": DB.ObjectID(_id) }, (err, data) => {
        res.redirect("/admin/sort");
    });
});

module.exports = router;