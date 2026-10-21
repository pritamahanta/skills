
const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("p1 success") ;
    }, 5000)
});

const p2 = new Promise((resolve, reject) => {
    setTimeout( function () {
        return reject("p2 fail") ;
    }, 1000);
});

const p3 = new Promise((resolve, reject) => {
    setTimeout( () => {
        return resolve("p3 success") ;
        return reject("p2 fail") ;
    }, 3000);
})


// Promise.all([p1, p2, p3]).then(
//     (res) => {
//         console.log(res) ;
//     }
// ).catch(
//     (error) => {
//         console.log(error) ;
//     }
// )

// Promise.allSettled([p1, p2, p3]).then(
//     (res) => {
//         console.log(res) ;
//     }
// ).catch(
//     (error) => {
//         console.log(error) ;
//     }
// )


// Promise.race([p1, p2, p3]).then(
//     (res) => {
//         console.log(res) ;
//     }
// ).catch(
//     (error) => {
//         console.log(error) ;
//     }
// )

Promise.any([p1, p2, p3]).then(
    (res) => {
        console.log(res) ;
    }
).catch(
    (err) => {
        console.log(err) ;
        
        // for aggregate errors
        console.log(err.errors)
    }
)
