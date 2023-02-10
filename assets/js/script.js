
// variables for meal search input

// variables for cocktail search inputs to use later 

let drinkByName = $("#drinkByName")
let drinkByIngredient = $("#drinkByIngredient")
let randomDrink = $("#randomDrink")


// function to get user input that will be used to build query parameters
// depending on what the user searched for 


let searchFood = function() {
    event.preventDefault()
    const foodUrl = "www.themealdb.com/api/json/v1/1/lookup.php?"
    var mealByIngredient = $("#mealByIngredient").val().trim()
    var mealByName = $("#mealByName").val().trim()
    var mealByOrigin = $("#mealByOrigin").val().trim()
    if(mealByIngredient){
        var queryParam = {"i": mealByIngredient}
        console.log(queryParam)
    }else if(mealByName) {
        var queryParam = {"s": mealByName }
        console.log(queryParam)

    }else if(mealByOrigin) {
        var queryParam = {"a" : mealByOrigin}
        console.log(queryParam)
    }else {
        alert("please select at least one meal")
    }
    $('#foodModal').modal('hide')
}

$(".searchFood").on("click",searchFood)



queryURL='https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita';

//$.ajax({
  //  url:queryURL,
 //   method:'GET',
//}).then(function(response){
    //console.log(response);
//})


