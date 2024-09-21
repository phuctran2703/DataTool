import datetime
import xlwings as xw

def create_excel_file(values, frequencies):
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f'temp_statistics_{timestamp}.xlsx'
    wb = xw.Book()
    ws = wb.sheets[0]

    # Ghi tiêu đề
    ws.range('A1').value = ['Values', 'Frequencies']

    # Ghi dữ liệu vào Excel
    for i, (value, frequency) in enumerate(zip(values, frequencies), start=2):
        ws.range(f'A{i}').value = value
        ws.range(f'B{i}').value = frequency

    # Mở rộng cột C dựa trên tần suất
    ws.range('C1').value = 'Expanded Data'
    expanded_index = 2  # Bắt đầu từ hàng 2 của cột C
    for i, (value, frequency) in enumerate(zip(values, frequencies)):
        for _ in range(int(frequency)):  # Tạo ra nhiều dòng dữ liệu dựa trên frequency
            ws.range(f'C{expanded_index}').value = value
            expanded_index += 1

    # Ghi các hàm tính toán
    ws.range('D1').value = 'Mean'
    ws.range('D2').formula = f'=AVERAGE(C2:C{expanded_index-1})'

    ws.range('E1').value = 'Median'
    ws.range('E2').formula = f'=MEDIAN(C2:C{expanded_index-1})'

    ws.range('F1').value = 'Mode'
    ws.range('F2').formula = f'=MODE(C2:C{expanded_index-1})'

    ws.range('G1').value = 'Midrange'
    ws.range('G2').formula = f'DO NOT HAVE EQUATION'

    ws.range('H1').value = 'Q1'
    ws.range('H2').formula = f'=QUARTILE.INC(C2:C{expanded_index-1}, 1)'

    ws.range('I1').value = 'Q2'
    ws.range('I2').formula = f'=MEDIAN(C2:C{expanded_index-1})'

    ws.range('J1').value = 'Q3'
    ws.range('J2').formula = f'=QUARTILE.INC(C2:C{expanded_index-1}, 3)'

    ws.range('K1').value = 'IQR'
    ws.range('K2').formula = f'=J2-H2'

    ws.range('L1').value = 'Variance'
    ws.range('L2').formula = f'=VAR.P(C2:C{expanded_index-1})'

    # Lưu tệp
    wb.save(filename)
    wb.close()  # Đóng workbook
    return filename


def excel_calculate_statistics(values, frequencies):
    if not values or not frequencies:
        return {}
    
    filename = create_excel_file(values, frequencies)

    # Mở lại tệp Excel để lấy kết quả
    wb = xw.Book(filename)
    ws = wb.sheets[0]

    # Lấy các kết quả
    results = {
        "mean": ws.range('D2').value,
        "median": ws.range('E2').value,
        "mode": ws.range('F2').value,
        "midrange": ws.range('G2').value,
        "Q1": ws.range('H2').value,
        "Q2": ws.range('I2').value,
        "Q3": ws.range('J2').value,
        "IQR": ws.range('K2').value,
        "variance": ws.range('L2').value
    }

    wb.close()  # Đóng workbook
    return results
