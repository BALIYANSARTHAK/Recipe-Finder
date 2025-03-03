async function searchRecipe() {
    const query = document.getElementById('search-box').value;
    fetchRecipe(query);
}

// Quick search from fast food buttons
function quickSearch(dish) {
    document.getElementById('search-box').value = dish;
    fetchRecipe(dish);
}

async function fetchRecipe(query) {
    const resultDiv = document.getElementById('result');

    if (!query) {
        alert("Please enter a dish name");
        return;
    }

    const API_URL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.meals) {
            const meal = data.meals[0];

            resultDiv.innerHTML = `
                <h2>${meal.strMeal}</h2>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="300">
                <h3>Ingredients:</h3>
                <ul>
                    ${getIngredients(meal).map(ing => `<li>${ing}</li>`).join('')}
                </ul>
                <h3>Instructions:</h3>
                <p>${meal.strInstructions}</p>
                <button onclick="saveFavorite('${meal.strMeal}')">Save to Favorites</button>
            `;
        } else {
            resultDiv.innerHTML = `<p>No results found.</p>`;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Extract Ingredients
function getIngredients(meal) {
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }
    }
    return ingredients;
}

// Save Favorite Recipe
function saveFavorite(recipe) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.includes(recipe)) {
        favorites.push(recipe);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        alert(`${recipe} saved to favorites!`);
    } else {
        alert("Already in favorites!");
    }
}
