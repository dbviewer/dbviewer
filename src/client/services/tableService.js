
class tableService {
  constructor() {
    this.activeTables = [];
    this.tableData = {};
    this.currentTable = '';
  }
  setData(jsonData) {
    this.rawdata = jsonData
  }
  activateTable(tablename) {
    this.activeTables.push(tablename)
  }
  addTableData(table, data) {
    this.tableData[table] = data;
  }
  getData(table) {
    return this.tableData[table];
  }

}

angular.module('Dbview.tableService', []).service('tableService', [tableService]);