import pandas as pd

# Sample data: User profiles and health preferences
data = {
    'user_id': [1, 2, 3, 4],
    'age': [25, 35, 45, 55],
    'weight_kg': [70, 85, 90, 65],
    'activity_level': ['sedentary', 'moderate', 'active', 'moderate'],
    'health_goal': ['weight loss', 'fitness', 'stress relief', 'weight loss']
}

users_df = pd.DataFrame(data)
print(users_df)

# Predefined health plans based on health goals
health_plans = {
    'weight loss': 'Low carb diet, Cardio exercises, Yoga',
    'fitness': 'Balanced diet, Strength training, Pilates',
    'stress relief': 'Meditation, Deep breathing exercises, Relaxation techniques'
}

# Function to recommend health plan based on user's health goal
def recommend_health_plan(user_profile):
    goal = user_profile['health_goal']
    return health_plans.get(goal, 'General Wellness Plan')

# Applying recommendations to each user
users_df['recommended_plan'] = users_df.apply(recommend_health_plan, axis=1)

print(users_df[['user_id', 'health_goal', 'recommended_plan']])


from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import LabelEncoder

# Encoding categorical features (activity_level and health_goal)
le_activity = LabelEncoder()
le_goal = LabelEncoder()

users_df['activity_level_encoded'] = le_activity.fit_transform(users_df['activity_level'])
users_df['health_goal_encoded'] = le_goal.fit_transform(users_df['health_goal'])

# Calculate similarity matrix
similarity_matrix = cosine_similarity(users_df[['activity_level_encoded', 'health_goal_encoded']])

# Find similar users (example for user 1)
similar_users = list(enumerate(similarity_matrix[0]))
similar_users = sorted(similar_users, key=lambda x: x[1], reverse=True)

print(f"Similar users to user 1: {similar_users}")