

const filter = function customFilter(arr, callback, args) {

    if (arr == null) {
        throw new TypeError('Array.prototype.filter called on null or undefined');
    }

    const obj = Object(arr) ;
    const len = arr.length >>> 0 ;
    const filterArr = [];

    for(let i = 0; i < len ; i++) {

        if(i in obj) {
            const elem = obj[i] ;

            if(callback.call(args, elem, i, obj)) {
                filterArr.push(elem) ;
            }
        }
    }
    return filterArr ;
}

