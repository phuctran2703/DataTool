document.getElementById("add-row").addEventListener("click", addRow);
document.getElementById("delete-row").addEventListener("click", deleteRow);
document
  .getElementById("data-table")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addRow();
    }
  });

document.getElementById("calculate").addEventListener("click", calculate);

function addRow() {
  const table = document.getElementById("data-table");
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
                <td><input type="number" class="value-input" placeholder="Nhập giá trị"></td>
                <td><input type="number" class="frequency-input" placeholder="Nhập tần số"></td>
            `;
  table.appendChild(newRow);

  const newInput = newRow.querySelector(".value-input");
  if (newInput) {
    newInput.focus();
  }
}

function deleteRow() {
  const table = document.getElementById("data-table");
  const rows = table.getElementsByTagName("tr");
  if (rows.length > 1) {
    table.deleteRow(rows.length - 1);
  }
}

function calculate() {
  const values = [];
  const frequencies = [];

  document.querySelectorAll(".value-input").forEach((input) => {
    if (input.value) {
      values.push(Number(input.value));
    }
  });

  document.querySelectorAll(".frequency-input").forEach((input) => {
    if (input.value) {
      frequencies.push(Number(input.value));
    }
  });

  $.ajax({
    url: "/calculate",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ values: values, frequencies: frequencies }),
    success: function (response) {
      // Hiển thị kết quả tính toán
      document.getElementById("results").innerHTML = `
            <table>
              <thead>
                <tr>
                  <th>Statistic</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mean</td>
                  <td>${response.mean}</td>
                </tr>
                <tr>
                  <td>Median</td>
                  <td>${response.median}</td>
                </tr>
                <tr>
                  <td>Mode</td>
                  <td>${response.mode}</td>
                </tr>
                <tr>
                  <td>Midrange</td>
                  <td>${response.midrange}</td>
                </tr>
                <tr>
                  <td>Q1</td>
                  <td>${response.Q1}</td>
                </tr>
                <tr>
                  <td>Q2</td>
                  <td>${response.Q2}</td>
                </tr>
                <tr>
                  <td>Q3</td>
                  <td>${response.Q3}</td>
                </tr>
                <tr>
                  <td>IQR</td>
                  <td>${response.IQR}</td>
                </tr>
                <tr>
                  <td>Variance</td>
                  <td>${response.variance}</td>
                </tr>
              </tbody>
            </table>
          `;
      document.getElementById("plot").innerHTML = `
          <h4 style="margin-top:50px"><b>Biểu đồ</b></h4>
          <img src="data:image/png;base64,${response.boxplot}" alt="Boxplot">
      `;
    },
    
    error: function (xhr) {
      const errorMsg = xhr.responseJSON && xhr.responseJSON.error ? xhr.responseJSON.error : "Đã xảy ra lỗi.";
      document.getElementById("results").innerHTML = `
              <p>Đã xảy ra lỗi: ${errorMsg}</p>
          `;
    },
  });  
}