// Call the dataTables jQuery plugin
$(document).ready(function () {
  $('#dataTable').DataTable(
    {
      lengthMenu: [3, 5, 10, 25, 50, 100],
      pageLength: 3,
    }
  );
});