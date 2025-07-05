# pip install onnxmltools
# pip install skl2onnx
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, classification_report
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import StringTensorType
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

df = pd.read_csv("./traning/persuade_2.0_human_scores_demo_id_github.csv")
print("Dataset loaded:")
print(df.head())

X = df[[ "assignment" , "full_text" ]]
y = df["holistic_essay_score"].astype(int)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.1, random_state=42
)

# ===========================================
# 3. Build ColumnTransformer with separate TF-IDF vectorizers
# ===========================================
preprocessor = ColumnTransformer(
    transformers=[
        ('assignment_tfidf', TfidfVectorizer(ngram_range=(1,2),min_df=3,max_df=0.85,max_features=8000), 'assignment'),
        ('full_text_tfidf', TfidfVectorizer(ngram_range=(1,2),min_df=3,max_df=0.85,max_features=8000), 'full_text')
    ]
)

# ===========================================
# 4. Build pipeline with RandomForestClassifier
# ===========================================
pipeline = Pipeline([
    ('pre', preprocessor),
    ('clf', GradientBoostingClassifier(n_estimators=200, max_depth=5))
])

# ===========================================
# 5. Train model
# ===========================================
pipeline.fit(X_train, y_train)

# ===========================================
# 6. Evaluate
# ===========================================
# rondom forest predact
# y_pred = pipeline.predict(X_test)
# accuracy = accuracy_score(y_test, y_pred)
# print(f"✅ Accuracy on test set: {accuracy:.2f}")
# print("Classification report:\n", classification_report(y_test, y_pred))
#gradiant classifier  
y_pred = pipeline.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"✅ Accuracy on test set: {accuracy:.2f}")
print("Classification report:\n", classification_report(y_test, y_pred))

# 7. Export to ONNX

initial_type = [
    ('assignment', StringTensorType([1,None])),
    ('full_text', StringTensorType([1,None]))
]


# options = {
#     id(pipeline): {
#         'zipmap': False,
#         'output_class_labels': False
#     }
# }
onnx_model = convert_sklearn(pipeline, initial_types=initial_type )
#options=options

with open("ielts_model_GradientBoost3.onnx", "wb") as f:
    f.write(onnx_model.SerializeToString())

print("Model exported to ielts_model.onnx")
