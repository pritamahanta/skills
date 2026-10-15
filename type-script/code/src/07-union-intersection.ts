

// Union types (OR)
type Status = "pending" | "aprroved" | "rejected" ;

function setStatus(status : Status) : void {
    console.log (`${status}`) ;
}

setStatus("pending");


// Intersection types (AND)

interface Colorful {
    color : string 
}

interface Circle {
    radius : number
}

type ColorfulCircle = Colorful & Circle ;

let myCicle : ColorfulCircle = {
    color : "red",
    radius : 234
}
