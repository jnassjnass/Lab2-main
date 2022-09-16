//DinnerModel class
class DinnerModel {
    
    // Default values are 2 and an empty array, will be used incase nothing is given when constructiong the class
    constructor (guestParam = 2, dishesParam = []) {
        this.guests = guestParam;
        this.dishes = [...dishesParam];
    }
     
    setNumberOfGuests(num) {
        if(num > 0 && Number.isInteger(num)) // If our number is larger than 0 (positive) and is an integer
        this.guests = num; // Change the number of guests
        
        else // Otherwise throw an error (do not catch this error though!)
        throw new Error("number of guests not a positive integer");}
    

    getNumberOfGuests() {
        // console.log('Number of guests: '+ this.guests); // Print number of guests the dinnermodel currently uses and return the number
        return this.guests;
    }

    getMenu(){
        // console.log('Dishes on menu:');
        
        // For each dish in our dish array we print their Type:Name (this function returns nothing)
        //[...this.dishes].map(function(element){
            //console.log(element.type, ':', element.name)
        //})
       
        return [...this.dishes]; // Returns dishes as a copy
    } 

    addToMenu(dish){

        // Using function (see below) we check for 'bad input', undeined or null values.
        try{check_undefined_null(dish);
        }
        catch(e){console.error(e.message); // If we find theese 'bad values' we throw an error which we then catch
        }

           // We first run removeType on a copy of this.dishes + the dish we want to add, 
           // This will filter away any dish on the menu of the same type as the dish we want to add.
           // Note that if the dish we want to add is of a type not yet in the array no elements will be filtered away (same array as before is returned)
           // After we get this filtered array we append our new dish to this.dishes
           this.dishes = [...removeType([... this.dishes], dish), dish];
           return;   
        
    }

    removeFromMenu(dish) {
       
        // Try to identify any undefined/ null dishes
        try{check_undefined_null(dish);
        }
        catch(e){console.error(e.message);
        }
        // We use removeDish function to remove (filter away) any dish with the same Id as our given dish
        // Note that if the dish we're trying to remove does not exist on the menu there will be nothing to filter away 
        // Therfore the same menu will be returned/ no changes will be made
        this.dishes = removeDish([... this.dishes], dish)
        return;
    }

    getDishOfType(type){

         // Try to identify any undefined/ null dishes as input
         try{check_undefined_null(type);
         }
         catch(e){console.error(e.message);
         }
        
         // .find method returns the first element in the provided array (for us copy of this.dishes)
         // which satisfies the provided testing function (isTypeCB, looks for dishes of same type as the one we want)
         // If no values satisfy the testing function, undefined is returned.
        function isTypeCB(dish) {return dish.type == type}
        return [...this.dishes].find(isTypeCB); 
    }

     getDishPrice(dish){
        // For each ingridient in or dish we first calculate each individual ingridients price (taking into consideration its quantity)
        // i.e one egg might cost 5 sek, but this dish uses 3 eggs so the total cost per ingrideint would really be 15 sek.
        // We then add all the individual costs together, using .reduce(sumCB), giving us the a total price for each dish.
        function PricesPerIngredient(ingredients) {return (ingredients.price * ingredients.quantity);}
        return dish['ingredients'].map(PricesPerIngredient).reduce(sumCB,0);
    }
    
    getDinnerPrice(){
        // For each dish (using a copy of this.dishes) we first caluclate the price for each dish
        // We then add all the dish prices together to get a total dinnerprice.
        // Lastly we get price depending on how many guests we have (multiply total dinner cost with this.guests)
        return this.guests*([...this.dishes].map(this.getDishPrice).reduce(sumCB,0));
    }

    getIngredients(){
        // to make sure we have one entry for each ingredient name, the suitable data structure is a Dictionary,
        // with ingredient names as keys
        // All JavaScript objects are dictionaries, so we use an object called combinedIngredients to collect ingredient data. 
        // combinedIngredients[name] will return the ingredient object with the respective name 
        const combinedIngredients={};
         
        // Function which gives us a copy of each dishes ingridient list (array)
        function getIngredientsCB(dish){return [...dish.ingredients]}
        
        // For each ingridient, check if the ingridient exists in combinedIngridients
        // If yes we want to 'go in to the dict.' and increase its quantity (change its value) with however much the current dish needs/uses
        // If no we just add the ingridient to the dict.
        function handleIngridientsCB(dish){
            function storeIngredientsCB(ingredient){
                combinedIngredients[ingredient.name] ?combinedIngredients[ingredient.name] = {...combinedIngredients[ingredient.name], 
                quantity: combinedIngredients[ingredient.name].quantity + ingredient.quantity} : combinedIngredients[ingredient.name] = ingredient;
                }
            dish.forEach(storeIngredientsCB);
        }

        [...this.dishes].map(getIngredientsCB).forEach(handleIngridientsCB);
        
        return Object.values(combinedIngredients);
    }

}

