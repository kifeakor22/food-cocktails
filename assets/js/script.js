let searchBtn = $("#search-btn");
let foodList = $("#food");
let foodinstruction = $('.food-contains');
let recipeCloseBtn = $('#closeBtn');
//Event listener
searchBtn.on('click', getfoodlist);
foodList.on('click', getfoodRecipe);


recipeCloseBtn.on('click', () => {
    $(".food-details").removeClass("showRecipe")
    foodinstruction.removeClass('showRecipe');

});
searchBtn.on('click', getfoodlist);
foodList.on('click', getfoodRecipe);


//geting foodlist with given search text
function getfoodlist(e) {
    e.preventDefault()
    let inputSearch = $('#search-input').val().trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputSearch}`).then(response => response.json())
        .then(data => {
            let html = "";
            if (data.meals) {
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
                foodList.removeClass('.noResults');
            } else {
                html = "Sorry, we didn't find any food!";
                foodList.classList.addClass('.noResults');
            }

            foodList.append(html)
        })

}


//Get web Data
function getfoodRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let foodItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${foodItem.dataset.id}`)
            .then(response => response.json())
            .then(data => mealRecipe(data.meals));
    }
}



// Display instruction
function mealRecipe(meal) {
    foodinstruction.empty()
    meal = meal[0];
    list = dispIngred(meal)
    let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruction">
            <h3> Ingredients:</h3>
            <ul class='list-disc'>
               ${list.innerHTML}
            <ul>
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-food-image">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>

    `;
    $(".food-details").addClass("showRecipe")
    foodinstruction.append(html)
    foodinstruction.addClass('showRecipe');
}


// call the getCocktailByName function when .searchCoctail is clicked
//$(".searchCocktail").on("click", getCocktailByName)

// code to clear modal form everytime for fresh input
//$('#cocktailModal').on('shown.bs.modal', function () {
//   $('#getCocktailForm')[0].reset();
//});

//$(".searchCocktail").on("click", getCocktailByName)
//$("drinkByName").empty()
//display ingredients
const dispIngred = (meal) => {
    const list = document.createElement('ul')
    list.className = 'text-center mx-auto'
    for (let i = 1; i <= 20; i++) {
        if (meal['strIngredient' + i]) {
            const listEl = document.createElement('li')
            listEl.className = 'text-md md:text-lg lg:text-xl'
            data = meal['strIngredient' + i] + '  ' + ' - ' + '  ' + meal['strMeasure' + i]
            listEl.innerHTML = data
            list.appendChild(listEl)
        }
    }
    return list
}


