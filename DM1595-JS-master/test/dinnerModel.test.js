const assert = chai.assert;
const expect = chai.expect;

describe("DinnerModel", function testDinnerModelCB() {
    function removeComments(m){ return m.toString().replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ""); }
    const assignment= /[_$a-zA-Z\xA0-\uFFFF][_\.$a-zA-Z0-9\xA0-\uFFFF]*\s*=[^=><]/g;
    
    function noDishSource(m){
        expect(/DishSource/g.test(removeComments(m)), 
               "DinnerModel may not use DishSource").to.equal(false);
    }

    function noAssignment(m, one=false){
        it(m.name+" functional: "+(one?"a single assignment, to this.dishes":"no assignments "), function noAssignmentTestCB(){
            const matches= [...removeComments(m).matchAll(assignment)];
            if(one){
                expect(matches.length, "may only assign this.dishes, once. It uses assignments: "+matches).to.equal(1);
                expect(matches[0][0], "may only assign this.dishes, once").to.be.a('string');
                expect(/^this.dishes\s*=/g.test(matches[0][0]), "may only assign this.dishes, once").to.equal(true);
            }else{
                expect(matches.length, "may not use assignments. It uses "+matches).to.equal(0);
            }
            
        });
    }
    
    const testFunctional = method =>      
          it(method.name+" functional: no procedural statements or mutable methods", function testFunctionalTestCB(){
              expect(/(var\s+|let\s+|for\s*\(|while\s*\(|if\s*\(|push\s*\(|splice\s*\(|unshift\s*\(|pop\s*\(|shift\s*\()/g
                     .test(removeComments(method)), 
                     `
Implementation should be functional and therefore not include statements like: 
'let', 'var', 'for', 'while', 'if' 
or mutable array methods like: 
'push', 'pop', 'unshift', 'shift', 'splice'

`).to.equal(false);
          });


    this.timeout(200000);  // increase to allow debugging during the test run
    let model = new DinnerModel();
    
    beforeEach(function beforeEachTestCB() {
        model = new DinnerModel();
    });

    describe("W1 number of guests", function numberOfGuestsSuiteCB() {
        it("default number of guests is 2", function numberOfGuestsDefaultCB() {
            expect(model.getNumberOfGuests()).to.equal(2);
        });
                   

        it("can set and get number of guests", function getSetNumberOfGuestsCB() {
            model.setNumberOfGuests(1);
            expect(model.getNumberOfGuests()).to.equal(1);
            
            model.setNumberOfGuests(3);
            expect(model.getNumberOfGuests()).to.equal(3);
        });

        it("number of guests is a positive integer", function numberOfGuestsPositiveIntegerTestCB() {
            model.setNumberOfGuests(1);
            expect(model.getNumberOfGuests()).to.equal(1);
            model.setNumberOfGuests(2);
            expect(model.getNumberOfGuests()).to.equal(2);

            const msg= "number of guests not a positive integer";
            
            
            expect(function testThrowZeroCB(){model.setNumberOfGuests(0); }).to.throw(msg);
            expect(function testThrowRealCB(){model.setNumberOfGuests(3.14159265);}).to.throw(msg);
            expect(function testThrowNegativeCB(){model.setNumberOfGuests(-1);}).to.throw(msg);
        });
    });
    
    describe("W1 getting individual dishes", function getIndividualDishesSuiteCB() {
        it("gets the correct dish", function getDishTestCB() {
            const dish1 = DishSource.getDishDetails(1);
            expect(dish1.id).to.equal(1);
            expect(dish1.name).to.equal("French toast");
            
            const dish100 = DishSource.getDishDetails(100);
            expect(dish100.id).to.equal(100);
            expect(dish100.name).to.equal("Meat balls");
        });
        
        it("returns undefined if dish is not found", function dishNotFoundTestCB() {
            const result1 = DishSource.getDishDetails(-1);
            expect(result1).to.equal(undefined);
            
            const result2 = DishSource.getDishDetails();
            expect(result2).to.equal(undefined);
        });
    });
    
    describe("W1 menu", function menuSuiteCB() {
        it("can add dishes", function canAddDishesTestCB() {
            noDishSource(model.addToMenu);
            model.addToMenu(DishSource.getDishDetails(1));
            expect(model.getMenu()).to.include(DishSource.getDishDetails(1));
            expect(model.dishes.length).to.equal(1);
            
            model.addToMenu(DishSource.getDishDetails(100));
            expect(model.getMenu()).to.include(DishSource.getDishDetails(1));
            expect(model.getMenu()).to.include(DishSource.getDishDetails(100));
            expect(model.dishes.length).to.equal(2);
        });
        
        it("overwrites dishes of the same type when adding", function dishOfSameTypeTestCB() {
            model.addToMenu(DishSource.getDishDetails(200));
            model.addToMenu(DishSource.getDishDetails(1));
            model.addToMenu(DishSource.getDishDetails(100));
            expect(model.getMenu()).to.include(DishSource.getDishDetails(1));
            expect(model.getMenu()).to.include(DishSource.getDishDetails(100));
            expect(model.getMenu()).to.include(DishSource.getDishDetails(200));
            expect(model.dishes.length).to.equal(3);
            
            model.addToMenu(DishSource.getDishDetails(2));
            // the old starter dish should no longer exist
            expect(model.getMenu()).to.not.include(DishSource.getDishDetails(1));
            // the new dish should exist
            expect(model.getMenu()).to.include(DishSource.getDishDetails(2));
            expect(model.getMenu()).to.include(DishSource.getDishDetails(200));
            expect(model.getMenu()).to.include(DishSource.getDishDetails(100));
            expect(model.dishes.length).to.equal(3);
        });
        
        it("can remove dishes", function removeDishTestCB() {
            noDishSource(model.removeFromMenu);
            model.addToMenu(DishSource.getDishDetails(100));
            model.addToMenu(DishSource.getDishDetails(1));
            model.addToMenu(DishSource.getDishDetails(200));
            expect(model.dishes.length).to.equal(3);
            
            // dish 1 should be in the menu
            expect(model.getMenu()).to.include(DishSource.getDishDetails(1));
            expect(model.getMenu()).to.include(DishSource.getDishDetails(100));
            expect(model.getMenu()).to.include(DishSource.getDishDetails(200));
            
            model.removeFromMenu({id:1});
            // should now be removed
            expect(model.getMenu()).to.not.include(DishSource.getDishDetails(1));

            expect(model.dishes.length).to.equal(2);
            expect(model.getMenu()).to.include(DishSource.getDishDetails(100));
            expect(model.getMenu()).to.include(DishSource.getDishDetails(200));

            // remove non-existing dish
            model.removeFromMenu({id:256});
            expect(model.dishes.length).to.equal(2);
            expect(model.getMenu()).to.include(DishSource.getDishDetails(100));
            expect(model.getMenu()).to.include(DishSource.getDishDetails(200));
        });

        it("dish of type", function dishOfTypeTestCB() {
            noDishSource(model.getDishOfType);
            model.addToMenu(DishSource.getDishDetails(2));
            model.addToMenu(DishSource.getDishDetails(100));
            model.addToMenu(DishSource.getDishDetails(200));
            expect(model.dishes.length).to.equal(3);
            expect(model.getMenu()).to.include(DishSource.getDishDetails(2));
            expect(model.getMenu()).to.include(DishSource.getDishDetails(200));
            expect(model.getMenu()).to.include(DishSource.getDishDetails(100));
            expect(model.getDishOfType(DishSource.getDishDetails(2).type)).to.equal(DishSource.getDishDetails(2));
            expect(model.getDishOfType(DishSource.getDishDetails(100).type)).to.equal(DishSource.getDishDetails(100));
            expect(model.getDishOfType(DishSource.getDishDetails(200).type)).to.equal(DishSource.getDishDetails(200));
        });
    });

    
    describe("W2: make W1 methods functional", function w1MethodsFunctionalSuiteCB() {
        testFunctional(DishSource.getDishDetails);
        noAssignment(DishSource.getDishDetails);

        testFunctional(model.addToMenu);
        noAssignment(model.addToMenu, true);

        testFunctional(model.removeFromMenu);
        noAssignment(model.removeFromMenu, true);
        
        testFunctional(model.getDishOfType);
        noAssignment(model.getDishOfType);
    });

    describe("W2 immutable state", function w2ImmutableStateSuiteCB() {
        it("addToMenu creates new dish array", function immutableAddToMenuTestCB() {
            const x= model.dishes;
            model.addToMenu(DishSource.getDishDetails(1));
            expect(model.dishes).to.not.equal(x);
        });
        it("removeFromMenu creates new dish array", function imutableRemoveFromMenuTestCB() {
            model.addToMenu(DishSource.getDishDetails(1));
            const x= model.dishes;
            model.removeFromMenu({id:1});
            expect(model.dishes).to.not.equal(x);
        });
        it("getMenu returns a copy, so the caller cannot mutate the model dish array", function getMenuReturnsCopyTestCB() {
            model.addToMenu(DishSource.getDishDetails(1));
            expect(model.getMenu()).to.not.equal(model.dishes);
        });
        
    });
    describe("W2 searching dishes", function w2SearchDishesSuiteCB() {
        it("returns all dishes if no search criteria are specified", function allDishesReturnedIfNoSearchCriteriaCB() {
            const allDishes = DishSource.searchDishes({});
            expect(allDishes.length).to.equal(11);
        });
        
        it("returns the correct dish type", function correctDishOfTypeTestCB() {
            let dishes = DishSource.searchDishes({type:"starter"});
            const onlyHasStarters = dishes.every(function isStarterCB(dish){ return dish.type === "starter";});
            expect(onlyHasStarters).to.equal(true);
            
            dishes = DishSource.searchDishes({type: "main course"});
            const onlyHasMain = dishes.every(function isMainCourseCB(dish){return dish.type === "main course";});
            expect(onlyHasMain).to.equal(true);
        });
        
        it("filters with keywords", function filterWithKeywordsTestCB() {
            let dishes = DishSource.searchDishes({type:"", query:"French"});
            let allDishesMatch = dishes.every(function nameIncludesToastCB(dish){ return dish.name.includes("French");});
            expect(dishes.length).to.be.above(0);
            expect(allDishesMatch).to.equal(true);
            
            dishes = DishSource.searchDishes({type:"", query:"Meat"});
            allDishesMatch = dishes.every(function nameIncludesMeatCB(dish){return dish.name.includes("Meat");});
            expect(dishes.length).to.be.above(0);
            expect(allDishesMatch).to.equal(true);
        });
        
        it("returns correct dishes with filter and type", function correctDishesWithFilterAndTypeCB() {
            const dishes = DishSource.searchDishes({type:"starter", query:"Sour"});
            const allDishesMatch = dishes.every(
                function sourStarterCB(dish){ return dish.name.includes("Sour") && dish.type === "starter";}
            );
            expect(dishes.length).to.be.above(0);
            expect(allDishesMatch).to.equal(true);
        });

        testFunctional(DishSource.searchDishes);
        noAssignment(DishSource.searchDishes);
    });
    
    describe("W2 totals", function w2TotalsSuiteCB() {
        it("dish price", function dishPriceTestCB() {
            noDishSource(model.getDishPrice);
            expect(model.getDishPrice(DishSource.getDishDetails(2))).to.equal(52);
            expect(model.getDishPrice(DishSource.getDishDetails(100))).to.equal(2559.5);
        });
        testFunctional(model.getDishPrice);
        noAssignment(model.getDishPrice);
        it("total price", function totalPriceTestCB() {
            noDishSource(model.getDinnerPrice);
            model.addToMenu(DishSource.getDishDetails(2));
            model.addToMenu(DishSource.getDishDetails(100));
            expect(model.getDinnerPrice()).to.equal(2*(52+2559.5));
        });
        testFunctional(model.getDinnerPrice);
        noAssignment(model.getDinnerPrice);
        it("ingredients", function ingredientsTestCB() {
            noDishSource(model.getIngredients);
            model.addToMenu(DishSource.getDishDetails(2));
            model.addToMenu(DishSource.getDishDetails(100));
            expect(model.getIngredients()).to.include.deep.members([{quantity: 5, price: 10, name: "eggs", unit:''}]);
            expect(model.getIngredients()).to.include.deep.members([{quantity: 80, price: 0, name: "water", unit:'ml'}]);
        });
        testFunctional(model.getIngredients);
    });

    function testPromise(text, p){
        it(text, async function testPromiseACB(){
            let start = new Date();
            let dish1=await p();
            let finish=new Date();
            expect(finish-start, "promise getDishDetails should take minimum 2 ms").to.be.above(2);
            expect(dish1.id).to.equal(2);
            expect(dish1.name).to.equal("Sourdough starter");
        }).timeout(2000);
    }
    
    describe("W2 async", function w2AsyncSuiteCB() {        
        testPromise("getDishDetails promise", function testDishDetailsPromiseACB(){ return DishSource.getDishDetailsPromise(2);});
    });
    
    describe("Advanced (bonus)", function bonusSuiteCB() {
        noAssignment(model.getIngredients);
        it("getDishDetails promise must reject if the dish with the given ID does not exist", async function promiseRejectTestACB(){
            try{
                const x= await new Promise(function executorCB(resolve, reject){return DishSource.getDishDetailsPromise(-1).then(reject, resolve);});
                expect(x).to.not.be.null;
            }
            catch(e){assert.fail("the promise did not reject");}
        }).timeout(2000);
    });
    describe("Advanced-optional", function advancedOptionalSuiteCB() {
        testFunctional(DishSource.getDishDetailsPromise);
        noAssignment(DishSource.getDishDetailsPromise);
    });
});

