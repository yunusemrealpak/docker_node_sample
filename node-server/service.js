const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const {esClient, createIndex} = require("./elastic-client")
const bodyParser = require('body-parser')
const app = express()

//Redis
var redis = require("redis")
var redisClient = redis.createClient({
    port: 6379,
    host: 'redis'
})

redisClient.on('connect', function () {
    console.log("Redis client bağlandı")
})

redisClient.on('error', function () {
    console.log("Redis Client hata verdi")
})

// RabbitMQ

var amqp = require('amqplib')

const rabbitSettings = {
    protocol: 'amqp',
    hostname: 'rabbitmq',
    port: 5672,
    username: 'guest',
    password: 'guest',
    vhost: '/',
    authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL']
}


async function sendRabbitMQ(queueName, data) {
    const conn = await amqp.connect(rabbitSettings)
    console.log('Producer connected')
    const channel = await conn.createChannel()
    const res = await channel.assertQueue(queueName)

    channel.sendToQueue(queueName, Buffer.from(data))
}

// RabbitMQ End

app.use(cors({
    exposedHeaders: ['Content-Length', 'Content-Type', 'Authorization', 'RefreshToken', 'Token'],
}))

// Swagger
// var swaggerUi = require('swagger-ui-express')
// swaggerDocument = require('./swagger.json')

// app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
//---------------------

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Mongodb

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://mongo:27017", {
    useNewUrlParser: true,
    //user: process.env.DB_USER,
    //pass: process.env.DB_PASS,
}).then(() => {
    console.log('successfully connected to the database');
}).catch(err => {
    console.log('error connecting to the database');
    process.exit();
});

var testSchema = new mongoose.Schema({
    name: String,
    count: Number,
})

var Test = mongoose.model('Test', testSchema, 'tests');

//////////////////////

app.get('/getTests', function (req, res) {
    Test.find(function (err, doc) {
        res.send(doc);
    })
})


app.post('/insertTest', async (req, res) => {
    try {
        var test = new Test(req.body);
        var result = test.save();

        console.log("Test kaydı mongo'ya eklendi")
        //Redis Insert
        if (redisClient.connected) {
            var name = req.body.name
            var data = JSON.stringify(test)
            redisClient.set(name, data, function (err, res) {
                if (err) console.log("Redise kayıt edilirken hata oluştu")
            });
        }
        console.log("RabbitMQ'ya gönderiliyor")
        sendRabbitMQ("tests", JSON.stringify(req.body))
        var resp = await createIndex("tests")
        console.log("Index : ",resp)
        res.status(200).send(req.body)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.listen(3000);