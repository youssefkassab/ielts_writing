# 🚀 Automated Essay Scoring with TF-IDF, Gradient Boosting, and ONNX

![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/python-3.10+-blue)
![Build](https://img.shields.io/badge/build-passing-brightgreen)

---

## 📚 Overview

This project builds an **end-to-end machine learning pipeline** to automatically predict holistic scores for student essays.  
It processes both the essay prompt and the full essay text using **TF-IDF**, then uses a **Gradient Boosting Classifier** to predict the score.  
Finally, the entire model pipeline is exported to **ONNX** for scalable cross-platform deployment.

---

## ⚙️ Tech Stack

- **Python**: pandas, scikit-learn
- **ML Model**: GradientBoostingClassifier
- **Text Features**: TfidfVectorizer (bigrams, min_df=3, max_df=0.85, max_features=8000)
- **Deployment**: skl2onnx ➔ ONNX
- **Tools**: VS Code, Jupyter Notebook, Colab

---

## 🏗️ Pipeline Overview

CSV ➔ ColumnTransformer (TF-IDF) ➔ GradientBoostingClassifier ➔ Predicted Score 

- Two independent TF-IDF vectorizers for:
  - `assignment` (prompt)
  - `full_text` (essay body)
- Combined via `ColumnTransformer`.

---

## 📊 Dataset

- ~26,000 essays with:
  - `assignment`: essay prompt
  - `full_text`: student-written essay
  - `holistic_essay_score`: human score
- Data split: 90% train, 10% test.

---

## 🔍 Model Performance

| Metric    | Value |
|-----------|-------|
| ✅ Accuracy | ~0.73 |
| RMSE      | 0.60  |
| MAE       | 0.47  |
| R²        | 0.73  |

---

## 🚀 How to Run

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
2️⃣ Set up the environment
python -m venv .venv
# On Windows
.venv\Scripts\activate
# On Linux/Mac
source .venv/bin/activate

pip install -r requirements.txt
3️⃣ Train the model
python train_model.py
After training, it will:

Print metrics on the test set.

Export the trained pipeline to ielts_model.onnx.
💾 ONNX Export
The pipeline is exported using skl2onnx for use with ONNX Runtime in Python, Node.js, C#, and more.
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import StringTensorType

initial_type = [
    ('assignment', StringTensorType([1, None])),
    ('full_text', StringTensorType([1, None]))
]

onnx_model = convert_sklearn(pipeline, initial_types=initial_type)
with open("ielts_model.onnx", "wb") as f:
    f.write(onnx_model.SerializeToString())
✨ Future Work
Hyperparameter tuning with GridSearchCV

Experiment with LightGBM / CatBoost for potential speedups

Build a FastAPI + ONNX Runtime REST API to serve predictions
📝 License
MIT License.
Feel free to use, modify, and build on top of this project.
🙌 Acknowledgements
Built with the power of open-source Python ML ecosystem.
Special thanks to scikit-learn, pandas, and the ONNX community.

