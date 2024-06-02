import { Sequelize } from "sequelize"
import colors from "colors";

const sequelize = new Sequelize(
  'sorchin', // Database name 
  'root',    // Username
  '123456',  // Password
  {
    // host: '192.168.0.223',
    host: 'localhost',
    dialect: 'mysql',               // Dialect
    dialectModule: require('mysql2'),
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false   // Note: You should set this to true in production
      }
    },
    pool: {
      min: 5,                       // Minimum number of connections in pool
      max: 10,                      // Maximum number of connections in pool
      acquire: 30000,               // The maximum time, in milliseconds, that pool will try to get connection before throwing error
      idle: 10000                   // The maximum time, in milliseconds, that a connection can be idle before being released
    }
  }
);


async function connectDB() {
    await sequelize.authenticate().then(() => {
      console.log(colors.green('Connection has been established successfully.'));
      return true
    }).catch((error: any) => {
      console.log(colors.red(`Unable to connect to the database: ${error}`));
      return false
    });
}


export {
  connectDB,
  sequelize
}














    
    
// const sqlite3 = require('sqlite3').verbose();
    // try {
    //   await sequelize.authenticate();
    //     // sequelize.sync();
    //     // console.log(sequelize)
    //     // console.log(sequelize.connectionManager.connections.default)
    //     console.log(Object.keys(sequelize.connectionManager.connections))
    //     // console.log('Connection has been established successfully.');
    //     next()
    //   } catch (err) {
    //     sequelize.sync();
    //     next()
    // //     console.error('Unable to connect to the database:', err);
    // }

    
    // new sqlite3.Database('./SQLite/database.sqlite', (err: any) => {
    //     if (err) {
    //         console.error(err.message);
    //         next(err)
    //     } else {
    //         console.log('Connected to the SQLite database.');
    //         next()
    //     }
    // });

// export default {sequelize};
