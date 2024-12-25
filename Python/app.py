from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from prophet import Prophet
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB Connection Details
connection_string = "mongodb+srv://Androhuman:UI1rwOTc7JWJFiQY@cluster-bloodbank.eolrfvo.mongodb.net/bloodbank"
db_name = "bloodbank"
collection_name = "inventories"

# Fetch Data from MongoDB
def fetch_data_from_mongodb():
    try:
        client = MongoClient(connection_string)
        db = client[db_name]
        collection = db[collection_name]
        
        # Retrieve data
        data = list(collection.find({}, {"_id": 0, "createdAt": 1, "quantity": 1}))  # Fetch date and donations fields
        df = pd.DataFrame(data)
        
        # Convert to proper format
        df['createdAt'] = pd.to_datetime(df['createdAt'])
        df = df.rename(columns={'createdAt': 'ds', 'quantity': 'y'})
        
        if df.empty or 'ds' not in df.columns or 'y' not in df.columns:
            raise ValueError("Invalid or empty data fetched from MongoDB.")
        
        return df
    except Exception as e:
        raise RuntimeError(f"Error fetching data from MongoDB: {e}")

# Train Prophet Model
def train_prophet_model(df):
    df = df.groupby('ds', as_index=False).sum()  # Ensure no duplicate dates
    m = Prophet(interval_width=0.95)
    m.fit(df)
    return m

# Forecast Future Values
def forecast_values(model, periods):
    future = model.make_future_dataframe(periods=periods)
    forecast = model.predict(future)
    return forecast

# Get All Days of the Week Averages
def week_averages(forecast):
    forecast['day_of_week'] = forecast['ds'].dt.day_name()
    weekly_avg = forecast.groupby('day_of_week')['yhat'].mean()
    days_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    weekly_avg = weekly_avg[days_order]
    return weekly_avg

# Get All Days of the Month Averages
def month_averages(forecast):
    forecast['day_of_month'] = forecast['ds'].dt.day
    monthly_avg = forecast.groupby('day_of_month')['yhat'].mean()
    return monthly_avg

# Define API route
@app.route('/api/predictions', methods=['GET'])
def get_predictions():
    try:
        # Fetch Data
        data = fetch_data_from_mongodb()

        # Train Model
        model = train_prophet_model(data)

        # Forecast
        forecast = forecast_values(model, periods=365)  # Forecast for 1 year

        # Get Averages for Each Day of the Week
        weekly_avg = week_averages(forecast)

        # Get Averages for Each Day of the Month
        monthly_avg = month_averages(forecast)

        # Return Averages as JSON response
        predictions = {
            "weekly_averages": weekly_avg.tolist(),
            "monthly_averages": monthly_avg.tolist()
        }

        return jsonify(predictions)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)