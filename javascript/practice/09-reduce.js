

// const reduce = function customReduce(arr, callback, args) {

    
// }


const promise = fetch("https://www.youtube.com/") ;

console.log(promise)

promise.then(
    (response) => {
        console.log(response) ;
    }
).catch((error) => {
    console.log(error)
})