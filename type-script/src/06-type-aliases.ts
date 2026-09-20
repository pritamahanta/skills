

// Type alias
type Point = {
    x : number;
    y : number;
};

let point: Point = {x : 10, y : 20}


// Type alias for premitivies 
type ID = string | number 

let userId : ID = "pritamahanta";
let useranotherId : ID = 1235;





// Type alias vs Interfaces 

/*
1. Interfaces can be extended but types can not 
2. Interfaces can be declared multiple times and will merge
3. Interfaces generally used for object shapes



*/