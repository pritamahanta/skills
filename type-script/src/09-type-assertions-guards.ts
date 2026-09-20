

// Type assertions 

let someValue : unknown = "Subscribe to RoadsideCode" ;


// error 
// let strLength : number = (someValue ).length ; as type is unknown

// one way
let strLength1 : number = (someValue as string).length ;

// another way 
let strlength2 : number = (<string> someValue).length ;



// Type guards
 
function processValue (value : string | number) : void {
    
    if(typeof(value) === "string") {
        
        // typesrcript is smart enough, now it knows that value is a string 
        // so it will provide all the string methods 
        console.log(value.concat) ;
    }
    else {

        // lly here for number as well 
        console.log(value.toLocaleString) ;
    }
}


// instance of typeguard 

class Dog {
    bark() {
        console.log("bark!!") ;
    }
}

class Cat {
    meow() {
        console.log("meow!!") ;
    }
}

function makeSound(animal : Dog | Cat) : void {

    if(animal instanceof Dog) {
        // we could access Dog stuffs here
    }
    else {
        // we could access Cat stuffs here
    }
}