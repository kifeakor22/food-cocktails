/**************************  START MEAL SEARCH PAGE *************************/
// TODO: try and add arrow scroll to suggestions

/*
 */
/*
 */


// variables for meal search input
let mealInput = document.getElementById('search-input');

// add eventlisteners
mealInput.addEventListener('input', getSuggestions)

let apiSearchParams = document.getElementsByName('api-search-param');
let searchFood = document.querySelector('#food')
let searchForm = document.querySelector('#meal-form')

let saveToLocal = document.querySelector('.save-to-locals')
saveToLocal.addEventListener('click', addToLocalStorage)
let localStorageItem


// some values needed for making the api call
let searchType = '' //name, area, ingredient
let apiMealURL = ''
let parameter = ''
let queryKey = ''
let selectedValue = ''
var currentFocus;

apiSearchParams[0].checked = true
setAPIURL(apiSearchParams[0])
closeAllLists();

apiSearchParams.forEach((apiSearchParam) => {
    apiSearchParam.addEventListener('change', () => {
        countRadio = 1
        apiSearchParam.checked = true;
        setAPIURL(apiSearchParam)
        closeAllLists();
        clearSearchResult()
        mealInput.value = ""
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
}


//get suggestions as user types
async function getSuggestions({ target }) {
    let inputData = target.value;

    currentFocus = -1;

    if (!inputData.length) closeAllLists();

    if (inputData.length) {
        let suggestionBox = document.createElement('ul');
        suggestionBox.setAttribute('id', 'autocomplete-list');
        suggestionBox.setAttribute('class', 'autocomplete-items')

        this.parentNode.appendChild(suggestionBox)

        let suggestions = await getSuggestionsFromAPI(inputData)
        if (suggestions) {
            let suggestionList = suggestions.filter((suggestion) => (suggestion[queryKey].toLowerCase().includes(inputData)))
            suggestionList.map(suggested => {
                let suggestionItem = document.createElement('li');
                suggestionBox.appendChild(suggestionItem);
                suggestionItem.setAttribute('class', 'suggestion-item')

                let mealName = document.createElement('p')


                suggestionItem.appendChild(mealName);

                mealName.innerHTML = suggested[queryKey]


                mealName.addEventListener("click", async ({ target }) => {
                    mealInput.value = target.innerHTML.trim()

                    callApiWithFilterInUrl(target.innerHTML, suggested)

                    closeAllLists();
                })
            })
        } else {
            let suggestionItem = document.createElement('li');
            suggestionBox.appendChild(suggestionItem);
            suggestionItem.setAttribute('class', 'suggestion-item')

            suggestionBox.innerHTML = '<p> No item in our DB </p>'
        }

    }
}

// form submission
document.querySelector("form").addEventListener('submit', async (e) => {
    e.preventDefault()
    let searchItems = mealInput.value.trim()
    apiSearchParams[0].checked = true;
    setAPIURL(apiSearchParams[0])
    closeAllLists();
    mealInput.value = "";
    callApiWithFilterInUrl(searchItems)
})

//scroll down to select from list
mealInput.addEventListener('keydown', function (e) {
    var x = document.getElementById('autocomplete-list')
    if (x) x = x.getElementsByTagName("li");
    if (e.key == "ArrowDown") {
        currentFocus++;
        addActive(x);
    } else if (e.key == "ArrowUp") {
        currentFocus--;
        addActive(x);
    } else if (e.key == "Enter") {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) {
                x[currentFocus].click()
            };
        }
    }

})
function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
}
function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
    }
}



async function callApiWithFilterInUrl(queryValue, querySuggestion) {
    if (searchType == 'area') {
        clearSearchResult();

        apiMealURL = 'https://www.themealdb.com/api/json/v1/1/filter.php?a';
        parameter = 'a'
        queryKey = 'strMeal'

        const areaResults = await getSuggestionsFromAPI(queryValue.trim())
        if (areaResults) {
            areaResults.map(area => (
                displaySelectedResult(area)
            ))
        }
    }
    if (searchType == 'ingredient') {
        clearSearchResult();

        apiMealURL = 'https://www.themealdb.com/api/json/v1/1/filter.php?i';
        parameter = 'i'
        queryKey = 'strMeal'

        const ingredientResults = await getSuggestionsFromAPI(queryValue.trim())
        if (ingredientResults) {
            ingredientResults.map(ingredient => (
                displaySelectedResult(ingredient)
            ))
        }
    }
    if (searchType == 'name') {
        clearSearchResult();

        apiMealURL = 'https://www.themealdb.com/api/json/v1/1/search.php?s';
        parameter = 's'
        queryKey = 'strMeal'

        const nameResults = await getSuggestionsFromAPI(queryValue.trim())
        if (nameResults) {
            nameResults.map(name => (
                displaySelectedResult(name)
            ))
        }
    }
}

