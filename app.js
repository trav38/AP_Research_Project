const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const hbs = require('express-handlebars');
const port = process.env.PORT || 3000;
const app = express();
const db = require('./modules/db');
const ObjectID = require('mongodb').ObjectID; //Mongo db object id, ideads are stored in this format and require objectid for parsing
const path = require('path');

app.use(express.static('./public'));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(session({
    secret: "sessioncrandomkecy*D@#J@4$#$#caD"
}));
app.engine('hbs', hbs({
    extname: 'hbs'
}));
app.set('views', './views');
app.set('view engine', 'hbs');


/**Routes */
app.get('/add', (req, res) => {
    res.send("db");
});
app.get('/update', (req, res) => {
    db.conn("store", "snacks").then((db) => {

        db.update({
            "_id": ObjectID('5c9d89ab00547d2cb8eecaaf')
        }, {
            $set: {
                "name": "Banana Chips"
            }
        }).then((doc) => {
            console.log(doc)
            res.send("Updated");
        }).catch((err) => {
            console.log(err)
            res.send("err");
        })
    });

})
app.get('/', (req, res) => {
    db.conn("store", "snacks").then((db) => {
        db.fetch({}).then((doc) => {
            res.render('index', {
                title: "John's Shop",
                snacks: doc
            });
        }).catch((err) => {
            console.log(err);
        })
    })

});
app.get('/orders', (req, res) => {
    console.log(req.session.user)
    if (req.session.user) {
        db.conn("store", "orders").then((db) => {
            db.fetch({}).then((doc) => {
                res.render('orders', {
                    title: "John's Shop",
                    orders: doc,
                    customer: doc.customer,
                    snacks: doc.snacks
                });
            }).catch((err) => {
                console.log(err);
            })
        })
    } else {
        res.render('login');
    }
});
app.post('/order', (req, res) => {
    var snacks = [];
    var order = {};
    order.customer = req.body.customer;
    for (var snack in req.body.cart) {
        snacks.push(req.body.cart[snack]);
    }
    order.snacks = snacks;
    order.date = new Date();
    db.conn("store", "orders").then((db) => {
        db.insert(order).then(function (doc) {
            console.log(doc);
            res.send({
                "msg": true
            });
        }).catch((err) => {
            console.log(err);
            res.send({
                "msg": false
            });
        });
    });

});
app.get('/login', function (req, res) {
    console.log("login")
    res.render('login');
});

app.post('/login', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.render('login', {
            message: "Please enter both id and password"
        });
    } else {
        db.conn("store", "users").then((db) => {
            db.fetch(req.body).then(function (user) {
                if (user.length > 0) {
                    req.session.user = user[0]._id;
                    res.redirect('/orders');
                } else {
                    res.redirect('/login');
                }
            }).catch((err) => {
                console.log(err);
            })
        });
    }
});

app.get('/logout', function (req, res) {
    req.session.destroy(function () {
        console.log("user logged out.")
    });
    res.redirect('/login');
});
app.listen(port, () => console.log(`Listening on port ${port}...`));