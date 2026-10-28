//  Write a function flattenArray(arr) that flattens an array of arbitrary nesting depth 
// without using .flat() or external libraries.


flattenArray([1, [2, [3, 4]], 5]);
// [1, 2, 3, 4, 5]

flattenArray([[], [1, []], 2]);
// [1, 2]


// Method 1: Recursive Approach (Custom Function)

function flattenArray(array) {

    let res = []

    for(const item of array) {
        
        if(Array.isArray(item)) {
            res = res.concat(flattenArray(item)) ;
        }
        else res.push(item) ;
    }

    return res ;
}

const arr = flattenArray([1, [2, [3, 4]], 5]);

console.log(arr)


// Method 2: Concise Recursive  (Using reduce)

function flattenArray(array) {
    return array.reduce((acc, val) => {
        return acc.concat(
            Array.isArray(val) ? flattenArray(val) : val
        );
    }, []);
}

// Modern Alternative: Native Array.prototype.flat()

const nested = [1, [2, [3, 4]], 5];

const result = nested.flat(Infinity);
console.log(result); // [1, 2, 3, 4, 5]
