from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import json
from img2table.document import PDF
from img2table.ocr import TesseractOCR

class FilePathData(BaseModel):
    filepath: str
# fast api app instance
app = FastAPI()

@app.post('/extract-text')
async def extract_text(data: FilePathData):
    file = data.filepath
    # loading PDF document
    pdf = PDF(src=file)
     # initialise OCR engine
    ocr = TesseractOCR(lang="eng")

    blood_test_keywords = [
        'FastingBloodSugar', 'HbA1c', 'SerumCreatinine', 
     'BUNLevels', 'GFR', 'ProteininUrine', 
     'ACR', 'SerumElectrolytesSodium', 
     'SerumElectrolytesPotassium', 'SerumElectrolytesCalcium', 
     'SerumElectrolytesPhosphorus', 'HemoglobinLevels', 
     'CholesterolTotal', 'CholesterolLDL', 'CholesterolHDL', 
     'CholesterolTriglycerides']
    # extract tables from the PDF using OCR
    pdf_tables = pdf.extract_tables(ocr=ocr)
    results = {}
    for _, tables in pdf_tables.items():
        for table in tables:
            for row in table.content.values():
                key = row[0].value.replace(" ", "")
                value = row[1].value
                results[key] = value
    if results:
        results.pop(next(iter(results)))

    print(results)
    # Check if any of the extracted keys match our list parameters
    found = any(any(keyword in extracted_key for keyword in blood_test_keywords)
        for extracted_key in results.keys())

    if not found:
        return {
            'text': 'The document does not seem to be a blood test report or the blood tests present do not satisfy the system\'s parameters to diagnose CKD',
            'status': False
        } 
    else: 
        return {'text': results,  'status': True}

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8800)
