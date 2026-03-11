const { Sequelize, DataTypes } =
require("sequelize");
require('dotenv').config();

const db = new Sequelize({ //creates sequelize database connection
    dialect: 'sqlite',
    storage: `database/${process.env.DB_NAME}` || 'database/music_library.db', //defines where its stored
    logging: console.log
});

const Track = db.define("Track", { //creates model for music tracks
    trackId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    songTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    artistName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    albumName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    releaseYear: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    tableName: "tracks",
    timestamps:false
});

async function setupDatabase() { //creates database
    try {
        await db.authenticate();
        console.log('Connection to database established successfully.');

        await db.sync({ force: true }) //syncs model with database
        console.log('Database file created at:', `database/${process.env.DB_NAME}`);

        await db.close();
    } catch (error) { //catches any remaining errors
        console.error('Unable to connect to database:', error);
    }
}

if (require.main === module) {
    setupDatabase();
}

module.exports = { db, Track };
