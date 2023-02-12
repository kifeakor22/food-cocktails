let searchBtn = $("#search-btn");
let foodList = $("#food");
let foodinstruction = $('.food-contains');
let recipeCloseBtn = $('#closeBtn');

recipeCloseBtn.on('click', () => {
    $(".food-details").removeClass("showRecipe")
    foodinstruction.removeClass('showRecipe');

});
searchBtn.on('click', getfoodlist);
foodList.on('click', getfoodRecipe);


/***   MEAL SEARCH PAGE ***/

// variables for meal search input
let mealInput = document.getElementById('meal-input');
let suggestionsField = document.getElementById('ul-suggestions');
let apiSearchParams = document.getElementsByName('api-search-param');

// some values needed for making the api call
let searchType = '' //name, area, ingredient
let apiMealURL = ''
let parameter = ''
let queryKey = ''

let countRadio = 0;
apiSearchParams.forEach((apiSearchParam) => {
    apiSearchParam.addEventListener('change', () => {

        apiSearchParam.checked = true;
        setAPIURL(apiSearchParam)

    })
})

function setAPIURL(apiSearchParam) {
    if (apiSearchParam.checked) {
        searchType = apiSearchParam.value
    }

    switch (searchType) {
        case 'name':
            apiMealURL = 'https://www.themealdb.com/api/json/v1/1/search.php?s';
            parameter = 's'
            queryKey = 'strMeal'
            break;
        case 'ingredient':
            apiMealURL = 'https://www.themealdb.com/api/json/v1/1/list.php?i';
            parameter = 'i'
            queryKey = 'strIngredient'
            break;
        case 'area':
            apiMealURL = 'https://www.themealdb.com/api/json/v1/1/list.php?a';
            parameter = 'a'
            queryKey = 'strArea'
            break;
    }
    console.log(apiMealURL)
    console.log(parameter)
    console.log(queryKey)
}

// add eventlisteners
mealInput.addEventListener('input', getSuggestions)


//get suggestions as user types
async function getSuggestions({ target }) {
    let inputData = target.value;

    let suggestionBox = document.createElement('ul');
    suggestionBox.setAttribute('id', 'autocomplete-list');
    suggestionBox.setAttribute('class', 'autocomplete-items')

    this.parentNode.appendChild(suggestionBox)

    if (inputData.length) {
        let suggestions = await getSuggestionsFromAPI(inputData)

        let suggestionList = suggestions.filter((suggestion) => (suggestion[queryKey].toLowerCase().includes(inputData)))

        console.log(suggestionList)
        if (suggestionList != null) {
            suggestionList.map(suggested => {
                let suggestionItem = document.createElement('li');
                suggestionBox.appendChild(suggestionItem);
                suggestionItem.setAttribute('class', 'suggestion-item')

                let mealName = document.createElement('h4')
                let mealImg = document.createElement('img')

                suggestionItem.appendChild(mealName);

                mealName.innerHTML = suggested[queryKey]
            })
        } else {
            let suggestionItem = document.createElement('li');
            suggestionBox.appendChild(suggestionItem);
            suggestionItem.setAttribute('class', 'suggestion-item')

            suggestionItem.innerHTML = 'No item in our DB'

        }

    }
}

async function getSuggestionsFromAPI(inputValue) {
    let newURL = new URL(apiMealURL);
    console.log(newURL)

    newURL.searchParams.set(parameter, inputValue)

    const res = await fetch(newURL)

    if (res.ok) {
        let data = await res.json()
        let meals = await data['meals']
        return meals

    }

}



//geting foodlist with given search text

function getfoodlist() {
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
                foodList.classList.add('.noResults');
            }

            foodList.append(html)
        })


}

function getfoodRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let foodItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${foodItem.dataset.id}`)
            .then(response => response.json())
            .then(data => mealRecipe(data.meals));
    }
}

function mealRecipe(meal) {
    foodinstruction.empty()
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
    $(".food-details").addClass("showRecipe")
    foodinstruction.append(html)
    foodinstruction.addClass('showRecipe');
}
let cocktailDetail = function (drinkIngListItem1, drinkIngListItem2, drinkIngListItem3, drinkIngListItem4, drinkIngListItem5,
    drinkIngListItem6, drinkIngListItem7, drinkInstructionM, drinkTitleM, drinkImgM) {
    var drinkIngredientList = $("<ul>").addClass("modal-body")
    var ingTitle = $("<li>").text("Ingredients")
    var drinkIngListItem1 = $("<li>").addClass("modal-body").text(drinkIngListItem1)
    var drinkIngListItem2 = $("<li>").addClass("modal-body").text(drinkIngListItem2)
    var drinkIngListItem3 = $("<li>").addClass("modal-body").text(drinkIngListItem3)
    var drinkIngListItem4 = $("<li>").addClass("modal-body").text(drinkIngListItem4)
    var drinkIngListItem5 = $("<li>").addClass("modal-body").text(drinkIngListItem5)
    var drinkIngListItem6 = $("<li>").addClass("modal-body").text(drinkIngListItem6)
    var drinkIngListItem7 = $("<li>").addClass("modal-body").text(drinkIngListItem7)
    drinkIngredientList.append(ingTitle, drinkIngListItem1, drinkIngListItem2, drinkIngListItem3, drinkIngListItem4,
        drinkIngListItem5, drinkIngListItem6, drinkIngListItem7)
    var modalBody = $("<div>").addClass("modal-body")
    var modalTitle = $("<h2>").addClass("modal-title").text(drinkTitleM)
    var modalImg = $("<img>").addClass("modal-body img-fluid").attr("src", drinkImgM)
    modalBody.append(modalTitle, modalImg, drinkIngredientList, drinkInstructionM)
    $("#drinkBody").html(modalBody)

}


// get random cocktail
let randomCocktail = $("#randomDrink").on("click", function (event) {
    event.preventDefault()
    $.ajax({
        url: "https://www.thecocktaildb.com/api/json/v1/1/random.php",
        method: 'GET',
    }).then(function (response) {
        $("#displayDrink").empty()
        var drink = response.drinks
        console.log(drink[0].strDrink)
        var drinkCard = $("<div>").addClass("card").attr("style", "width: 18rem")
        var drinkImgM = drink[0].strDrinkThumb
        var drinkImg = $("<img>").addClass("card-img-top").attr("src", `${drinkImgM}/preview`)
        var drinkBody = $("<div>").addClass("card-body")
        var drinkTitleM = drink[0].strDrink
        var drinkTitle = $("<button>").addClass("card-title btn btn-secondary").text(drinkTitleM)
        var drinkInstructionM = drink[0].strInstructions
        var drinkInstruction = $("<h4>").addClass("card-body").text(drinkInstructionM)
        drinkCard.append(drinkImg, drinkBody, drinkTitle)
        $("#displayDrink").append(drinkCard)
        $("#cocktailModal").modal("hide")
        $("#drinkBody").empty()
        var drinkIngListItem1 = drink[0].strIngredient1
        var drinkIngListItem2 = drink[0].strIngredient2
        var drinkIngListItem3 = drink[0].strIngredient3
        var drinkIngListItem4 = drink[0].strIngredient4
        var drinkIngListItem5 = drink[0].strIngredient5
        var drinkIngListItem6 = drink[0].strIngredient6
        var drinkIngListItem7 = drink[0].strIngredient7
        drinkTitle.attr("data-toggle", "modal")
        drinkTitle.attr("data-target", "#drinkModal")
        cocktailDetail(drinkIngListItem1, drinkIngListItem2, drinkIngListItem3, drinkIngListItem4, drinkIngListItem5,
            drinkIngListItem6, drinkIngListItem7, drinkInstructionM, drinkTitleM, drinkImgM)
    })
})


let apiURL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?'
let getCocktailByName = function () {
    var drinkByName = $("#drinkByName").val().trim()
    var queryParam = { "s": drinkByName }
    var queryURL = apiURL + $.param(queryParam)
    console.log(queryURL)
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (data) {
        var cocktails = data.drinks;
        $("#displayDrink").empty();
        cocktails.forEach(function (drink) {
            var drinkImgM = drink.strDrinkThumb;
            var drinkTitleM = drink.strDrink;
            var drinkIngListItem1 = drink.strIngredient1;
            var drinkIngListItem2 = drink.strIngredient2;
            var drinkIngListItem3 = drink.strIngredient3;
            var drinkIngListItem4 = drink.strIngredient4;
            var drinkIngListItem5 = drink.strIngredient5;
            var drinkIngListItem6 = drink.strIngredient6;
            var drinkIngListItem7 = drink.strIngredient7;
            var drinkInstructionM = drink.strInstructions;
            var cocktailCard = $("<div>").addClass("card col-lg-4 col-md-4").attr("style", "width: 18rem");
            var cocktailImg = $("<img>").addClass("card-img-top").attr("src", drinkImgM);
            var cocktailBody = $("<div>").addClass("card-body");
            var cocktailName = $("<h3>").addClass("card-title").text(drinkTitleM);
            var drinkDetails = $("<a>").addClass("btn btn-secondary details").text("Click here for details");
            cocktailCard.append(cocktailImg, cocktailBody, cocktailName, drinkDetails);
            $("#displayDrink").append(cocktailCard);
            $("#cocktailModal").modal("hide");
            drinkDetails.attr("data-toggle", "modal");
            drinkDetails.attr("data-target", "#drinkModal");
            // add a data attribute to drink details to hold drink info for each drink in the loop
            drinkDetails.data("drink-info", {
                drinkTitle: drinkTitleM,
                drinkImg: drinkImgM,
                drinkIngList: [drinkIngListItem1, drinkIngListItem2, drinkIngListItem3, drinkIngListItem4, drinkIngListItem5, drinkIngListItem6, drinkIngListItem7],
                drinkInstruction: drinkInstructionM
            });
            // add an event listener on the DOM to listen for click events on buttons that belong to details class
            $(document).on("click", ".details", function () {
                var drinkInfo = $(this).data("drink-info");
                cocktailDetail(drinkInfo.drinkIngList[0], drinkInfo.drinkIngList[1], drinkInfo.drinkIngList[2], drinkInfo.drinkIngList[3], drinkInfo.drinkIngList[4], drinkInfo.drinkIngList[5], drinkInfo.drinkIngList[6], drinkInfo.drinkInstruction, drinkInfo.drinkTitle, drinkInfo.drinkImg);
            });
        });

    });
}





// call the getCocktailByName function when .searchCoctail is clicked
$(".searchCocktail").on("click", getCocktailByName)

// code to clear modal form everytime for fresh input
$('#cocktailModal').on('shown.bs.modal', function () {
    $('#getCocktailForm')[0].reset();
});

$(".searchCocktail").on("click", getCocktailByName)
$("drinkByName").empty()
