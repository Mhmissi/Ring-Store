import numpy as np, torch, optuna, pytorch_lightning as pl
from torch.utils.data import TensorDataset, DataLoader
from models.model import MultiCancerModel

def load_data():
    data = np.load("data/real_data.npz", allow_pickle=True)
    return (data['X_tr'], data['y_tr'], data['t_tr']), (data['X_te'], data['y_te'], data['t_te']), data['scaler'].item()

def objective(trial):
    (X_tr,y_tr,t_tr),(X_te,y_te,t_te),_ = load_data()
    lr = trial.suggest_loguniform("lr",1e-4,1e-2)
    model = MultiCancerModel(X_tr.shape[1], lr=lr)
    trainers = pl.Trainer(max_epochs=20, logger=False)
    trainers.fit(model,
                 DataLoader(TensorDataset(torch.FloatTensor(X_tr), torch.FloatTensor(y_tr), torch.LongTensor(t_tr)), batch_size=64, shuffle=True),
                 DataLoader(TensorDataset(torch.FloatTensor(X_te), torch.FloatTensor(y_te), torch.LongTensor(t_te)), batch_size=64))
    return trainers.callback_metrics["val_auc"].item()

if __name__=="__main__":
    study = optuna.create_study(direction="maximize")
    study.optimize(objective, n_trials=30)
    lr = study.best_trial.params["lr"]
    (X_tr,y_tr,t_tr),(X_te,_,t_te),scaler = load_data()
    model = MultiCancerModel(X_tr.shape[1], lr=lr)
    trainer = pl.Trainer(max_epochs=30)
    trainer.fit(model, DataLoader(TensorDataset(torch.FloatTensor(X_tr), torch.FloatTensor(y_tr), torch.LongTensor(t_tr)), batch_size=64))
    torch.save({"state_dict":model.state_dict(), "scaler":scaler}, "models/multicancer_model.pt")
    print("✔️ Trained and saved model at models/multicancer_model.pt")
