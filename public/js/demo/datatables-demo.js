function initDataTables() {
  if ($('#dataTable').length) {
    if ($.fn.DataTable.isDataTable('#dataTable')) {
      $('#dataTable').DataTable().destroy();
    }
    $('#dataTable').DataTable({
      pageLength: 3,
      lengthMenu: [3, 5, 10, 25, 50, 100],
    });
  }
}

$(document).ready(function () {
  initDataTables();
});
