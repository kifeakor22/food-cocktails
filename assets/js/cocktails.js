//DOM element
const searchBt=document.getElementById('search-bt');
const foodList=document.getElementById("food");
const foodinstruction=document.querySelector('.food-contains');
const ran=document.getElementById("random");


const recipeCloseBtn=document.getElementById('closeBtn');

//Event Listener
ran.addEventListener('click',getRandomDrink);
searchBt.addEventListener('click', getCocktailsByName);
foodList.addEventListener('click', getDrinksDetails);
recipeCloseBtn.addEventListener('click', () => {
    foodinstruction.parentElement.classList.remove('showRecipe');
});

function getCocktailsByName(){
    let searchByName=document.getElementById('search-cocktails').value.trim();
    
//geting web data
    $.ajax({
        url: `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchByName}`,
        method: "GET"
    }).then(function(response){
        let html = "";
        if(response.drinks){
            response.drinks.forEach(drink => {
                html += `
                    <div class = "food-item" data-id = "${drink.idDrink}">
                        <div class = "food-img">
                            <img src = "${drink.strDrinkThumb}" alt = "food">
                        </div>
                        <div class = "food-name">
                            <h3>${drink.strDrink}</h3>
                            <a href = "#" class = "recipe-btn">Get Details</a>
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
//Geting intsruction of drink
function getDrinksDetails(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let drinkItem = e.target.parentElement.parentElement;
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkItem.dataset.id}`)
        .then(response => response.json())
        .then(data => drinkMakingInstruction(data.drinks));
    }
}
//Displaying data
function drinkMakingInstruction(drink){
    console.log(drink);
    drink = drink[0];
    list=dispIngred(drink)
    let html = `
        <h2 class = "recipe-title">${drink.strDrink}</h2>
        <p class = "recipe-category">${drink.strCategory}</p>
        <div class = "recipe-instruction">
            <h3> Ingredients:</h3>
            <ul class='list-disc'>
                ${list.innerHTML}
            <ul>
            <h3>Instructions:</h3>
            <p>${drink.strInstructions}</p>
        </div>
        <div class = "recipe-food-image">
            <img src = "${drink.strDrinkThumb}" alt = "">
        </div>
        
    `;
    foodinstruction.innerHTML = html;
    foodinstruction.parentElement.classList.add('showRecipe');
}
//Display of ingrdent
const dispIngred = (drink)=>{
    const list= document.createElement('ul')
    list.className='text-center mx-auto'
    for(let i=1;i<=20;i++){
        if(drink['strIngredient'+i]){
            const listEl = document.createElement('li')
            listEl.className='text-md md:text-lg lg:text-xl'
            data =  drink['strIngredient'+i]+'  '+' - '+'  '+ drink['strMeasure'+i]
            listEl.innerHTML=data
            list.appendChild(listEl)
        }        
    }
    return list
}


function getRandomDrink(){
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if(data.drinks){
            data.drinks.forEach(drink => {
                html += `
                    <div class = "food-item" data-id = "${drink.idDrink}">
                        <div class = "food-img">
                            <img src = "${drink.strDrinkThumb}" alt = "food">
                        </div>
                        <div class = "food-name">
                            <h3>${drink.strDrink}</h3>
                            <a href = "#" class = "recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `;
            });
            foodList.classList.remove('notFound');
        } else{
            html = "Sorry, we didn't find any meal!";
            foodList.classList.add('notFound');
        }

        foodList.innerHTML = html;
    });
    
}

