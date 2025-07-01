THIS REPOSITORY CONTAINS:
- the full-stack application under client/ and server/ respectively
- notebook used to explore dataset, data preprocessing and model training under dataset-notebook/ directory
- Sample PDF Report
# A template blood test report (sample_report.pdf) is provided under the uploads/ directory. 
# can be used for the system's full workflow 
- unit test cases under server/tests/
- evaluation for recommendation engine under server/evaluation/

As for the dataset used in model training, it can be accessed from this link:
https://www.kaggle.com/datasets/rabieelkharoua/chronic-kidney-disease-dataset-analysis/data

#################################################################
Running the Project Locally

Follow these steps to set up the application locally:

### 1. Clone the Repository
git clone https://github.com/hana-1310/CST3990

### 2. Install Dependencies
cd server
npm install
pip install -r requirements.txt

### 3. Start Backend Server
npm run dev

### 4. Run Python Microservices
# n a separate terminal window:

cd server/microservices
python extract_text.py
python detect.py

### 5. Start Frontend Client
# open new terminal
npm run dev

###################################################################################
# TESTING 
cd server
npm test
###################################################################################
# EVALUATION
cd server/evaluation
py embedding.py
node evaluateRecs.js
# find results under results/ directory