import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import xgboost as xgb
import joblib

print("🚀 Starting NSL-KDD Training...")

# Load dataset
print("📂 Loading dataset...")

train = pd.read_csv("KDDTrain+.txt", header=None)
test = pd.read_csv("KDDTest-21.txt", header=None)

print("Train shape:", train.shape)
print("Test shape:", test.shape)

# Split features and labels
X_train = train.iloc[:, :-1]
y_train = train.iloc[:, -1]

X_test = test.iloc[:, :-1]
y_test = test.iloc[:, -1]

print("⚙️ Encoding categorical features...")
for column in X_train.columns:
    if X_train[column].dtype == object:

        encoder = LabelEncoder()

        combined = pd.concat([X_train[column], X_test[column]])

        encoder.fit(combined)

        X_train[column] = encoder.transform(X_train[column])
        X_test[column] = encoder.transform(X_test[column])
# Encode labels
label_encoder = LabelEncoder()
y_train = label_encoder.fit_transform(y_train)
y_test = label_encoder.transform(y_test)

print("🌲 Training Random Forest...")

rf = RandomForestClassifier(n_estimators=100)
rf.fit(X_train, y_train)

rf_pred = rf.predict(X_test)
rf_acc = accuracy_score(y_test, rf_pred)

print("Random Forest Accuracy:", rf_acc)

print("⚡ Training XGBoost...")

xgb_model = xgb.XGBClassifier()
xgb_model.fit(X_train, y_train)

xgb_pred = xgb_model.predict(X_test)
xgb_acc = accuracy_score(y_test, xgb_pred)

print("XGBoost Accuracy:", xgb_acc)


# Save models
joblib.dump(rf, "model_rf.pkl")
joblib.dump(xgb_model, "model_xgb.pkl")


print("✅ Models saved successfully!")