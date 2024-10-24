
// Calculate BMI and recommend health plan
function calculateBMI() {
    const gender = document.getElementById('gender').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);

    if (isNaN(weight) || isNaN(height) || height <= 0) {
        alert('Please enter valid inputs for weight and height.');
        return;
    }

    const bmi = weight / (height * height);
    const category = getBMICategory(bmi);
    const recommendations = getHealthRecommendations(gender, category);

    document.getElementById('result').innerHTML = `
        <p>Your BMI: ${bmi.toFixed(2)} (${category})</p>
        <h2>Health Recommendations for ${gender}</h2>
        <p>${recommendations}</p>
    `;

    const user = { user_id: 5, health_goal: 'fitness', activity_level: 'moderate' }; // Example new user
    const recommendedPlan = recommendHealthPlan(user);
    console.log('Recommended health plan:', recommendedPlan);

    const similarUsers = findSimilarUsers(user);
    console.log('Similar users:', similarUsers);
}

function getBMICategory(bmi) {
    if (bmi < 18.5) {
        return 'Underweight';
    } else if (bmi >= 18.5 && bmi < 24.9) {
        return 'Normal weight';
    } else if (bmi >= 25 && bmi < 29.9) {
        return 'Overweight';
    } else {
        return 'Obese';
    }
}

function getHealthRecommendations(gender, category) {
    const recommendations = {
        male: {
            'Underweight': 'Increase calorie intake with protein-rich foods. Focus on strength training.',
            'Normal weight': 'Maintain a balanced diet. Regular cardio and strength training are recommended.',
            'Overweight': 'Focus on a balanced diet, cutting out processed foods. Include cardio exercises.',
            'Obese': 'Adopt a low-calorie diet and increase physical activity. Consult a health professional.'
        },
        female: {
            'Underweight': 'Increase calorie intake with healthy fats and proteins. Include strength training.',
            'Normal weight': 'Maintain a healthy diet and regular physical activity.',
            'Overweight': 'Focus on portion control, eat nutrient-dense foods, and increase physical activity.',
            'Obese': 'Work on reducing caloric intake and engage in both cardio and strength exercises.'
        }
    };

    return recommendations[gender][category];
}

// Helper function to encode activity levels and health goals
function encodeFeature(value, featureArray) {
    return featureArray.indexOf(value);
}

// Find similar users using cosine similarity based on health_goal and activity_level
function findSimilarUsers(targetUser) {
    const activityLevels = ['sedentary', 'moderate', 'active'];
    const healthGoals = ['weight loss', 'fitness', 'stress relief'];

    const targetActivityEncoded = encodeFeature(targetUser.activity_level, activityLevels);
    const targetGoalEncoded = encodeFeature(targetUser.health_goal, healthGoals);

    return users.map(user => {
        const activityEncoded = encodeFeature(user.activity_level, activityLevels);
        const goalEncoded = encodeFeature(user.health_goal, healthGoals);

        // Cosine similarity formula (simplified for 2 features)
        const dotProduct = (targetActivityEncoded * activityEncoded) + (targetGoalEncoded * goalEncoded);
        const magnitudeTarget = Math.sqrt((targetActivityEncoded ** 2) + (targetGoalEncoded ** 2));
        const magnitudeUser = Math.sqrt((activityEncoded ** 2) + (goalEncoded ** 2));
        const similarity = dotProduct / (magnitudeTarget * magnitudeUser);

        return { user_id: user.user_id, similarity };
    }).sort((a, b) => b.similarity - a.similarity); // Sort by similarity (highest first)
}
