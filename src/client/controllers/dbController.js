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
  $scope.requestTableJoin = function (table1, table2, key1, key2) {
    $http({
      method: 'POST',
      url: '/requestJoinTable',
      headers: {
        'Content-Type': 'application/json'
      },
      data: { creds: dbService.creds, table1, table2, key1, key2 }
    })
      .then((response) => {
        $scope.table1 = '';
        $scope.table2 = '';
        $scope.table1fields = [];
        $scope.table2fields = [];
        $scope.table1key = '';
        $scope.table2key = '';
        activateTable($scope, table1 + table2, tableService);
        tableService.addTableData(table1 + table2, response.data)
      })
  }
  ///////////////////////////////////

  $scope.setJoinId = (key, pos) => {
    if (pos === 1) $scope.table1key = key;
    if (pos === 2) $scope.table2key = key;
  }

  ///////////////////////////////////
  // post request for table field names
  $scope.requestTableFields = function (table, pos) {
    if (pos === 1) $scope.table1fields = [];
    if (pos === 2) $scope.table2fields = [];

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
          if (pos === 1) {
            $scope.table1fields.push(obj['column_name']);
          }
          if (pos === 2) {
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







