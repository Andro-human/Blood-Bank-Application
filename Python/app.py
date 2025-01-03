from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from prophet import Prophet
from pymongo import MongoClient
import numpy as np
import requests
app = Flask(__name__)
CORS(app)

# MongoDB Connection Details
connection_string = "mongodb+srv://Androhuman:UI1rwOTc7JWJFiQY@cluster-bloodbank.eolrfvo.mongodb.net/bloodbank"
db_name = "bloodbank"
collection_name = "inventories"
predicted_collection_name="predictions"

def fetch_data_from_mongodb(bloodType):
    try:
        client = MongoClient(connection_string)
        db = client[db_name]
        collection = db[collection_name]

        # Retrieve data for the specific blood type
        data = list(collection.find({"bloodGroup": bloodType}, {"_id": 0, "createdAt": 1, "quantity": 1}))
        if not data:
            raise ValueError(f"No data found for blood type {bloodType}.")

        df = pd.DataFrame(data)
        df['createdAt'] = pd.to_datetime(df['createdAt'])
        df = df.rename(columns={'createdAt': 'ds', 'quantity': 'y'})

        if df.empty or 'ds' not in df.columns or 'y' not in df.columns:
            raise ValueError(f"Invalid or empty data for blood type {bloodType}.")

        return df
    except Exception as e:
        raise RuntimeError(f"Error fetching data for blood type {bloodType}: {e}")

def train_prophet_model(df):
    try:
        df = df.groupby('ds', as_index=False).sum()
        m = Prophet(interval_width=0.95)
        m.fit(df)
        
        return m
    except Exception as e:
        print("Error in training model:", e)
        raise

def forecast_values(model, periods):
    future = model.make_future_dataframe(periods=periods)
    forecast = model.predict(future)
    return forecast

def yearly_averages(forecast):
    forecast['month_of_year'] = forecast['ds'].dt.month
    yearly_avg = forecast.groupby('month_of_year')['yhat'].mean()
    return yearly_avg

def week_averages(forecast):
    forecast['day_of_week'] = forecast['ds'].dt.day_name()
    weekly_avg = forecast.groupby('day_of_week')['yhat'].mean()
    days_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    weekly_avg = weekly_avg[days_order]
    return weekly_avg

def month_averages(forecast):
    forecast['day_of_month'] = forecast['ds'].dt.day
    monthly_avg = forecast.groupby('day_of_month')['yhat'].mean()
    return monthly_avg

@app.route('/api/predictions', methods=['POST'])
def put_all_prediction():
    blood_Type_list = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-']

    for bloodType in blood_Type_list:
        get_predictions(bloodType)

    return {
        "status": "working"
    }



def get_predictions(bloodType):
    try:
        # Fetch data and train model
        data = fetch_data_from_mongodb(bloodType)
        model = train_prophet_model(data)
        forecast = forecast_values(model, periods=365)
        # Calculate averages
        monthly_avg = month_averages(forecast)
        yearly_average = yearly_averages(forecast)
        # Convert to lists for API insertion
        L_yearly = yearly_average.tolist()
        L_monthly = monthly_avg.tolist()

        # Prepare the URL for API insertion
        api_url = "http://localhost:8080/api/v1/predict/insertPrediction"

        # Insert yearly predictions
        print("L_yearly", L_yearly);
        for idx, value in enumerate(L_yearly):
            prediction = {
                "bloodType": bloodType,
                "index": idx + 1,  # Assuming index starts from 1
                "value": value,
                "predictionType": "yearly_avg"
            }
            print("yearlyPrediction", prediction);
            response = requests.post(api_url, json=prediction)
            print("response", response.text)

        # Insert monthly predictions
        print("L_monthly", L_monthly);
        for idx, value in enumerate(L_monthly):
            prediction = {
                "bloodType": bloodType,
                "index": idx + 1,  # Assuming index starts from 1
                "value": value,
                "predictionType": "monthly_avg"
            }
            print("monthlyPrediction", prediction);
            response = requests.post(api_url, json=prediction)
            print("response", response.text);
        
        # Return the results
        return {
            "yearly_averages_val": np.mean(L_yearly),
            "month_averages_val": np.mean(L_monthly),
            "yearly_averages": L_yearly,
            "monthly_averages": L_monthly
        }

    except Exception as e:
        return {"error": str(e)}
    
if __name__ == "__main__":
    app.run(debug=True)