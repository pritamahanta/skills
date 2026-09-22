const fs = require("fs")
const path = require("path")


const filePath = path.join(__dirname, "data.json") ;


/*

// two ways to read the data 

// Sync (simple, blocks the thread)
const data = fs.readFileSync(filePath, "utf-8") ;
console.log(data)


// Async (preferred in real apps)
fs.readFile(filePath, "utf-8", (err, data) => {
    if(err) throw err 
    console.log(data)
})


*/ 


// writing data

const newData = [
  {
    name: "Pritam",
    age: 22,
    role: "student",
    skills: ["C++", "JavaScript", "Node.js"],
    isActive: true
  },
  {
    name: "Rahul",
    age: 23,
    role: "developer",
    skills: ["Python", "React", "MongoDB"],
    isActive: true
  },
  {
    name: "Ananya",
    age: 21,
    role: "student",
    skills: ["Java", "SQL", "Spring"],
    isActive: false
  }
];

// it also has two ways to write

// Sync 

// Async 
fs.writeFile(filePath, JSON.stringify(newData, null, 2), (err) => {
    if(err) throw err ;
    console.log("Async write completed") ;
})

