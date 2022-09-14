//DinnerModel class
class DinnerModel {

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
}

const  DishSource={
    
    getDishDetails(id) {

    // .find method returns the first element in the provided array (for us dishesConst array) 
    //(Note that this file is imported in the test file so we do not have to do it ourselves, if we woud want to use exports and require methods!)
    // which satisfies the provided testing function (isIdCB, looks for dishes of same id as the one we want)
    // If no values satisfy the testing function, undefined is returned.
    function isIdCB(dish) {return dish.id == id}
    return dishesConst.find(isIdCB);  
    }}
    
    // Function which checks if an 'input' is undefined or null valued, if yes throw an error which will be catched
    // If not the input will just 'pass through'
    function check_undefined_null(dish){
        const msg= "I will not add an undefined dish to the menu";
        if(dish === undefined)
            throw new Error(msg);
        if(dish === null)
        throw new Error(msg);
        return;
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


// We want to create a 'starting class'
// Get some dishes to start off with
dish_1_full = DishSource.getDishDetails(1);
dish_202_full =DishSource.getDishDetails(202);
dish_2000_full =DishSource.getDishDetails(2000); // Gives undefined

// To instantiate a class object you write:
const obj = new DinnerModel(4, [dish_1_full, dish_202_full]);