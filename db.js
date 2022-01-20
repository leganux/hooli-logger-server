const {Sequelize, DataTypes} = require('sequelize');
const path = require('path');
const config = require('./config')

let sequelize = {}

if (config.db_flavor == 'sqlite') {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, config.db_filename)
    });
} else {
    sequelize = new Sequelize(config.db_name, config.db_username, config.db_password, {
        host: config.db_host + ':' + config.db_port,
        dialect: config.db_flavor
    });
}


let init = async function () {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

init()

const log = sequelize.define('log', {
    // Model attributes are defined here
    app: {
        type: DataTypes.STRING,
        allowNull: false
    },
    source: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING
    },
    date: {
        type: DataTypes.DATE
    },
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
}, {});
const app = sequelize.define('app', {
    // Model attributes are defined here
    app: {
        type: DataTypes.STRING,
        allowNull: false
    },
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
}, {});
const source = sequelize.define('source', {
    // Model attributes are defined here
    source: {
        type: DataTypes.STRING,
        allowNull: false
    },
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
}, {});

log.sync({alter: true})
app.sync({alter: true})
source.sync({alter: true})


module.exports = {
    sequelize,
    logModel: log,
    appModel: app,
    sourceModel: source,
}

