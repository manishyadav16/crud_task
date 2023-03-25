(function () {
    loaddata();
    getPagination();
  })();
  
  let updateId = null;
  let pgno = 1;
  
  function loaddata() {
    $.ajax({
      url: "http://localhost:5000/get",
      type: "GET",
      success: function (data) {
        console.log(data)
        populateData(data);
      },
      error: function () {},
    });
  }
  
  function getPagination() {
    $.ajax({
      url: "http://localhost:5000/pagination",
      type: "GET",
      success: function (data) {
        if (data.count > 8) {
          document.getElementById("pg_div").style.display = "block";
          const val = (data.count / 8).toString();
          const max = parseInt(val.split(".")[0]) + 1;
          if (val.includes(".")) {
            document.getElementById("last-pg").innerHTML = max;
          } else {
            document.getElementById("last-pg").innerHTML = val;
          }
        } else {
          document.getElementById("pg_div").style.display = "none";
        }
      },
      error: function () {},
    });
  }
  
  function loadEndPage(num) {
    $.ajax({
      url: `http://localhost:5000/endpage`,
      type: "GET",
      success: function (data) {
        populateData(data);
        pgno = parseInt(num);
      },
      error: function () {},
    });
  }
  
  function goLeft() {
    pgno -= 1;
    const id = $("td:first").text();
    $.ajax({
      url: `http://localhost:5000/get/${id}/left`,
      type: "GET",
      success: function (data) {
        populateData(data);
      },
      error: function () {},
    });
  }
  
  function goRight() {
    pgno += 1;
    const table = $("table");
    const lastRow = table.find("tr:last");
    const id = parseInt(lastRow.find("td:first").text());
    $.ajax({
      url: `http://localhost:5000/get/${id}/right`,
      type: "GET",
      success: function (data) {
        populateData(data);
      },
      error: function () {},
    });
  }
  
  function addCategory() {
    const name = document.getElementById("cname").value;
    if (name == "" || name.length <= 2) {
      $.growl.error({ message: "Enter Valid Category Name" });
    } else {
      $.ajax({
        url: "http://localhost:5000/add",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
          name: name,
        }),
        success: function () {
          $.growl.notice({ message: "Category Added Successfully" });
          document.getElementById("cname").value = "";
          loaddata();
          getPagination();
        },
        error: function () {
          $.growl.error({ message: "Failed To Add Category" });
        },
      });
    }
  }
  
  function updateCategory() {
    const name = document.getElementById("cname").value;
    if (name == "" || name.length <= 2) {
      $.growl.error({ message: "Enter Valid Category Name" });
    } else {
      $.ajax({
        url: "http://localhost:5000/update",
        type: "PUT",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
          id: updateId,
          name: document.getElementById("cname").value,
        }),
        success: function () {
          $.growl.notice({ message: "Category Updated Successfully" });
          document.getElementById("cname").value = "";
          hardClose();
        },
        error: function () {
          $.growl.error({ message: "Failed To Update Category" });
        },
      });
    }
  }
  
  function handleUpdate(id) {
    updateId = id;
    if (document.getElementById("addCategory").className == "col-sm-3 my-4") {
      hardClose();
    } else {
      handleAddEditForm("edit");
    }
  }
  
  function handleDelete(id) {
    if (confirm("Are you sure to delete")) {
      $.ajax({
        url: `http://localhost:5000/delete/${id}`,
        type: "DELETE",
        success: function () {
          $.growl.notice({ message: "Category Deleted Successfully" });
          location.reload();
        },
        error: function () {
          $.growl.error({ message: "Failed To Deleted Category" });
        },
      });
    }
  }
  
  function populateData(data) {
    row = "";
    for (val of data) {
      row += "<tr>";
      row += "<td>" + val.id + "</td>";
      row += "<td>" + val.name + "</td>";
      row += "<td>" + new Date(val.inserted_on).toLocaleString() + "</td>";
      row +=
        "<td>" +
        (val.updated_on == null
          ? null
          : new Date(val.updated_on).toLocaleString()) +
        "</td>";
      row +=
        '<td><button type="button" class="btn btn-outline-secondary" onclick="handleUpdate(' +
        val["id"] +
        ')">Edit</button>';
      row +=
        '<button type="button" class="btn btn-outline-danger" onclick="handleDelete(' +
        val["id"] +
        ')">Del</button></td>';
      row += "</tr>";
      document.getElementById("categoryTable").innerHTML = row;
    }
  }
  
  function handleAddEditForm(flag) {
    if (flag == "add") {
      if (
        document.getElementById("open-add-c-from").className == "btn btn-success"
      ) {
        document.getElementById("open-add-c-from").innerHTML = "Cancel";
        document.getElementById("open-add-c-from").className = "btn btn-danger";
        document.getElementById("category-table").className = "col-sm-9";
        document.getElementById("addCategory").className = "col-sm-3 my-4";
        document.getElementById("formControl").innerHTML = "ADD";
      } else {
        document.getElementById("open-add-c-from").innerHTML = "Add Category";
        document.getElementById("open-add-c-from").className = "btn btn-success";
        document.getElementById("category-table").className = "row";
        document.getElementById("addCategory").className = "col-sm-3 my-4 hidden";
        loaddata();
      }
    } else {
      document.getElementById("open-add-c-from").innerHTML = "Cancel";
      document.getElementById("open-add-c-from").className = "btn btn-danger";
      document.getElementById("category-table").className = "col-sm-9";
      document.getElementById("addCategory").className = "col-sm-3 my-4";
      document.getElementById("formControl").innerHTML = "UPDATE";
    }
  }
  
  function hardClose() {
    document.getElementById("open-add-c-from").innerHTML = "Add Category";
    document.getElementById("open-add-c-from").className = "btn btn-success";
    document.getElementById("category-table").className = "row";
    document.getElementById("addCategory").className = "col-sm-3 my-4 hidden";
    loaddata();
  }
  