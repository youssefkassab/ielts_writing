import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# Load data
df = pd.read_csv("./persuade_2.0_human_scores_demo_id_github.csv")
X = df[["assignment", "full_text"]]
y = df["holistic_essay_score"].astype(float)

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)

# Build preprocessor
preprocessor = ColumnTransformer(
    transformers=[
        ('assignment_tfidf', TfidfVectorizer(), 'assignment'),
        ('full_text_tfidf', TfidfVectorizer(), 'full_text')
    ]
)

# Build pipeline
pipeline = Pipeline([
    ('pre', preprocessor),
    ('reg', GradientBoostingRegressor(random_state=42))
])

# Grid search parameters
param_grid = {
    # TF-IDF settings
    'pre__full_text_tfidf__ngram_range': [(1,1), (1,2)],
    'pre__full_text_tfidf__min_df': [3,5],
    'pre__full_text_tfidf__max_features': [5000, 8000],

    'pre__assignment_tfidf__ngram_range': [(1,1), (1,2)],
    'pre__assignment_tfidf__min_df': [1,3],
    'pre__assignment_tfidf__max_features': [2000, 3000],

    # GradientBoost parameters
    'reg__n_estimators': [200, 300],
    'reg__max_depth': [5,7],
    'reg__learning_rate': [0.05, 0.1]
}

# Build grid search
grid_search = GridSearchCV(
    estimator=pipeline,
    param_grid=param_grid,
    scoring='neg_mean_absolute_error',
    cv=3,
    verbose=2,
    n_jobs=-1
)

# Run grid search
grid_search.fit(X_train, y_train)

# Best parameters
print("✅ Best parameters found:")
print(grid_search.best_params_)

# Predict on test
y_pred = grid_search.predict(X_test)

# Metrics
mse = mean_squared_error(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"✅ Final metrics on test set:")
print(f"  RMSE: {mse ** 0.5:.2f}")
print(f"  MAE:  {mae:.2f}")
print(f"  R²:   {r2:.2f}")
