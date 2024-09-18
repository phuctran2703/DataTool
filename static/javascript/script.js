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
                  <td><b>Mean</b></td>
                  <td><b>${response.mean}</b></td>
                </tr>
                <tr>
                  <td><b>Median</b></td>
                  <td><b>${response.median}</b></td>
                </tr>
                <tr>
                  <td><b>Mode</b></td>
                  <td><b>${response.mode}</b></td>
                </tr>
                <tr>
                  <td><b>Midrange</b></td>
                  <td><b>${response.midrange}</b></td>
                </tr>
                <tr>
                  <td><b>Q1</b></td>
                  <td><b>${response.Q1}</b></td>
                </tr>
                <tr>
                  <td><b>Q2</b></td>
                  <td><b>${response.Q2}</b></td>
                </tr>
                <tr>
                  <td><b>Q3</b></td>
                  <td><b>${response.Q3}</b></td>
                </tr>
                <tr>
                  <td><b>IQR</b></td>
                  <td><b>${response.IQR}</b></td>
                </tr>
                <tr>
                  <td><b>Variance</b></td>
                  <td><b>${response.variance}</b></td>
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