const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// ------------------------------------------------------------------------------------------------
// Connection:
mongoose.connect("mongodb://127.0.0.1:27017/WikiDB", { useNewUrlParser: true });
// Schema:
const articleSchema = {
    title: String,
    content: String
};
// Model:
const Article = mongoose.model("Article", articleSchema);
// ------------------------------------------------------------------------------------------------
// GET ("/articles"):
// app.get("/articles", (req, res) => {
//     Article.find({}, (err, foundArticles) => {
//         if(!err) {
//             res.send(foundArticles);
//         } else {
//             res.send(err);
//         }
//     });
// });

// POST ("/articles"):
// app.post("/articles", (req, res) => {
//     const newArticle = new Article({
//         title: req.body.title,
//         content: req.body.content
//     });

//     newArticle.save((err) => {
//         if(!err) {
//             res.send("Success")
//         } else {
//             res.send(err);
//         }
//     });
// });

// DELETE ("/articles"):
// app.delete("/articles", (req, res) => {
//     Article.deleteMany({}, (err) => {
//         if(!err) {
//             res.send("Success");
//         } else {
//             res.send(err);
//         }
//     });
// });

// Chained Route Handlers (GET, POST, DELETE):
app.route("/articles")
    .get((req, res) => {
        Article.find({}, (err, foundArticles) => {
            if(!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
    
        newArticle.save((err) => {
            if(!err) {
                res.send("Success")
            } else {
                res.send(err);
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany({}, (err) => {
            if(!err) {
                res.send("Success");
            } else {
                res.send(err);
            }
        });
    })
// ------------------------------------------------------------------------------------------------
app.route("/articles/:articleTitle")
    .get((req, res) => {
        let articleTitle = req.params.articleTitle; 
        Article.findOne({ title: articleTitle }, (err, foundArticle) => {
            if(!err) {
                res.send(foundArticle);
            } else {
                res.send(err);
            }
        })
    })
    .put((req, res) => {
        let articleTitle = req.params.articleTitle;
        Article.updateOne(
            { title: articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            function(err) {
                if(!err) {
                    res.send("Success");
                } else {
                    res.send("error: " + err);
                }
            }
        )
    })
    .patch((req, res) => {
        let articleTitle = req.params.articleTitle;
        Article.updateOne(
            { title: articleTitle },
            { $set: req.body },
            (err) => {
                if(!err) {
                    res.send("Success");
                } else {
                    res.send(err);
                }
            }
        )
    })
    .delete((req, res) => {
        let articleTitle = req.params.articleTitle;
        Article.deleteOne(
            { title: articleTitle },
            (err) => {
                if(!err) {
                    res.send("Success");
                } else {
                    res.send(err);
                }
            }
        )
    });



// ------------------------------------------------------------------------------------------------
// LISTEN:
app.listen(3000, () => {
    console.log("Server is listening on port 3000....");
});