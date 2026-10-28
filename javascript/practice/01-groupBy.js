// Write a function that accepts an array and a callback, then groups each element under the key returned by that callback.

const users = [
  { name: "A", role: "admin" },
  { name: "B", role: "user" },
  { name: "C", role: "admin" },
];

const result = groupBy(users, user => user.role);


// Expected Result

// const users = [
//   { name: "A", role: "admin" },
//   { name: "B", role: "user" },
//   { name: "C", role: "admin" },
// ];

// const result = groupBy(users, user => user.role);


// SOLUTION 

function groupBy(array, callback) {
    const res = Object.create(null);

    for (const item of array) {
        const key = callback(item);

        if (!Object.hasOwn(res, key)) {
            res[key] = [];
        }

        res[key].push(item);
    }

    return res;
}
