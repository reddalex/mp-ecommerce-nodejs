var express = require('express');
var exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mercadopagoCO = require('./mercadopago');

var port = process.env.PORT || 3000

var app = express();
 

app.use(express.urlencoded({
    extended: true
}))

app.use(bodyParser.json())

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
    console.log(req.body) 
    res.status(200).end() 
});

app.get('/notificacion', function (req, res) {
    res.render('notificacion');
});


app.post('/preference', (req, res) =>{
    let id = parseInt(Math.random() * (100 - 1) + 1);
    let preference = {

        external_reference: 'reddalex1405@gmail.com',
        back_urls: {
            success: 'https://reddalex-mp-commerce-nodejs.herokuapp.com/autorizado',
            pending: 'https://reddalex-mp-commerce-nodejs.herokuapp.com/pendiente',
            failure: 'https://reddalex-mp-commerce-nodejs.herokuapp.com/rechazado'
        },
        payment_methods: {
            excluded_payment_methods: [
                {
                    id: 'amex'
                }
            ],
            excluded_payment_types: [
                {
                    id: 'atm'
                }
            ],
            installments: 6
        },
        auto_return: 'approved',
        payer: {
            name: 'Lalo',
            surname: 'Landa',
            email: 'test_user_81131286@testuser.com',
            phone: {
                area_code: '52',
                number: '5549737300'
            },
            address: {
                street_name: 'Insurgentes Sur',
                street_number: 1602,
                zip_code: '0394​0'
            }
        },
        notification_url: 'https://reddalex-mp-commerce-nodejs.herokuapp.com/notificacion',
        items: [
            {
                id: '1234',
                title: req.body.title,
                description:'​Dispositivo móvil de Tienda e-commerce​',
                picture_url: 'http://reddalex-mp-commerce-nodejs.herokuapp.com/assets/motorola-moto-g4-3.jpg',
                quantity: parseInt(req.body.unit),
                unit_price: parseInt(req.body.price)
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