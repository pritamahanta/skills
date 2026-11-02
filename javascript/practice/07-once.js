/*
Implement a function once(fn) that ensures the provided function executes at most once, 
regardless of how many times the returned function is called.

The first call should execute the original function and return its result. Every subsequent call 
should return the same result without executing the original function again.
*/



function expensive() {
    console.log("Executing...");
    return 100;
}


// method 1: using maps 

const once = (fn) => {
    
    const map = new Map();

    return (...args) => {

        if(map.has(fn)) {
            return map.get(fn) ;
        }   

        console.log("Computing...")
        const res = fn.apply(this, args) ;
        map.set(fn, res) ;
        return res ;
    }
}


// optimised method 2: 

function once(fn) {
    let called = false;
    let result;

    return function (...args) {
        if (called) {
            return result;
        }

        called = true;
        result = fn.apply(this, args);

        return result;
    };
}


const onceFn = once(expensive);
