var express = require('express');
var exphbs  = require('express-handlebars');
const mercadopagoCO = require('./mercadopago');

var port = process.env.PORT || 3000

var app = express();
 

app.use(express.urlencoded({
    extended: true
}))

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

app.get('/rechazado', function (req, res) {
    res.render('rechazado');
});

app.get('/pendiente', function (req, res) {
    res.render('pendiente');
});

app.get('/autorizado', function (req, res) {
    res.render('autorizado', req.query);
});

app.post('/notificacion', function (req, res) {
    console.log("Notifica +++++"+ JSON.stringify(req.body))
    res.status(200).end() 
});

app.get('/notificacion', function (req, res) {
    res.render('notificacion');
});


app.post('/preference', (req, res) =>{
    let id = parseInt(Math.random() * (100 - 1) + 1);
    let preference = {

        external_reference: "A-Product " + id ,
        back_urls: {
            success: 'https://reddalex-mp-commerce-nodejs.herokuapp.com/autorizado',
            pending: 'https://reddalex-mp-commerce-nodejs.herokuapp.com/pendiente',
            failure: 'https://reddalex-mp-commerce-nodejs.herokuapp.com/rechazado'
        },
        auto_return: "all",
        notification_url: 'https://reddalex-mp-commerce-nodejs.herokuapp.com/notificacion',
        items: [
            {
                "title": req.body.title,
                "description": req.body.title,
                "picture_url": req.body.img,
                "quantity": parseInt(req.body.unit),
                "unit_price": parseInt(req.body.price)
            }
        ]
    }

    return mercadopagoCO.checkout(preference).then(response => {
        console.log(response)
        let init_point = response.body.init_point
        res.redirect(init_point);
    })
}) 

app.listen(port);