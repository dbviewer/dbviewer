angular
  .module('Dbview.DbController', ['ui.router'])
  .controller('DbController', ['$scope', '$http', '$location', 'dbService', 'tableService', '$state', '$timeout', dbController])

function dbController($scope, $http, $location, dbService, tableService, $state, $timeout) {
  $scope.tablenames = dbService.tables;
  $scope.tableData = {};
  $scope.onlineTables = tableService.activeTables;
  // for JOINS
  $scope.table1 = null;
  $scope.table2 = null;
  $scope.table1fields = [];
  $scope.table2fields = [];
  $scope.table1key = null;
  $scope.table2key = null;


  ///////////////////////////////////
  // make post request to download JOINED tables
  $scope.requestTableJoin = function (table1, table2, table1key, table2key) {
    // console.log('----------------------');
    // console.log('table1 : ' + table1);
    // console.log('table2 : ' + table2);
    // console.log('table1key : ' + table1key);
    // console.log('table2key : ' + table2key);
    // console.log('----------------------');

    $http({
      method: 'POST',
      url: '/requestJoinTable',
      headers: {
        'Content-Type': 'application/json'
      },
      data: { creds: dbService.creds, table1, table2, key1, key2 }
    })
      .then((response) => {
        activateTable($scope, table1 + table2, tableService);
        tableService.addTableData(table1 + table2, response.data)
      })
  }
  ///////////////////////////////////

  $scope.test = function () {
    console.log('key1 : ' + $scope.table1key);
    console.log('t1fields : ' + $scope.table1fields);
    console.log('key2 : ' + $scope.table2key);
    console.log('t2fields : ' + $scope.table2fields);
  }

  ///////////////////////////////////
  // post request for table field names
  $scope.requestTableFields = function (table, which) {
    if(which===1) $scope.table1fields = [];
    if(which===2) $scope.table2fields = [];

    $http({
      method: 'POST',
      url: '/requestTableFields',
      headers: {
        'Content-Type': 'application/json'
      },
      data: { creds: dbService.creds, table }
    })
      .then((response) => {
        response.data.forEach(obj => {
          if (which === 1) {
            $scope.table1fields.push(obj['column_name']);
          }
          if (which === 2) {
            $scope.table2fields.push(obj['column_name']);
          }
        })
      })
  }
  ///////////////////////////////////

  // make post request to download a specific table
  $scope.requestTable = function (table) {
    console.log(table);
    $http({
      method: 'POST',
      url: '/requestTable',
      headers: {
        'Content-Type': 'application/json'
      },
      data: { creds: dbService.creds, table }
    })
      .then((response) => {

        // add this table to the nav bar
        activateTable($scope, table, tableService);

        // save the data in table service
        tableService.addTableData(table, response.data);
      });
  }
  // view a specific table (actual tablename is passed via $stateParams)
  $scope.viewTable = function (table) {
    tableService.currentTable = table;
  }
  // add table to nav bar if not already there
  function activateTable($scope, table, tableService) {
    if (!$scope.onlineTables.includes(table)) {
      tableService.activateTable(table);
      $scope.onlineTables = tableService.activeTables
    }
  }
  // add table data to table service
  function addTableData($scope, table, data) {
    console.log(data);
    if ($scope.tableData[table] === undefined) {
      $scope.tableData[table] = data;
    }
  }
}







