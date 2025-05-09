from img2table.document import PDF
from img2table.ocr import TesseractOCR
import pytesseract

# Instantiation of the pdf
pdf = PDF(src=r"..\uploads\1746637345738-template.pdf")

# Instantiation of the OCR, Tesseract, which requires prior installation
ocr = TesseractOCR(lang="eng")

# Table identification and extraction
pdf_tables = pdf.extract_tables(ocr=ocr)
array = {}

# # We can also create an excel file with the tables
# pdf.to_xlsx('tables.xlsx',
#             ocr=ocr)
# Iterate through pages and tables
for page_num, tables in pdf_tables.items():
    print(f"\n--- Page {page_num} ---")
    for i, table in enumerate(tables):
        print(f"\nTable {i+1}:\n")
        for row in table.content.values():
          test_name = row[0].value
          cleaned_testname = test_name.replace(" ", "")
          results = row[2].value
          array[cleaned_testname] = results
          print([cell.value for cell in row])

print(f'{array}')

# expected_data = pd.DataFrame(columns=['BMI', 'FastingBloodSugar',
#                                       'HbA1c', 'SerumCreatinine',
#                                       'BUNLevels', 'GFR', 'ProteinInUrine',
#                                       'ACR', 'SerumElectrolytesSodium',
#                                       'SerumElectrolytesPotassium', 'SerumElectrolytesCalcium',
#                                       'SerumElectrolytesPhosphorus', 'HemoglobinLevels',
#                                       'CholesterolTotal', 'CholesterolLDL',
#                                       'CholesterolHDL', 'CholesterolTriglycerides'])

# for key, value in array.items():
#   if key in expected_data.columns:
#     expected_data.at[0, key] = value
#   else:
#     print(f'Model does not consider {key}')


# expected_data.head(4)