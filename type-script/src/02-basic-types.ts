

// Primitives
let username : string = "Hello world"
let age : number = 1234
let isAdmin : boolean = true ;


// Arrays 
let numbers : number[] = [1, 2, 3] 
let strings : string[] = ["awe", "Awgew", "Aw44g"]


// Tuples 
let person : [string, number] = ["Pritam", 22]


// Enum
enum Color {
    Red, 
    Green, 
    Blue 
}

let favColor : Color = Color.Red


// Any type (Avoid when possible)
let randomValue : any = "Pritam"
randomValue = 22 
randomValue = true 


// Unknown (generally considered safer / better than any)
let unknown : unknown = 235
unknown = "Pritam"
unknown = true


// TypeScript functions 


// void function 
function subscribe(message : string) : void {
    console.log(message)
}