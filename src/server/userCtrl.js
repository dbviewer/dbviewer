const dbCtrl = require('./dbCtrl');

const userCtrl = {};

userCtrl.sendTableList = (req, res) => {
  dbCtrl.showTables(req.body)
  .then( (result) => {
    res.json(result);
  })
  .catch( (err) => {
    console.log(err);
    res.end('error')
  });
}

userCtrl.sendTable = (req, res) => {
  dbCtrl.getTable(req.body)
  .then( (result) => {
    res.json(result);
  })
  .catch( (err) => {
    console.log(err);
    res.end('error')
  });
}

userCtrl.createTable = (req, res) => {
  dbCtrl.createTable(req.body)
  .then( (result) => {
    console.log(result);
    res.json(result);
  })
  .catch( (err) => {
    console.log(err);
    res.end('error')
  });
}

userCtrl.insertEntry = (req, res) => {
  dbCtrl.insertRow(req.body)
  .then( (result) => {
    res.json(result);
  })
  .catch( (err) => {
    console.log(err);
    res.end('error')
  });
}

userCtrl.updateEntry = (req, res) => {
  dbCtrl.updateRow(req.body)
  .then( (result) => {
    console.log(result);
    res.json(result);
  })
  .catch( (err) => {
    console.log(err);
    res.end('error')
  });
}

userCtrl.deleteEntry = (req, res) => {
  dbCtrl.deleteRow(req.body)
  .then( (result) => {
    res.json(result);
  })
  .catch( (err) => {
    console.log(err);
    res.end('error')
  });
}

userCtrl.rawQuery = (req, res) => {
  dbCtrl.commandLine(req.body)
  .then( (result) => {
    console.log(result);
    res.json(result);
  })
  .catch( (err) => {
    console.log(err);
    res.end('error')
  });
}
userCtrl.dropTable = (req, res) => {
  dbCtrl.dropTable(req.body)
  .then( (result) => {
    res.json(result);
  })
  .catch( (err) => {
    console.log(err);
    res.end('error')
  });
}
userCtrl.count = (req, res) => {
  dbCtrl.count(req.body)
  .then(result => {
    console.log('user controller', result);
    res.json(result);
  })
  .catch(err => {
    console.log(err)
    res.end('error')
  })
}
userCtrl.sum = (req, res) => {
  dbCtrl.sum(req.body)
  .then(result => {
    res.json(result);
  })
  .catch(err => {
    res.end('error')
  })
}
<<<<<<< HEAD
userCtrl.searchTable = (req, res) => {
  dbCtrl.searchTable(req.body)
  .then( (result) => {
    console.log(result);
    res.json(result);
  }).catch( (err) => {
    console.log(err);
    res.end('error')
  })
}

=======
>>>>>>> 8f110d53e491ebffb7fd27ff91c8ad4904c180be

module.exports = userCtrl;
