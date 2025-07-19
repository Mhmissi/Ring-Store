import torch
from torch.utils.data import DataLoader, TensorDataset
from sklearn.metrics import accuracy_score, roc_auc_score
import numpy as np
from models.model import MultiCancerModel

def evaluate(model_path="models/multicancer_model.pt"):
    data = np.load("data/real_data.npz", allow_pickle=True)
    X_te, y_te, t_te = data['X_te'], data['y_te'], data['t_te']
    ckpt = torch.load(model_path, map_location="cpu")
    model = MultiCancerModel(X_te.shape[1])
    model.load_state_dict(ckpt["state_dict"])
    model.eval()

    ds = DataLoader(TensorDataset(torch.FloatTensor(X_te), torch.FloatTensor(y_te), torch.LongTensor(t_te)), batch_size=64)
    all_y, all_yhat, all_t, all_that = [], [], [], []
    for x, y, t in ds:
        r, typ = model(x)
        all_y.append(y)
        all_yhat.append(torch.sigmoid(r))
        all_t.append(t)
        all_that.append(torch.argmax(typ, dim=1))
    y, yh = torch.cat(all_y).numpy(), torch.cat(all_yhat).numpy()
    t, th = torch.cat(all_t).numpy(), torch.cat(all_that).numpy()
    print(f"AUC: {roc_auc_score(y, yh):.3f}")
    print(f"Type Accuracy: {accuracy_score(t, th):.3f}")

if __name__ == "__main__":
    evaluate()
