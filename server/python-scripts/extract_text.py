import sys
import json
from img2table.document import PDF
from img2table.ocr import TesseractOCR

pdf_path = sys.argv[1]
pdf = PDF(src=pdf_path)
ocr = TesseractOCR(lang="eng")
pdf_tables = pdf.extract_tables(ocr=ocr)

results = {}
for _, tables in pdf_tables.items():
    for table in tables:
        for row in table.content.values():
            key = row[0].value.replace(" ", "")
            value = row[2].value
            results[key] = value
if results:
    results.pop(next(iter(results)))
print(json.dumps(results))