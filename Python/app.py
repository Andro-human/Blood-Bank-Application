from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from prophet import Prophet
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# MongoDB Connection Details
connection_string = "mongodb+srv://Androhuman:UI1rwOTc7JWJFiQY@cluster-bloodbank.eolrfvo.mongodb.net/bloodbank"
db_name = "bloodbank"
collection_name = "inventories"

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
    df = df.groupby('ds', as_index=False).sum()
    m = Prophet(interval_width=0.95)
    m.fit(df)
    return m

def forecast_values(model, periods):
    future = model.make_future_dataframe(periods=periods)
    forecast = model.predict(future)
    return forecast

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

@app.route('/api/predictions', methods=['GET'])
def get_all_prediction():
    blood_Type_list = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-']
    List_all = {}
    for bloodType in blood_Type_list:
        List_all[bloodType] = get_predictions(bloodType)
    return jsonify(List_all)

def get_predictions(bloodType):
    try:
        data = fetch_data_from_mongodb(bloodType)
        model = train_prophet_model(data)
        forecast = forecast_values(model, periods=365)
        monthly_avg = month_averages(forecast)
        return {
            "monthly_averages": monthly_avg.tolist()
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    app.run(debug=True)
