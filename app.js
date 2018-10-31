let express = require("express"),
    session = require("express-session"),
    ejs = require("ejs"),
    md5 = require("md5-node"),
    bodyParser = require("body-parser"),
    multiparty = require("multiparty"),
    // form = new multiparty.Form(),
    DB = require("./lib/db"),
    app = express();

// 静态资源托管
app.use(express.static("public"));
app.use("/upload", express.static("upload"));

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
    DB.find("user", userInfo, (err, data) => {
        if (data.length > 0) {
            req.session.userInfo = data[0];
            res.redirect("/");
        } else {
            res.send(`<script>alert("登录失败，请重试！");window.location.href="/login"</script>`);
        }
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
    DB.find("product", {}, (err, data) => {
        res.render("index", {
            list: data
        });
    });
});

// 列表页
app.get("/add", (req, res) => {
    res.render("add");
});

// 增加操作
app.post("/doAdd", (req, res) => {
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
            res.redirect("/");
        });
    });
});

// 修改
app.get("/edit", (req, res) => {
    let _id = req.query.id;
    DB.find("product", { "_id": DB.ObjectID(_id) }, (err, data) => {
        res.render("edit", {
            list: data[0]
        });
    });
});

app.post("/doEdit", (req, res) => {
    let form = new multiparty.Form();
    form.uploadDir = "upload";
    form.parse(req, (err, fields, files) => {
        console.log(fields);
        console.log('!!!!!!!!!!--------!!!!!!!!!!');
        console.log(files);
        // return;
        let editID = fields._id[0];
        let editProduct = {
            "title": fields.title[0],
            "price": fields.price[0],
            "fee": fields.fee[0],
            "description": fields.description[0],
            "pic": files.pic[0].path
        }
        DB.update("product", { "_id": DB.ObjectID(editID) }, editProduct, (err, data) => {
            res.redirect("/");
        });
    });
});

// 删除
app.get("/del", (req, res) => {

});

app.listen(8989, () => {
    console.log('http://127.0.0.1:8989');
});