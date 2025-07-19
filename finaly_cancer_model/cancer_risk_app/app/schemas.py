from pydantic import BaseModel, Field
import pandas as pd

FEATURES = pd.read_csv("data/features.txt", header=None)[0].tolist()

class DiagnoseRequest(BaseModel):
    __root__: dict

    def dict(self, *args, **kwargs):
        data = super().dict(*args, **kwargs).get("__root__", {})
        return {k: int(v) for k,v in data.items()}
