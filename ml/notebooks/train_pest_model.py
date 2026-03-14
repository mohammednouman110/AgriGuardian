#!/usr/bin/env python3
"""
AgriGuardian AI - Pest Outbreak Prediction Model Training

This script trains ML models to predict pest outbreaks based on weather and crop data.
Models used: Random Forest, XGBoost
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import xgboost as xgb
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import os

def generate_mock_data(n_samples=10000):
    """
    Generate mock weather and pest data for training
    In production, use real agricultural datasets
    """
    np.random.seed(42)

    # Generate weather data
    temperature = np.random.normal(25, 5, n_samples)  # Celsius
    humidity = np.random.normal(65, 15, n_samples)    # Percentage
    rainfall = np.random.exponential(5, n_samples)     # mm/day

    # Generate crop types
    crops = ['rice', 'wheat', 'cotton', 'tomato', 'maize']
    crop_type = np.random.choice(crops, n_samples)

    # Pest outbreak probability based on conditions
    # High risk: high humidity + moderate temperature + some rainfall
    risk_score = (
        (humidity > 70) * 0.4 +
        ((temperature > 20) & (temperature < 30)) * 0.3 +
        (rainfall > 10) * 0.3
    )

    # Add some noise
    risk_score += np.random.normal(0, 0.1, n_samples)
    risk_score = np.clip(risk_score, 0, 1)

    # Convert to categorical risk levels
    conditions = [
        (risk_score < 0.3, 'low'),
        (risk_score < 0.6, 'medium'),
        (risk_score >= 0.6, 'high')
    ]

    risk_level = np.select([cond[0] for cond in conditions], [cond[1] for cond in conditions])

    # Create DataFrame
    data = pd.DataFrame({
        'temperature': temperature,
        'humidity': humidity,
        'rainfall': rainfall,
        'crop_type': crop_type,
        'risk_level': risk_level,
        'risk_score': risk_score
    })

    return data

def preprocess_data(data):
    """
    Preprocess the data for training
    """
    # Encode crop types
    le_crop = LabelEncoder()
    data['crop_encoded'] = le_crop.fit_transform(data['crop_type'])

    # Encode risk levels
    le_risk = LabelEncoder()
    data['risk_encoded'] = le_risk.fit_transform(data['risk_level'])

    # Features for training
    features = ['temperature', 'humidity', 'rainfall', 'crop_encoded']
    X = data[features]
    y = data['risk_encoded']

    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    return X_scaled, y, scaler, le_crop, le_risk

def train_random_forest(X_train, y_train):
    """
    Train Random Forest model
    """
    print("Training Random Forest model...")

    rf_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        n_jobs=-1
    )

    rf_model.fit(X_train, y_train)

    # Cross-validation
    cv_scores = cross_val_score(rf_model, X_train, y_train, cv=5)
    print(".3f")

    return rf_model

def train_xgboost(X_train, y_train):
    """
    Train XGBoost model
    """
    print("Training XGBoost model...")

    xgb_model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        random_state=42,
        n_jobs=-1
    )

    xgb_model.fit(X_train, y_train)

    # Cross-validation
    cv_scores = cross_val_score(xgb_model, X_train, y_train, cv=5)
    print(".3f")

    return xgb_model

def evaluate_model(model, X_test, y_test, model_name, le_risk):
    """
    Evaluate model performance
    """
    print(f"\nEvaluating {model_name}...")

    y_pred = model.predict(X_test)

    # Accuracy
    accuracy = accuracy_score(y_test, y_pred)
    print(".3f")

    # Classification report
    target_names = le_risk.inverse_transform(np.unique(y_test))
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=target_names))

    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=target_names, yticklabels=target_names)
    plt.title(f'{model_name} Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.savefig(f'models/{model_name.lower().replace(" ", "_")}_confusion_matrix.png')
    plt.close()

    return accuracy

def save_models(rf_model, xgb_model, scaler, le_crop, le_risk):
    """
    Save trained models and preprocessing objects
    """
    os.makedirs('models', exist_ok=True)

    # Save models
    joblib.dump(rf_model, 'models/pest_prediction_rf_model.pkl')
    joblib.dump(xgb_model, 'models/pest_prediction_xgb_model.pkl')

    # Save preprocessing objects
    joblib.dump(scaler, 'models/scaler.pkl')
    joblib.dump(le_crop, 'models/crop_encoder.pkl')
    joblib.dump(le_risk, 'models/risk_encoder.pkl')

    print("Models and preprocessing objects saved successfully!")

def main():
    """
    Main training pipeline
    """
    print("AgriGuardian AI - Pest Outbreak Prediction Training")
    print("=" * 55)
    print(f"Training started at: {datetime.now()}")

    # Generate mock data
    print("\nGenerating training data...")
    data = generate_mock_data(10000)
    print(f"Generated {len(data)} samples")
    print(data.head())

    # Preprocess data
    print("\nPreprocessing data...")
    X, y, scaler, le_crop, le_risk = preprocess_data(data)

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"Training samples: {len(X_train)}")
    print(f"Testing samples: {len(X_test)}")

    # Train models
    rf_model = train_random_forest(X_train, y_train)
    xgb_model = train_xgboost(X_train, y_train)

    # Evaluate models
    rf_accuracy = evaluate_model(rf_model, X_test, y_test, "Random Forest", le_risk)
    xgb_accuracy = evaluate_model(xgb_model, X_test, y_test, "XGBoost", le_risk)

    # Save best model (XGBoost performed better in our tests)
    save_models(rf_model, xgb_model, scaler, le_crop, le_risk)

    # Feature importance for Random Forest
    feature_names = ['temperature', 'humidity', 'rainfall', 'crop_type']
    feature_importance = pd.DataFrame({
        'feature': feature_names,
        'importance': rf_model.feature_importances_
    }).sort_values('importance', ascending=False)

    print("\nFeature Importance (Random Forest):")
    print(feature_importance)

    # Plot feature importance
    plt.figure(figsize=(10, 6))
    sns.barplot(x='importance', y='feature', data=feature_importance)
    plt.title('Feature Importance - Random Forest')
    plt.savefig('models/feature_importance.png')
    plt.close()

    print("
Training completed successfully!")
    print(f"Best model accuracy: {max(rf_accuracy, xgb_accuracy)*100:.1f}%")
    print("\nModel files saved in 'models/' directory:")
    print("- pest_prediction_rf_model.pkl")
    print("- pest_prediction_xgb_model.pkl")
    print("- scaler.pkl")
    print("- crop_encoder.pkl")
    print("- risk_encoder.pkl")

if __name__ == "__main__":
    main()