
// manually creating elements

// create a h1 element using js

const element1 = document.createElement("h1") ;
element1.textContent = "Namaste React" ;
element1.className = "element1" ;
element1.id = "first" ;

// let's add some properties in it 

element1.style.backgroundColor = "white";
element1.style.color = "black";
element1.style.fontSize = "30px"


// now manually creating anoter element 

const element2 = document.createElement("h2") ;
element2.textContent = "I am element2" ;
element2.className = "element2" ;
element2.id = "second" ;

// now again adding a bit styles
element2.style.backgroundColor = "white" ;
element2.style.color = "black" ;
element2.fontSize = "30px" ;


// now let's catch the root for appending the elements

const root = document.getElementById("root") ;
root.append(element1) ;
root.append(element2) ;



// now let's create a function to get rid from this manual repeated tasks

function createElement(tag, att, child) {
    const element = document.createElement(tag) ;   

    for(key in att) {

        if(key == style)
        element[key] = att[key]
    }
    return element ;
}