function displaySelectedResult(paramObj) {
    //clear existing selection
    let selectedResult = document.createElement('div')
    selectedResult.setAttribute('class', 'selected-item')

    let selectedResultImage = document.createElement('img')
    selectedResultImage.setAttribute('class', 'selected-img')
    let selectedResultName = document.createElement('p');

    searchFood.appendChild(selectedResult)
    selectedResult.appendChild(selectedResultImage)
    selectedResult.appendChild(selectedResultName)

    selectedResultName.innerHTML = paramObj['strMeal']
    selectedResultImage.src = paramObj['strMealThumb']

    selectedResult.addEventListener('click', async () => {

        foodinstruction.empty()

        const fetchData = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${paramObj['strMeal']}`)
        let data = await fetchData.json()
        let meals = data['meals'][0]

        let ingredientsUL = document.createElement("ul");
        ingredientsUL.setAttribute('class', 'recipe-body-side')
        ingredientsUL.style.borderRight = '#f0f0f0 2px solid'

        let allIngredents = Object.keys(meals).filter(theKey => (theKey.includes('strIngredient') && meals[theKey]))
        let allMeasures = Object.keys(meals).filter(theMeasure => (theMeasure.includes('strMeasure') && meals[theMeasure]))

        const buildMap = (allMeasures, allIngredents) => {
            for (let i = 0; i < allIngredents.length; i++) {
                let ingredientItem = document.createElement('li');
                ingredientItem.setAttribute('class', 'recipe-body-side-li')
                ingredientsUL.appendChild(ingredientItem)
                ingredientItem.innerHTML = (`${meals[allMeasures[i]]} => ${meals[allIngredents[i]]}`)
            };
        }
        buildMap(allMeasures, allIngredents)
        localStorageItem = meals.strMeal
        let html = `
        <div class='modal-container'>
            <div class='modal-container-headings'>
                <h2 class = "recipe-title">${meals.strMeal}</h2>

            </div>
            <div class='recipe-body-container'>
                <div class='ul'>${ingredientsUL.innerHTML}</div>
                <div class = 'recipe-body-image'>
                <img src = "${meals.strMealThumb}" alt = "" >
                </div>
                <div class='misc-props'>
                <p class = "misc-props-recipe-category">${meals.strCategory}</p>
                    <p class = "misc-props-recipe-category">${meals.strArea}</p>
                    <p class = "misc-props-recipe-category">${meals.strTags}</p>
                    <a class = "misc-props-recipe-category" href=${meals.strSource}>more...</a>
                </div>
            </div>
            <div class = "recipe-instruction">
                <h4>Instructions:</h4>
                <p style="color: black;">${meals.strInstructions}</p>
             </div>

        </div>
    `;
        $(".food-details").addClass("showRecipe")
        foodinstruction.append(html)
        foodinstruction.addClass('showRecipe');

        closeAllLists()


    })
}

function addToLocalStorage() {
    let localMeals;
    if (localStorage.getItem('localMeals') === null) {
        localMeals = []
    } else {
        localMeals = JSON.parse(localStorage.getItem('localMeals'))
    }

    localMeals.push(localStorageItem)
    localStorage.setItem("localMeals", JSON.stringify(localMeals))
}

document.querySelector('.view-local').addEventListener('click', getFromLocalStorage)

function getFromLocalStorage() {
    let localMeals;
    if (localStorage.getItem("localMeals") === null) {
        // create empty list if null
        localMeals = [];

    } else {
        // parse the values of the localstorage to todos
        localMeals = JSON.parse(localStorage.getItem('localMeals'))

        localMeals.forEach(localMeal => (callApiWithFilterInUrl(localMeal)))
    }
}
// api call for suggestions is made here
async function getSuggestionsFromAPI(inputValue) {
    let newURL = new URL(apiMealURL);
    newURL.searchParams.set(parameter, inputValue)

    const res = await fetch(newURL)

    if (res.ok) {
        let data = await res.json()
        let meals = await data['meals']
        return meals
    }
}

// close the suggestion box
function closeAllLists(element) {
    let x = document.querySelectorAll('.autocomplete-items')
    for (let i = 0; i < x.length; i++) {
        if (element != x[i] && element != mealInput) {
            x[i].parentNode.removeChild(x[i]);
        }
    }
}

// clear search results
function clearSearchResult() {
    if (searchFood.firstChild != null) {
        let results = document.querySelectorAll('.selected-item')
        for (let i = 0; i < results.length; i++) {
            results[i].parentNode.removeChild(results[i])
        }
    }

}

/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);

});



// TODO: make the submit button functional - retrieve all results and display them
// TODO: change placeholder when radio button changes

/*************************************************  END MEAL SEARCH PAGE ***************************************/