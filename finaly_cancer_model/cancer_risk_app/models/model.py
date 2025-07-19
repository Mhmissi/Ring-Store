import torch, pytorch_lightning as pl
from torch import nn

class MultiCancerModel(pl.LightningModule):
    def __init__(self, input_dim, num_types=2, lr=1e-3):
        super().__init__()
        self.save_hyperparameters()
        self.shared = nn.Sequential(nn.Linear(input_dim,64), nn.ReLU(), nn.Dropout(0.3),
                                    nn.Linear(64,32), nn.ReLU(), nn.Dropout(0.3))
        self.risk_head = nn.Linear(32,1)
        self.type_head = nn.Linear(32,num_types)
        self.loss_risk = nn.BCEWithLogitsLoss()
        self.loss_type = nn.CrossEntropyLoss()

    def forward(self, x):
        h = self.shared(x)
        return self.risk_head(h).squeeze(), self.type_head(h)

    def training_step(self, batch, _):
        x, y, t = batch
        r, that = self(x)
        loss = self.loss_risk(r, y.float()) + self.loss_type(that, t)
        self.log("train_loss", loss)
        return loss

    def validation_step(self, batch, _):
        x, y, t = batch
        r, that = self(x)
        return {"y": y, "r_hat": torch.sigmoid(r), "t": t, "t_hat": torch.argmax(tht, dim=1)}

    def validation_epoch_end(self, outs):
        import numpy as np
        from sklearn.metrics import roc_auc_score, accuracy_score
        y = torch.cat([o["y"] for o in outs]).cpu().numpy()
        r = torch.cat([o["r_hat"] for o in outs]).cpu().numpy()
        t = torch.cat([o["t"] for o in outs]).cpu().numpy()
        that = torch.cat([o["t_hat"] for o in outs]).cpu().numpy()
        self.log("val_auc", roc_auc_score(y, r))
        self.log("val_type_acc", accuracy_score(t, that))

    def configure_optimizers(self):
        return torch.optim.Adam(self.parameters(), lr=self.hparams.lr)
