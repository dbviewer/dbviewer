const Sequelize = require('sequelize');

const dbCtrl = {

  showTables: (obj) => {
    // Object being passed in from userCtrl has a `creds` object that has all login credentials
    const sequelize = new Sequelize(obj.creds.database, obj.creds.user, obj.creds.password, {
      host: obj.creds.host,
      dialect: obj.creds.dialect,
      dialectOptions: { ssl: true }
    });
    // Obtaining table names as strings and returning them in an array. Special tables in postgres not meant to be shown to user are excluded.
    return sequelize.query(`SELECT table_name FROM information_schema.tables WHERE table_schema NOT IN('pg_catalog', 'information_schema')`, { type: sequelize.QueryTypes.SELECT })
      // Result is a large array full of smaller array, which each has a table name. Formatting to a simpler array before returning it to userCtrl.
      .then((results) => { return results.map(result => result[0]) });
  },

  getTable: (obj) => {
    // Object being passed in from userCtrl has a `creds` object that has all login credentials.
    const sequelize = new Sequelize(obj.creds.database, obj.creds.user, obj.creds.password, {
      host: obj.creds.host,
      dialect: obj.creds.dialect,
      dialectOptions: { ssl: true }
    });
    // Returns table requested. Table name is requested using the `table` property of the object.
    return sequelize.query(`SELECT * FROM ${obj.table}`, { type: sequelize.QueryTypes.SELECT });
  },

  insertRow: (obj) => {
    // Object being passed in from userCtrl has a `creds` object that has all login credentials.
    //Need to find out if MySQL needs CreatedAt and UpdatedAt fields
    const sequelize = new Sequelize(obj.creds.database, obj.creds.user, obj.creds.password, {
      host: obj.creds.host,
      dialect: obj.creds.dialect,
      dialectOptions: { ssl: true }
    });
    let columnsToAdd = ``;
    let valuesToAdd = ``;
    for (let n in obj.valuesToInsert) {
      columnsToAdd += ` ${n},`;
      valuesToAdd += ` '${obj.valuesToInsert[n]}',`;
    }
    columnsToAdd = columnsToAdd.slice(1, -1);
    columnsToAdd = `(${columnsToAdd}, "createdAt", "updatedAt")`;
    valuesToAdd = valuesToAdd.slice(1, -1);
    valuesToAdd = `(${valuesToAdd}, NOW(), NOW())`;

    // Inserting values (from the `valuesToInsert` property) and returning table.
    return sequelize.query(`INSERT INTO ${obj.table} ${columnsToAdd} VALUES ${valuesToAdd}`, { type: sequelize.QueryTypes.INSERT })
      .then((results) => { return sequelize.query(`SELECT * FROM ${obj.table}`, { type: sequelize.QueryTypes.SELECT }) });
  },

  deleteRow: (obj) => {
    // Object being passed in from userCtrl has a `creds` object that has all login credentials.
    const sequelize = new Sequelize(obj.creds.database, obj.creds.user, obj.creds.password, {
      host: obj.creds.host,
      dialect: obj.creds.dialect,
      dialectOptions: { ssl: true }
    });

    return sequelize.query(`DELETE FROM ${obj.table} WHERE ${obj.where}`, { type: sequelize.QueryTypes.DELETE })
      .then((results) => { return sequelize.query(`SELECT * FROM ${obj.table}`, { type: sequelize.QueryTypes.SELECT }) });
  },

  updateRow: (obj) => {
    // Object being passed in from userCtrl has a `creds` object that has all login credentials.
    const sequelize = new Sequelize(obj.creds.database, obj.creds.user, obj.creds.password, {
      host: obj.creds.host,
      dialect: obj.creds.dialect,
      dialectOptions: { ssl: true }
    });

    // Building string of columns tp update.
    let columnsToUpdate = '';
    for (let n in obj.valuesToInsert) columnsToUpdate += ` ${n}=${obj.valuesToInsert[n]},`;
    columnsToUpdate = columnsToUpdate.slice(1, -1);

    // Updating row and returning table.
    return sequelize.query(`UPDATE ${obj.table} SET ${columnsToUpdate} WHERE ${obj.where}`, { type: sequelize.QueryTypes.UPDATE })
      .then((results) => { return sequelize.query(`SELECT * FROM ${obj.table}`, { type: sequelize.QueryTypes.SELECT }) });
  },

  createTable: (obj) => {
    // Object being passed in from userCtrl has a `creds` object that has all login credentials.
    const sequelize = new Sequelize(obj.creds.database, obj.creds.user, obj.creds.password, {
      host: obj.creds.host,
      dialect: obj.creds.dialect,
      dialectOptions: { ssl: true }
    });

    // Building string of columns and column types.
    let columnsToAdd = ``;
    for (let n in obj.valuesToInsert) columnsToAdd += ` "${n}" ${obj.valuesToInsert[n]},`;
    columnsToAdd += ` "createdAt" TIME, "updatedAt" TIME`;
    columnsToAdd = `(${columnsToAdd.slice(1)})`;

    // Creating table and returning it.
    return sequelize.query(`CREATE TABLE IF NOT EXISTS ${obj.where} ${columnsToAdd}`)
      .then((results) => { return sequelize.query(`SELECT * FROM ${obj.where}`, { type: sequelize.QueryTypes.SELECT }) });
  },

  dropTable: (obj) => {
    // Object being passed in from userCtrl has a `creds` object that has all login credentials.
    const sequelize = new Sequelize(obj.creds.database, obj.creds.user, obj.creds.password, {
      host: obj.creds.host,
      dialect: obj.creds.dialect,
      dialectOptions: { ssl: true }
    });
    console.log('workign');
    console.log('objwhere', obj);
    // Deleting table, then returning list of table names.
    return sequelize.query(`DROP TABLE ${obj.where}`)
      .then((results) => {
        return sequelize.query(`SELECT table_name FROM information_schema.tables WHERE table_schema NOT IN('pg_catalog', 'information_schema')`, { type: sequelize.QueryTypes.SELECT })
          .then((results) => { return results.map(result => result[0]) });
      });
  },

  commandLine: (obj) => {
    // Object being passed in from userCtrl has a `creds` object that has all login credentials
    const sequelize = new Sequelize(obj.creds.database, obj.creds.user, obj.creds.password, {
      host: obj.creds.host,
      dialect: obj.creds.dialect,
      dialectOptions: { ssl: true }
    });
    // Executing raw command
    return sequelize.query(obj.where)
      // Return results
      .then((results) => {
        console.log(results);
        return results[0]
      });
  },

  searchTable: (obj) => {
    const sequelize = new Sequelize(obj.creds.database, obj.creds.user, obj.creds.password, {
      host: obj.creds.host,
      dialect: obj.creds.dialect,
      dialectOptions: { ssl: true }
    });
    console.log(obj.valuesToInsert);
    let columns = ``;
    for (let n in obj.valuesToInsert) {
      columns += `${obj.valuesToInsert[n]},`
      if (obj.valuesToInsert[n].toLowerCase() === 'all') {
        columns = `*,`;
        break;
      }
    };

    columns = columns.slice(0, columns.length - 1);
    let conditional = `SELECT ${columns} FROM ${obj.table}`;
    if (obj.where) conditional += ` WHERE ${obj.where}`;
    return sequelize.query(conditional).then((results) => { return results[0] });
  },

  count: (obj) => {

    // Object being passed in from userCtrl has a `creds` object that has all login credentials
    const sequelize = new Sequelize(obj.creds.database, obj.creds.user, obj.creds.password, {
      host: obj.creds.host,
      dialect: obj.creds.dialect,
      dialectOptions: { ssl: true }
    });
    // Executing raw command
    console.log(obj.where)
    var count = obj.where || '*';
    if (count !== '*') {
      count = 'DISTINCT ' + count;
    }
    return sequelize.query(`SELECT COUNT (${count}) FROM ${obj.table}`, { type: sequelize.QueryTypes.SELECT })
      .then(results => {
        return results;
      })

  },
  sum: (obj) => {
    const sequelize = new Sequelize(obj.creds.database, obj.creds.user, obj.creds.password, {
      host: obj.creds.host,
      dialect: obj.creds.dialect,
      dialectOptions: { ssl: true }
    });
    var sum = obj.where || '*';
    return sequelize.query(`SELECT SUM (${sum}::integer) FROM ${obj.table}`, { type: sequelize.QueryTypes.SELECT }).
      then(results => {
        return results;
      })

    },
    average: (obj) => {
      const sequelize = new Sequelize(obj.creds.database, obj.creds.user, obj.creds.password, {
          host: obj.creds.host,
          dialect: obj.creds.dialect,
          dialectOptions: { ssl: true }
      });
      var avg = obj.where || '*';
      return sequelize.query(`SELECT AVG(${avg}::integer) FROM ${obj.table}` , { type: sequelize.QueryTypes.SELECT })
      .then(results => {
        return results;
      })
    },

  ///////////////////////////////////
  // New Join Table Middleware
  getJoinTable: (obj) => {
    const sequelize = new Sequelize(obj.creds.database, obj.creds.user, obj.creds.password, {
      host: obj.creds.host,
      dialect: obj.creds.dialect,
      dialectOptions: { ssl: true }
    });

    return sequelize.query(`SELECT * FROM ${obj.table1} JOIN ${obj.table2} ON ${obj.table1}.id=${obj.table2}.id`, { type: sequelize.QueryTypes.SELECT });
  },
  ///////////////////////////////////

  ///////////////////////////////////
  // New Request Field Middleware
  getTableFields: (obj) => {
    const sequelize = new Sequelize(obj.creds.database, obj.creds.user, obj.creds.password, {
      host: obj.creds.host,
      dialect: obj.creds.dialect,
      dialectOptions: { ssl: true }
    });

    return sequelize.query(`SELECT column_name FROM information_schema.columns WHERE table_name='${obj.table}'`, { type: sequelize.QueryTypes.SELECT });

  },

  renderChart: (obj) => {
    let chartAxis = [];
    let chartType = '';
    for(let key in obj.valuesToInsert) {
      chartType = obj.valuesToInsert[key];
      chartAxis.push(key.toLowerCase())
    }
    chartAxis = chartAxis.map( ele => {return [ele]});
    obj.rowData.forEach(row => {
      for(let i = 0; i < chartAxis.length; i++){
      chartAxis[i].push(row[chartAxis[i][0]]);
      }
    }); //chartaxis is now an array of arrays, which are columns to be used in chart data
    chartAxis.unshift(chartType || 'bar');
    chartAxis.unshift('chart');
    return chartAxis;
  },

  divide: (obj) => {

    const sequelize = new Sequelize(obj.creds.database, obj.creds.user, obj.creds.password, {
        host: obj.creds.host,
        dialect: obj.creds.dialect,
        dialectOptions: { ssl: true }
    });
    var divide = obj.where[0];
    var by = obj.where[1];
    return sequelize.query(`SELECT ${divide}::integer / ${by}::integer FROM ${obj.table}`, { type: sequelize.QueryTypes.SELECT })
    .then(results => {
      return results;
    })

  },
  log: (obj) => {
    const sequelize = new Sequelize(obj.creds.database, obj.creds.user, obj.creds.password, {
        host: obj.creds.host,
        dialect: obj.creds.dialect,
        dialectOptions: { ssl: true }
    });
    return sequelize.query(`SELECT LOG(${obj.where}::integer) FROM ${obj.table}`, { type: sequelize.QueryTypes.SELECT })
    .then(results => {
      return results;
    })
  },
  multiply: (obj) => {
    const sequelize = new Sequelize(obj.creds.database, obj.creds.user, obj.creds.password, {
        host: obj.creds.host,
        dialect: obj.creds.dialect,
        dialectOptions: { ssl: true }
    });
    var multiply = obj.where[0];
    var by = obj.where[1];
    return sequelize.query(`SELECT ${multiply}::integer * ${by}::integer FROM ${obj.table}`, { type: sequelize.QueryTypes.SELECT })
    .then(results => {
      return results;
    })
  }

}

module.exports = dbCtrl;

// For Reference, loginObj should look like this:
//
// const loginObj = {
//     host: "ec2-54-243-212-72.compute-1.amazonaws.com",
//     database: "d7ctrh5hg6aadj",
//     user: "dxrwecviorvrto",
//     port: 5432,
//     password: "BDyJHAElIeyxjSLNxI1NBYu3Z4",
//     dialect: 'mysql'|'sqlite'|'postgres'|'mssql'
// }
