from fastapi import FastAPI
from app.utils import predict

app = FastAPI(title="Multi-Cancer Risk Predictor")

@app.post("/predict")
def predict_cancer(req: dict):
    res = predict(req)
    res["message"] = "⚠️ For educational use—consult a medical professional."
    return res
