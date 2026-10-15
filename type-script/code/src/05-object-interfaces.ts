
// Interface 
interface User {
    name : string,
    age : number,
    email? : string,
    readonly id : number // as it's readonlt we can't update it 
}


// Object type annotation
let user : User = {
    name : "Pritam",
    age : 22,
    id : 23
}

// user.id = 2  wrong as it's readonly



// Interface with methods

interface Product {
    name : string;
    price : number;
    review? : string;
    getDiscount(percent : number) : number; 
}

let laptop : Product = {
    name : "MacBook Pro",
    price : 234523,
    getDiscount(percent : number) : number {
        return this.price * (percent / 100) ;
    },
}