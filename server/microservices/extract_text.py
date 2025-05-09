from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import json
from img2table.document import PDF
from img2table.ocr import TesseractOCR

class FilePathData(BaseModel):
    filepath: str

app = FastAPI()

@app.post('/extract-text')
async def extract_text(data: FilePathData):
    file = data.filepath

    pdf = PDF(src=file)
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
    return {'text': results}

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8800)
