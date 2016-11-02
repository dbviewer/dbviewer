angular
  .module('Dbview.TableController', ['ui.router'])
  .controller('TableController', ['$scope', 'tableService', '$stateParams', 'dbService', '$http', '$state', '$timeout', tableController])

function tableController($scope, tableService, $stateParams, dbService, $http, $state, $timeout) {
  //scope.name is the name of the table currently on display
  $scope.name = tableService.currentTable;
  $scope.displayName = tableService.currentTable;
  $scope.dataToDisplay = tableService.getData($scope.name);
  $scope.secondquery = '';

  // reference the data that will be rendered to a table format
  $scope.gridData = {
    data: $scope.dataToDisplay,
    enableFiltering: true,
  }

  $scope.queryOptions = ['Search Query', 'SQL Query', 'Create Table', 'Insert Rows', 'Update Rows',
  'Delete Rows', 'Drop Table', 'Count', 'Sum', 'Average', 'Divide', 'Log', 'Multiply'];
  $scope.dataTypes = ['Integer', 'Varchar', 'Serial', 'Date', 'Time'];
  $scope.rowsToAdd = {};
  $scope.saveEntry = (column, value) => {
    console.log($scope, this.entryValue);
    $scope.rowsToAdd[column] = value;
    $scope.column = null;
    $scope.entryValue = '';
  }
  $scope.removeEntry = (column) => delete $scope.rowsToAdd[column];
  // $scope.query = '';
  $scope.queryData = {};

  // execute a raw query and update displayed table
  $scope.executeQuery = function (query, secondquery) {
    console.log(query)
    if(secondquery !== '') query = [query, secondquery];
    let route;
    let tableName = $scope.name;
    switch($scope.queryType) {
      case 'Create Table': route = '/createTable'; break;
      case 'Insert Rows': route = '/insert'; break;
      case 'Update Rows': route = '/update'; break;
      case 'Delete Rows': route = '/delete'; break;
      case 'Drop Table': route = '/dropTable'; break;
      case 'SQL Query': route = '/query'; break;
      case 'Search Query': route = '/search'; break;
      case 'Text Query': route = '/query'; break;
      case 'Count': route = '/count'; break;
      case 'Sum': route = '/sum'; break;
      case 'Average': route = '/average'; break;
      case 'Divide' : route = '/divide'; break;
      case 'Log' : route = '/log'; break;
      case 'Multiply': route = '/multiply'; break; 
      default: return;
    }
    console.log($scope.tableName);
  //  console.log('query:', query, 'secondquery:', secondquery)
    $http({
      method: 'POST',
      url: route,
      headers: {
        'Content-Type': 'application/json'
      },
      data: { creds: dbService.creds, where: query, valuesToInsert: $scope.rowsToAdd, table: tableName }
    })
      .then((response) => {
        // console.log('this is response.data ', response.data);
        // console.log('query: ', query);
        const columns = Object.keys(response.data[0]).map( (colname) => {
          return { field: colname };
        });
      //  console.log('this is columns after map', columns)
        // save the data in table service and update grid data
        tableService.addTableData($scope.name, response.data)
        $scope.dataToDisplay  = tableService.getData($scope.name);
        console.log('this is $scope.dataToDisplay: ', $scope.dataToDisplay);
        $scope.gridData = {
          columnDefs: columns,
          data: $scope.dataToDisplay,
          enableFiltering: true,
        }
        $scope.displayName = 'Query Result';
      })
  };
}
