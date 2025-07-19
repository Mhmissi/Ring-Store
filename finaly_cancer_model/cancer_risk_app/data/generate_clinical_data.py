import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

FEATURES = [
  "age","gender","smoking","alcohol","physical_inactivity",
  "family_history","personal_cancer_history","obesity",
  "hormonal_therapy","weight_loss","persistent_cough","dysphagia",
  "bleeding","new_lump","skin_lesion","abdominal_pain"
]

def simulate(n=50000, seed=42):
    np.random.seed(seed)
    df = pd.DataFrame({
        "age": np.random.randint(18, 90, n),
        "gender": np.random.binomial(1, 0.5, n),
        "smoking": np.random.binomial(1, 0.3, n),
        "alcohol": np.random.binomial(1, 0.2, n),
        "physical_inactivity": np.random.binomial(1, 0.4, n),
        "family_history": np.random.binomial(1, 0.1, n),
        "personal_cancer_history": np.random.binomial(1, 0.05, n),
        "obesity": np.random.binomial(1, 0.3, n),
        "hormonal_therapy": np.random.binomial(1, 0.2, n),
        "weight_loss": np.random.binomial(1, 0.1, n),
        "persistent_cough": np.random.binomial(1, 0.05, n),
        "dysphagia": np.random.binomial(1, 0.03, n),
        "bleeding": np.random.binomial(1, 0.04, n),
        "new_lump": np.random.binomial(1, 0.05, n),
        "skin_lesion": np.random.binomial(1, 0.05, n),
        "abdominal_pain": np.random.binomial(1, 0.1, n),
    })
    logits = (
        0.03*(df.age - 50) +
        1.5*df.smoking +
        1.0*df.family_history +
        1.2*df.personal_cancer_history +
        0.8*df.weight_loss +
        0.9*df.persistent_cough +
        1.1*df.new_lump +
        1.0*df.bleeding +
        0.7*df.abdominal_pain -
        5
    )
    df["label"] = np.random.binomial(1, 1 / (1 + np.exp(-logits)))
    return train_test_split(df, test_size=0.2, random_state=seed, stratify=df.label)

if __name__ == "__main__":
    train, test = simulate()
    train.to_csv("data/train.csv", index=False)
    test.to_csv("data/test.csv", index=False)
    print("✅ Data generated.")
