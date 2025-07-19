import numpy as np, torch
from models.model import MultiCancerModel
from models.explainer import explain_instance
FEATURES = list(np.load("data/features.txt", allow_pickle=True))

ck = torch.load("models/multicancer_model.pt", map_location="cpu")
scaler, sd = ck["scaler"], ck["state_dict"]
model = MultiCancerModel(input_dim=scaler.mean_.shape[0])
model.load_state_dict(sd); model.eval()

def predict(features: dict):
    x = np.array([[features[f] for f in FEATURES]])
    x = scaler.transform(x)
    r, t = model(torch.FloatTensor(x))
    prob = torch.sigmoid(r).item()
    type_idx = t.argmax(dim=1).item()
    shap_vals = explain_instance(list(x[0]))
    return {"probability": round(prob,3), "cancer_type": type_idx, "shap": shap_vals}
