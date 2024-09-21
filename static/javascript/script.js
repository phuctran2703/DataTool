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

  // Gọi API DataTool
  $.ajax({
    url: "/calculate",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ values: values, frequencies: frequencies }),
    success: function (response) {
      const dataToolResults = `
        <table>
          <thead>
            <tr>
              <th>Phép tính</th>
              <th>Kết quả (DataTool)</th>
              <th>Kết quả (Excel)</th>
            </tr>
          </thead>
          <tbody id="result-table-body">
            <tr><td>Mean</td><td>${response.mean}</td><td></td></tr>
            <tr><td>Median</td><td>${response.median}</td><td></td></tr>
            <tr><td>Mode</td><td>${response.mode}</td><td></td></tr>
            <tr><td>Midrange</td><td>${response.midrange}</td><td></td></tr>
            <tr><td>Q1</td><td>${response.Q1}</td><td></td></tr>
            <tr><td>Q2</td><td>${response.Q2}</td><td></td></tr>
            <tr><td>Q3</td><td>${response.Q3}</td><td></td></tr>
            <tr><td>IQR</td><td>${response.IQR}</td><td></td></tr>
            <tr><td>Variance</td><td>${response.variance}</td><td></td></tr>
          </tbody>
        </table>
      `;
      document.getElementById("results").innerHTML = dataToolResults;

      // Gọi API Excel
      $.ajax({
        url: "/calculate-excel",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ values: values, frequencies: frequencies }),
        success: function (excelResponse) {
          // Cập nhật cột kết quả Excel vào bảng
          document.getElementById("result-table-body").innerHTML = `
            <tr><td>Mean</td><td>${response.mean}</td><td>${excelResponse.mean}</td></tr>
            <tr><td>Median</td><td>${response.median}</td><td>${excelResponse.median}</td></tr>
            <tr><td>Mode</td><td>${response.mode}</td><td>${excelResponse.mode}</td></tr>
            <tr><td>Midrange</td><td>${response.midrange}</td><td>${excelResponse.midrange}</td></tr>
            <tr><td>Q1</td><td>${response.Q1}</td><td>${excelResponse.Q1}</td></tr>
            <tr><td>Q2</td><td>${response.Q2}</td><td>${excelResponse.Q2}</td></tr>
            <tr><td>Q3</td><td>${response.Q3}</td><td>${excelResponse.Q3}</td></tr>
            <tr><td>IQR</td><td>${response.IQR}</td><td>${excelResponse.IQR}</td></tr>
            <tr><td>Variance</td><td>${response.variance}</td><td>${excelResponse.variance}</td></tr>
          `;
        },
        error: function (xhr) {
          console.error("Lỗi khi gọi API Excel:", xhr);
        }
      });

      // Hiển thị biểu đồ
      document.getElementById("plot").innerHTML = `
          <h4><b>Biểu đồ</b></h4>
      `;
      document.getElementById("boxplot").innerHTML = `
          <img src="data:image/png;base64,${response.boxplot}" witdth="50%" height="50%" alt="Boxplot">
      `;
      document.getElementById("scatter").innerHTML = `
          <canvas id="scatterChart"></canvas>
      `;

      // Thêm biểu đồ scatter chart
      const scatterData = [];
      for (let i = 0; i < values.length; i++) {
        for (let j = 0; j < frequencies[i]; j++) {
          scatterData.push({ x: values[i], y: frequencies[i] });
        }
      }

      const ctx = document.getElementById("scatterChart").getContext("2d");
      new Chart(ctx, {
        type: "scatter",
        data: {
          datasets: [
            {
              label: "Scatter Chart",
              data: scatterData,
              backgroundColor: "rgba(75, 192, 192, 1)",
              borderColor: "rgba(75, 192, 192, 0.2)",
              pointRadius: 5,
              pointHoverRadius: 7,
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: "Giá trị",
              },
            },
            y: {
              title: {
                display: true,
                text: "Tần số",
              },
            },
          },
        },
      });
    },
    error: function (xhr) {
      const errorMsg = xhr.responseJSON && xhr.responseJSON.error ? xhr.responseJSON.error : "Đã xảy ra lỗi.";
      document.getElementById("results").innerHTML = `<p>Đã xảy ra lỗi: ${errorMsg}</p>`;
    },
  });
}
