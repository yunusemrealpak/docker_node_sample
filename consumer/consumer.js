const amqp = require('amqplib')

const rabbitSettings = {
    protocol: 'amqp',
    hostname: 'rabbitmq',
    port: 5672,
    username: 'guest',
    password: 'guest',
    vhost: '/',
    authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL']
}

async function connect() {
    try {
        const conn = await amqp.connect(rabbitSettings)
        console.log('Consumer connected')
        const channel = await conn.createChannel()
        const res = await channel.assertQueue('tests')
        channel.consume('tests', message => {
            let content = JSON.parse(message.content.toString())
            console.log("Consume message : ", content)
        }, { noAck: true })
    } catch (error) {
        console.error(error)
    }
}

setTimeout(() => connect(), 10000)

// const QUEUE_NAME = 'square';

// let result = 0

// app.use(cors({
//     exposedHeaders: ['Content-Length', 'Content-Type', 'Authorization', 'RefreshToken', 'Token'],
// }))

// // Swagger
// // var swaggerUi = require('swagger-ui-express')
// // swaggerDocument = require('./swagger.json')

// // app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
// //---------------------

// app.use(bodyParser.urlencoded({ extended: false }))

// // parse application/json
// app.use(bodyParser.json())

// app.get('/getResult', function (req, res) {
//     res.send(result)
// })

// app.listen(5000)



// setTimeout(() => {
//     amqp.connect('amqp://rabbitmq', function (err, conn) {
//         if (err) throw err
//         conn.createChannel((err, channel) => {
//             if (err) throw err
//             channel.consume(QUEUE_NAME, (m) => {
//                 const number = parseInt(m.content.toString())
//                 result = number * number
//                 console.log("square : ", square)
//                 channel.ack(m)
//             })
//         });

//     })
// }, 20000)