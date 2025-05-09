from fastapi import FastAPI
import pickle
import uvicorn
import pandas as pd
from pydantic import BaseModel

app = FastAPI()

class PredictionData(BaseModel):
    data: dict

@app.post('/detect-ckd')
async def detect_ckd(received: PredictionData):
    data = received.data
    with open('../model.pkl', 'rb') as f:
        model = pickle.load(f)

    expected_data = pd.DataFrame(columns=['BMI', 'FastingBloodSugar',
                                      'HbA1c', 'SerumCreatinine',
                                      'BUNLevels', 'GFR', 'ProteinInUrine',
                                      'ACR', 'SerumElectrolytesSodium',
                                      'SerumElectrolytesPotassium', 'SerumElectrolytesCalcium',
                                      'SerumElectrolytesPhosphorus', 'HemoglobinLevels',
                                      'CholesterolTotal', 'CholesterolLDL',
                                      'CholesterolHDL', 'CholesterolTriglycerides', 'MuscleCramps', 'Itching'])

    for [key, value] in data.items():
        if key in expected_data.columns:
            expected_data.at[0, key] = value
        else:
            print(f'Model does not consider {key}')
    
    expected_data.fillna(0)
    
    prediction = model.predict(expected_data)
    print('Prediction: ', prediction[0], prediction)
    return {'prediction': int(prediction[0])}

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8801)
