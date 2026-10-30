
/*
Write a function that caches the result of an expensive function so that repeated calls with the same 
arguments don't execute the original function again.

Example:
function square(n) {
    console.log("Computing...");
    return n * n;
}

const memoizedSquare = memoize(square);

console.log(memoizedSquare(5)); // Computing... 25
console.log(memoizedSquare(5)); // 25 (cached)
console.log(memoizedSquare(4)); // Computing... 16


Requirements:
1. Use closures.
2. Store previously computed results.
3. Return cached results for repeated arguments.
4. Do not execute the original function unnecessarily.
*/

function square(n) {
    console.log("Computing..." ) ;
    return n * n ;
}

const memoize = (fn) => {
    const map = new Map() ;

    return (...args) => {

        const n = args[0] ;      
        if(map.has(n)) {
            console.log("Fetching from cache...");
            return map.get(n) ;
        }

        const context = this ;
        const square = fn.apply(context, args);

        map.set(n, square) ;
        return square ;
    }
}

function square(n) {
    console.log("Computing...");
    return n * n;
}

const cachedSquare = memoize(square);

console.log(cachedSquare(5));
console.log(cachedSquare(5));
console.log(cachedSquare(4));