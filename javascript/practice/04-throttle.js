



// let we have an expensive function 


const betterExpensive = throttle(expensive, limit) ;


const throttle = (expFn, limit) => {
    let flag = true ;

    return function(...args) {
        let context = this ;

        if(flag) {
            expFn.apply(context, args) ;
            flag = false ;

            setTimeout(() => {
                flag = true ;
            }, limit) ;
        }
    }
}