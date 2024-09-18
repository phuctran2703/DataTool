from flask import Flask, request, render_template, jsonify, send_file
from tool import DataTool
import base64

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

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
