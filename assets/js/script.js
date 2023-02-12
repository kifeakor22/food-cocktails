
// variables for meal search input

// variables for cocktail search inputs to use later 



// function to get user input that will be used to build query parameters
// depending on what the user searched for 

    var drinkByIngredient = $("#drinkByIngredient").val().trim()
    
    var random = $("#randomDrink").on("click", function(event){
        event.preventDefault()
        $.ajax({
            url:"https://www.thecocktaildb.com/api/json/v1/1/random.php",
             method:'GET',
            }).then(function(response){
                $("#displayDrink").empty()
                
                var drink = response.drinks
                console.log(drink[0].strDrink)
                var drinkCard = $("<div>").addClass("card").attr("style", "width: 18rem")
                var drinkImg = $("<img>").addClass("card-img-top").attr("src", `${drink[0].strDrinkThumb}/preview`)
                var drinkBody = $("<div>").addClass("card-body")
                var drinkTitle = $("<button>").addClass("card-title btn btn-secondary").text(drink[0].strDrink)
                var drinkInstruction = $("<p>").addClass("card-body").text(drink[0].strInstructions)
                drinkTitle.attr("data-toggle", "modal")
                drinkTitle.attr("data-target", "#drinkModal")
                drinkCard.append(drinkImg,drinkBody,drinkTitle)
                $("#displayDrink").append(drinkCard)
                $("#cocktailModal").modal("hide")
                $("#drinkBody").empty()   
                var drinkIngredientList =$("<ul>").addClass("modal-body")
                var ingTitle =$("<li>").text("Ingredients")
                var drinkIngListItem1 = $("<li>").addClass("modal-body").text(drink[0].strIngredient1)
                var drinkIngListitem2 = $("<li>").addClass("modal-body").text(drink[0].strIngredient2)
                var drinkIngListItem3 = $("<li>").addClass("modal-body").text(drink[0].strIngredient3)
                var drinkIngListItem4 =$("<li>").addClass("modal-body").text(drink[0].strIngredient4)
                var drinkIngListItem5 = $("<li>").addClass("modal-body").text(drink[0].strIngredient5)
                var drinkIngListItem6 = $("<li>").addClass("modal-body").text(drink[0].strIngredient6)
                var drinkIngListItem7 = $("<li>").addClass("modal-body").text(drink[0].strIngredient7)
                drinkIngredientList.append(ingTitle,drinkIngListItem1,drinkIngListitem2,drinkIngListItem3,drinkIngListItem4,drinkIngListItem5,drinkIngListItem6,drinkIngListItem7)       
                var modalBody =$("<div>").addClass("modal-body")
                var modalTitle = $("<h2>").addClass("modal-title").text(drink[0].strDrink)
                var modalImg =  $("<img>").addClass("modal-body img-fluid").attr("src", drink[0].strDrinkThumb)
                modalBody.append(modalTitle,modalImg,drinkIngredientList,drinkInstruction)
                $("#drinkBody").append(modalBody)   

            })
         })


 let apiURL='https://www.thecocktaildb.com/api/json/v1/1/search.php?'
let getCocktail = function() {
    var drinkByName = $("#drinkByName").val().trim()
    var queryParam = {"s": drinkByName}
    var queryURL = apiURL + $.param(queryParam)
    console.log(queryURL)
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(data){
        var cocktails = data.drinks
        $("#displayDrink").empty()
        cocktails.forEach(function(drink){
             
            var cocktailCard = $("<div>").addClass("card col-lg-4 col-md-4").attr("style", "width: 18rem")
            var cocktailImg = $("<img>").addClass("card-img-top").attr("src",drink.strDrinkThumb)
            var cocktailBody = $("<div>").addClass("card-body")
            var cocktailName = $("<h3>").addClass("card-title").text(drink.strDrink)
            var drinkDetails = $("<a>").addClass("btn btn-secondary").text("Click here for details")
            cocktailCard.append(cocktailImg,cocktailBody,cocktailName,drinkDetails) 
            $("#displayDrink").append(cocktailCard)
             $("#cocktailModal").modal("hide")  
             
        })
        

    })


}



$(".searchCocktail").on("click", getCocktail) 
 $("drinkByName").empty()

//$.ajax({
  //  url:queryURL,
 //   method:'GET',
//}).then(function(response){
    //console.log(response);
//})

                