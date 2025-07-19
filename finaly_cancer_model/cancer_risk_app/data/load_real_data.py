import pandas as pd, numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

def load_breast():
    bc = load_breast_cancer()
    df = pd.DataFrame(bc.data, columns=bc.feature_names)
    df['label'] = bc.target
    df['cancer_type'] = 0
    return df

def load_cervical():
    df = pd.read_csv("data/risk_factors_cervical_cancer.csv").dropna()
    df['label'] = df['Biopsy']
    df['cancer_type'] = 1
    return df

def combine_and_save():
    df1 = load_breast()
    df2 = load_cervical()
    common = [c for c in df1.columns if c in df2.columns and c not in ['label','cancer_type']]
    df = pd.concat([df1[common+['label','cancer_type']], df2[common+['label','cancer_type']]], ignore_index=True)
    X, y, t = df[common].values, df['label'].values, df['cancer_type'].values
    X_tr, X_te, y_tr, y_te, t_tr, t_te = train_test_split(X, y, t, test_size=0.2, random_state=42, stratify=y)
    scaler = StandardScaler().fit(X_tr)
    np.savez("data/real_data.npz", X_tr=scaler.transform(X_tr), X_te=scaler.transform(X_te), y_tr=y_tr, y_te=y_te, t_tr=t_tr, t_te=t_te, scaler=scaler)
    pd.Series(common).to_csv("data/features.txt", index=False)
    print("✔️ data saved: real_data.npz, features.txt")

if __name__ == "__main__":
    combine_and_save()
