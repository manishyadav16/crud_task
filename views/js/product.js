(function () {
    loaddata();
    getPagination();
  })();
  
  let updateId = null;
  let pgno = 1;
  
  function loaddata() {
    $.ajax({
      url: "http://localhost:5000/product/get",
      type: "GET",
      success: function (data) {
        populateData(data);
      },
      error: function () {},
    });
  }
  
  function getCategory() {
    $.ajax({
      url: "http://localhost:5000/product/get-categories",
      type: "GET",
      success: function (data) {
        populateCategory(data);
      },
      error: function () {},
    });
  }
  
  function populateCategory(data) {
    const selectElem = document.getElementById("categories");
    for (val of data) {
      let opt = document.createElement("option");
      opt.value = val.id;
      opt.innerHTML = val.name;
      selectElem.appendChild(opt);
    }
  }
  
  function getPagination() {
    $.ajax({
      url: "http://localhost:5000/product/pagination",
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
  
  function addProduct() {
    const name = document.getElementById("pname").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;
    const category = document.getElementById("categories").value;
    $.ajax({
      url: "http://localhost:5000/product/add",
      type: "POST",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({ name, price, stock, category }),
      success: function () {
        $.growl.notice({ message: "Product Added Successfully" });
        document.getElementById("pname").value = "";
        document.getElementById("price").value = "";
        document.getElementById("stock").value = "";
        loaddata();
        getPagination();
      },
      error: function () {
        $.growl.error({ message: "Failed To Add Product" });
      },
    });
  }
  
  function updateProduct() {
    const name = document.getElementById("pname").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;
    const category = document.getElementById("categories").value;
  
    $.ajax({
      url: "http://localhost:5000/product/update",
      type: "PUT",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({ id: updateId, name, price, stock, category }),
      success: function () {
        $.growl.notice({ message: "Product Updated Successfully" });
        document.getElementById("pname").value = "";
        document.getElementById("price").value = "";
        document.getElementById("stock").value = "";
        hardClose();
      },
      error: function () {
        $.growl.error({ message: "Failed To Update Product" });
      },
    });
  }
  
  function handleUpdate(id) {
    updateId = id;
    if (document.getElementById("addProduct").className == "col-sm-3 my-4") {
      hardClose();
    } else {
      getCategory();
      handleAddEditForm("edit");
    }
  }
  
  function handleDelete(id) {
    if (confirm("Are you sure to delete")) {
      $.ajax({
        url: `http://localhost:5000/product/delete/${id}`,
        type: "DELETE",
        success: function () {
          $.growl.notice({ message: "Product Deleted Successfully" });
          location.reload();
        },
        error: function () {
          $.growl.error({ message: "Failed To Deleted Product" });
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
      row += "<td>" + val.price + "</td>";
      row += "<td>" + val.stock + "</td>";
      row += "<td>" + val.category + "</td>";
      row += "<td>" + new Date(val.inserted_on).toLocaleString() + "</td>";
      row += "<td>" +  (val.updated_on == null ? null : new Date(val.updated_on).toLocaleString()) +
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
      document.getElementById("productTable").innerHTML = row;
    }
  }
  
  function handleAddEditForm(flag) {
    if (flag == "add") {
      if (
        document.getElementById("open-add-c-from").className == "btn btn-success"
      ) {
        getCategory();
        document.getElementById("open-add-c-from").innerHTML = "Cancel";
        document.getElementById("open-add-c-from").className = "btn btn-danger";
        document.getElementById("product-table").className = "col-sm-9";
        document.getElementById("addProduct").className = "col-sm-3 my-4";
        document.getElementById("formControl").innerHTML = "ADD";
      } else {
        document.getElementById("open-add-c-from").innerHTML = "Add Product";
        document.getElementById("open-add-c-from").className = "btn btn-success";
        document.getElementById("product-table").className = "row";
        document.getElementById("addProduct").className = "col-sm-3 my-4 hidden";
        loaddata();
      }
    } else {
      document.getElementById("open-add-c-from").innerHTML = "Cancel";
      document.getElementById("open-add-c-from").className = "btn btn-danger";
      document.getElementById("product-table").className = "col-sm-9";
      document.getElementById("addProduct").className = "col-sm-3 my-4";
      document.getElementById("formControl").innerHTML = "UPDATE";
    }
  }
  
  function hardClose() {
    document.getElementById("open-add-c-from").innerHTML = "Add Product";
    document.getElementById("open-add-c-from").className = "btn btn-success";
    document.getElementById("product-table").className = "row";
    document.getElementById("addProduct").className = "col-sm-3 my-4 hidden";
    loaddata();
  }
  