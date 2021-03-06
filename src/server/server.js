const express = require('express');
const app = express();
const path = require('path');
const userCtrl = require('./userCtrl.js');

//extra middleware
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}), bodyParser.json());
app.use(express.static(path.join(__dirname, '../../node_modules/')));
app.use(express.static(path.join(__dirname, '../client/')));

app.post('/requestDB', userCtrl.sendTableList);
app.post('/requestTable', userCtrl.sendTable);
app.post('/createTable', userCtrl.createTable);
app.post('/insert', userCtrl.insertEntry);
app.post('/update', userCtrl.updateEntry);
app.post('/delete', userCtrl.deleteEntry);
app.post('/query', userCtrl.rawQuery);
app.post('/dropTable', userCtrl.dropTable);
app.post('/search', userCtrl.searchTable);
app.post('/count', userCtrl.count);
app.post('/sum', userCtrl.sum);
app.post('/average', userCtrl.average);
app.post('/chart', userCtrl.renderChart);
app.post('/divide', userCtrl.divide);
app.post('/log', userCtrl.log);
app.post('/multiply', userCtrl.multiply);
app.post('/requestJoinTable', userCtrl.sendJoinTable);
app.post('/requestTableFields', userCtrl.sendTableFields);
app.post('/newUpload', userCtrl.sendUploadTable, userCtrl.insertUploadEntries);

app.listen(3000, ()=> console.log('listening on port 3000'));
