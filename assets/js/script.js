const searchBtn=document.getElementById("search-btn");
const foodList=document.getElementById("food");
const foodinstruction=document.querySelector('.food-contains');

const recipeCloseBtn=document.getElementById('closeBtn');

searchBtn.addEventListener('click', getfoodlist);
foodList.addEventListener('click', getfoodRecipe);
recipeCloseBtn.addEventListener('click', () => {
    foodinstruction.parentElement.classList.remove('showRecipe');
});



//geting foodlist with given search text

function getfoodlist(){
    let inputSearch=document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputSearch}`).then(response => response.json())
    .then(data =>{
        let html = "";
        if(data.meals){
            data.meals.forEach(meal => {
                html += `
                    <div class = "food-item" data-id = "${meal.idMeal}">
                        <div class = "food-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "food-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `;
            });
            foodList.classList.remove('.noResults');
        } else{
            html = "Sorry, we didn't find any food!";
            foodList.classList.add('.noResults');
        }

        foodList.innerHTML = html;
    })

  
}

function getfoodRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let foodItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${foodItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipe(data.meals));
    }
}

function mealRecipe(meal){
    console.log(meal);
    meal = meal[0];
    let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruction">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-food-image">
            <img src = "${meal.strMealThumb}" alt = "">
    `;
    foodinstruction.innerHTML = html;
    foodinstruction.parentElement.classList.add('showRecipe');
}
