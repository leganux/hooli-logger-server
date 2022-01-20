const express = require('express')


const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config')
const db = require('./db')
const moment = require('moment')
const {Op} = require("sequelize");
const path = require("path");

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


const port = config.listen_port;

// Where we will keep books
let books = [];

app.use(cors());

app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', './views');
app.set('view engine', 'pug');
let rt = {}

io.on('connection', function (socket) {
    console.log('A user connected');
    rt = socket
    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
});

// Configuring body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    try {
        res.status(200).json({
            status: 200,
            message: 'Welcome to Hooli-logger-server. Is Alive!',
            info: 'Install the client log data & visit /web to see logger in action',
            copy: "Developed by Angel Erick Cruz Olivera - (C) leganux.net 2007-2022",
            data: {}
        })
    } catch (e) {

    }
});

app.get('/web', (req, res) => {
    try {
        res.status(200).render('log')
    } catch (e) {

    }
});

app.post('/log', async (req, res) => {
    try {
        let body = req.body

        if (!body.type) {
            res.status(304).json({
                status: 304,
                message: 'Type missing',
                data: {}
            })
        }

        if (!body.app) {
            body.app = 'hooli'
        }
        if (!body.source) {
            body.source = ''
        }
        if (!body.content && typeof (body.content) != 'String') {
            res.status(304).json({
                status: 304,
                message: 'Content missing or invalid',
                data: {}
            })
        }

        body.date = moment().format()

        body.source = body.source.trim()
        body.app = body.app.trim()


        let saveLog = await db.logModel.create(body)


        res.status(200).json({
            status: 200,
            message: 'ok',
            data: saveLog
        })

        rt.emit('logger', JSON.stringify(saveLog))

        let src = await db.sourceModel.findOne({where: {source: body.source}})
        if (!src) {
            await db.sourceModel.create({source: body.source})
        }
        let app_ = await db.appModel.findOne({where: {app: body.app}})
        if (!app_) {
            await db.appModel.create({app: body.app})
        }


    } catch (e) {
        res.status(500).json({
            status: 500,
            message: 'error in server',
            error: e,
            data: {}
        })
    }
});
app.get('/log', async (req, res) => {
    try {
        let query = req.query


        let options = {limit: query.limit || 100}

        if (query.app) {
            if (!options.where) {
                options.where = {}
            }
            options.where.app = {
                [Op.in]: query.app.split(',')
            }
        }
        if (query.source) {
            if (!options.where) {
                options.where = {}
            }
            options.where.source = {
                [Op.in]: query.source.split(',')
            }
        }
        if (query.type) {
            if (!options.where) {
                options.where = {}
            }
            options.where.type = {
                [Op.in]: query.type.split(',')
            }
        }

        if (query.like) {
            if (!options.where) {
                options.where = {}
            }
            options.where.content = {
                [Op.substring]: query.like
            }
        }

        options.order = [['date', "ASC"]]

        if (query.order) {
            options.order = [['date', query.order]]
        }

        if (query.time && query.time.includes(',') && query.time.split(',').length >= 2) {
            let start = moment(query.time.split(',')[0]).format()
            let end = moment(query.time.split(',')[1]).format()

            if (!options.where) {
                options.where = {}
            }
            options.where.date = {
                [Op.between]: [start, end]
            }
        }

        if (query?.contexto && query.contexto.includes(',') && query.contexto.split(',').length >= 2) {
            let start = Number(query.contexto.split(',')[0])
            let end = Number(query.contexto.split(',')[1])

            if (!options.where) {
                options.where = {}
            }
            options.where._id = {
                [Op.between]: [start, end]
            }
        }

        let find = await db.logModel.findAll(options)

        res.status(200).json({
            status: 200,
            message: 'ok',
            data: find
        })
    } catch
        (e) {
        console.error(e)
        res.status(500).json({
            status: 500,
            message: 'error in server',
            error: e,
            data: {}
        })
    }

});
app.get('/catalogs', async (req, res) => {
    try {


        let source = await db.sourceModel.findAll()
        let app_ = await db.appModel.findAll()

        res.status(200).json({
            status: 200,
            message: 'ok',
            data: {source, app: app_}
        })
    } catch
        (e) {
        console.error(e)
        res.status(500).json({
            status: 500,
            message: 'error in server',
            error: e,
            data: {}
        })
    }

});


http.listen(port, () => console.log(`Hooli-log-server  listening on port ${port}!`));


