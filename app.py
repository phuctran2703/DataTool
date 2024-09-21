from flask import Flask, request, render_template, jsonify, send_file
from tool import DataTool
from excel import (
    # excel_calculate_mean,
    # excel_calculate_median,
    # excel_calculate_mode,
    # excel_calculate_midrange,
    # excel_calculate_Q1,
    # excel_calculate_Q2,
    # excel_calculate_Q3,
    # excel_calculate_variance
    excel_calculate_statistics
)
import base64
from openpyxl import Workbook, load_workbook


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json

    values = data.get('values', [])
    frequencies = data.get('frequencies', [])

    tool = DataTool(values, frequencies)
    
    mean = tool.cal_mean()
    
    median = tool.cal_median()
    
    mode = tool.cal_mode()
    
    midrange = tool.cal_midrange()
    
    Q1, Q2, Q3, IQR = tool.cal_quartiles()
    
    variance = tool.cal_variance()
    
    boxplot= tool.boxplot()
    
    return jsonify({
        "mean": mean,
        "median": median,
        "mode": mode,
        "midrange": midrange,
        "Q1": Q1,
        "Q2": Q2,
        "Q3": Q3,
        "IQR": IQR,
        "variance": variance,
        'boxplot': boxplot
    })

@app.route('/calculate-excel', methods=['POST'])
def calculate_excel():
    data = request.json
    values = data.get('values', [])
    frequencies = data.get('frequencies', [])

    # Gọi hàm để tính toán và lấy kết quả từ Excel
    results = excel_calculate_statistics(values, frequencies)

    return jsonify(results)
# @app.route('/calculate-excel', methods=['POST'])
# def calculate_excel():
#     data = request.json
#     values = data.get('values', [])
#     # print(values)
#     frequencies = data.get('frequencies', [])
#     # print(frequencies)
#     # Sử dụng thư viện Excel để tính toán các giá trị thống kê
#     mean = float(excel_calculate_mean(values,frequencies))
#     # print(mean)
#     median = float(excel_calculate_median(values,frequencies))
#     # print(median)
#     mode = float(excel_calculate_mode(values,frequencies))
#     # print(mode)
#     midrange = float(excel_calculate_midrange(values,frequencies))
#     # print(midrange)
#     Q1 = float(excel_calculate_Q1(values,frequencies))
#     # print(Q1)
#     Q2 = float(excel_calculate_Q2(values,frequencies))
#     # print(Q2)
#     Q3 = float(excel_calculate_Q3(values,frequencies))
#     # print(Q3)
#     IQR = float(Q3 - Q1)
#     variance = float(excel_calculate_variance(values,frequencies))


#     return jsonify({
#         "mean": mean,
#         "median": median,
#         "mode": mode,
#         "midrange": midrange,
#         "Q1": Q1,
#         "Q2": Q2,
#         "Q3": Q3,
#         "IQR": IQR,
#         "variance": variance
#     })

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