const  DishSource={
    
    getDishDetails(id) {

    // .find method returns the first element in the provided array (for us dishesConst array) 
    //(Note that this file is imported in the test file so we do not have to do it ourselves, if we woud want to use exports and require methods!)
    // which satisfies the provided testing function (isIdCB, looks for dishes of same id as the one we want)
    // If no values satisfy the testing function, undefined is returned.
    function isIdCB(dish) {return dish.id == id}
    return dishesConst.find(isIdCB);  
    },

    searchDishes(searchParams){
        
        // Function first checks if searchParams.type is Truthy (i.e if we have 'something' to work with), 
        // if Truthy then it checks if the condition is satisfied (returns dish.type === searchParams.type)
        // If Falsy the condition is not evaluated and we just return true (true returns entire array (.filter() only removes false values, if everything is true there is nothing to remove!), which we want if no search params are given)
        function searchWithTypeCB(dish){return searchParams.type ? dish.type === searchParams.type : true;}; 
        // Function first checks if searchParams.query is Truthy or Falsy
        // If Truthy it returns if dish.name.includes(searchParams.query)
        // If Falsy return true 
        function searchWithQueryCB(dish){return searchParams.query ? dish.name.includes(searchParams.query) : true;};
        
        return dishesConst.filter(searchWithTypeCB).filter(searchWithQueryCB); // Using filter here and not find since find only will give first element that 'works' and we can have multiple!
    },
   
    getDishDetailsPromise(id) {

    function getIdACB(data){
        function isIdCB(dish){ return dish.id === id;}
        return data.find(isIdCB);
    }
        
       return fetch("http://standup.csc.kth.se:8080/iprog/file?DM1595/dishes.json") 
      
       .then(function processHTTPResponseACB(response){return response.json();} )  // Get data
      
      //.then(function processHTTPContentACB(data){return console.log(data);}) // just to check, get full array (11 elem.) 
      
      .then(getIdACB) // Assuming each id is unique we utilize .find() and look for dish with same id 
      
      .catch(function processErrorACB(err){  console.error(err); }); // Catch error
    },   
}; 
    
    // Function which checks if an 'input' is undefined or null valued, if yes throw an error which will be catched
    // If not the input will just 'pass through'
    function check_undefined_null(dish){
        const msg= "I will not add an undefined dish to the menu";
        if(dish === undefined || dish === null)
            throw new Error(msg);
        return dish;
    }
    // .filter method filters down provided aray (for us a copy of this.dishes) 
    // to just the elements that pass the test implemented in test functions (isnotType and Is IdCB)
    // isnotTypeCB filters away any element of the same type as the dish given.
    // isnotIdCB filters away any element with the same id as the dish given.
    function removeType(dish_array, dish_given){
        function isnotTypeCB(dish){return dish.type !== dish_given.type;}
        return dish_array.filter(isnotTypeCB);
    }
    function removeDish(dish_array, dish_given){
        function isnotIdCB(dish){return dish.id !== dish_given.id;}
        return dish_array.filter(isnotIdCB);
    }
    // .reduce() works like a callback function on every element in a given array
    // (In order) It will run the return value from the previous iteriation through the function
    // In this way we can create sumCB which then just calc. total value for an array
    function sumCB(accumulator, element ){return accumulator + element;}


// We want to create a 'starting class'
// Get some dishes to start off with
dish_1_full = DishSource.getDishDetails(1);
dish_202_full =DishSource.getDishDetails(202);
dish_2000_full =DishSource.getDishDetails(2000); // Gives undefined*/

// To instantiate a class object you write:
const obj = new DinnerModel(2, [DishSource.getDishDetails(2), DishSource.getDishDetails(100)]);
