

queryURL='https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita';

$.ajax({
    url:queryURL,
    method:'GET',
}).then(function(response){
    console.log(response);
})
