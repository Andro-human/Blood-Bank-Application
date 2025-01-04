from flask import Flask
from flask_cors import CORS
import pandas as pd
from prophet import Prophet
from pymongo import MongoClient
import numpy as np
import requests
import os
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
    try:
        blood_Type_list = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-']
        all_predictions = []

        for bloodType in blood_Type_list:
            predictions = get_predictions(bloodType)
            if "error" in predictions:
                raise RuntimeError(f"Error in predictions for {bloodType}: {predictions['error']}")
            all_predictions.extend(predictions)
            
        # Send all predictions in a single API call
        base_url = os.getenv("API_URL", "http://localhost:8080")
        api_url = f"{base_url}/api/v1/predict/insertPredictions"
        response = requests.post(api_url, json={"predictions": all_predictions})

        return {"status": "success", "message": response.text}
    except Exception as e:
        return {"status": "failure", "error": str(e)}, 500


@app.route('/')
def healthCheck():
    return {
        "status": "Server is Running"
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

        # Collect predictions
        predictions = []

        # Add yearly predictions
        for idx, value in enumerate(yearly_average.tolist()):
            predictions.append({
                "bloodType": bloodType,
                "index": idx + 1,  # Assuming index starts from 1
                "value": value,
                "predictionType": "yearly_avg"
            })

        # Add monthly predictions
        for idx, value in enumerate(monthly_avg.tolist()):
            predictions.append({
                "bloodType": bloodType,
                "index": idx + 1,  # Assuming index starts from 1
                "value": value,
                "predictionType": "monthly_avg"
            })

        return predictions
    except Exception as e:
        return {"error": str(e)}
    
if __name__ == "__main__":
    app.run(debug=True)