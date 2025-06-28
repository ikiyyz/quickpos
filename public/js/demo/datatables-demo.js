$(document).ready(function () {
  $('#dataTable').DataTable({
    pageLength: 3,
    lengthMenu: [3, 5, 10, 25, 50, 100],
  });
});
