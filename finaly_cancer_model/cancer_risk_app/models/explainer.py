import numpy as np, torch, shap
from models.model import MultiCancerModel

ck = torch.load("models/multicancer_model.pt", map_location="cpu")
scaler, sd = ck["scaler"], ck["state_dict"]
model = MultiCancerModel(input_dim=scaler.mean_.shape[0])
model.load_state_dict(sd); model.eval()

data = np.load("data/real_data.npz", allow_pickle=True)
X_te = data['X_te']
explainer = shap.DeepExplainer(model.shared, torch.FloatTensor(X_te[:100]))

def explain_instance(x: list):
    arr = scaler.transform(np.array(x).reshape(1,-1))
    vals = explainer.shap_values(torch.FloatTensor(arr))[0]
    return vals.tolist()
