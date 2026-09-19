from fastapi import FastAPI, Path
from typing import Optional
from pydantic import BaseModel


app = FastAPI() 

students = {
    1: {
        "name" : "Pritam Mahanta",
        "age" : 22,
        "father": "Prabhat Mahanta",
        "mother": "Mithu Mahanta",
        "year" : "undergrade"
    },
    2: {
            "name" : "Anwesha Mahanta",
            "father": "Samir Roy",
            "Mother": "Sarmistha Roy",
            "age" : 20,
            "year" : "undergrade"
        },
    3:  {
        "name" : "Kal Mahanta",
        "age" : 3,
        "father": "Pritam Mahanta",
        "Mother": "Anwesha Mahanta", 
        "year" : "undergrade"
        }
}

class Student(BaseModel):
    name: str
    age: int 
    father : str
    mother : str
    year: str


@app.get("/") 
def index():
    return {"message" : "Big leagues are coming!!"}

@app.get("/get-all")
def get_all():
    return students

# path parameter
@app.get("/get-students/{student_id}")
def get_students_by_id(student_id: int = Path(description="The id of the student you want to view", gt=0, lt=3)):
    return students[student_id]

#query parameter
@app.get("/get-studnets-by-name")
def get_student(*, name: Optional[str] = None, test : int):
    for student_id in students:
        if students[student_id]["name"] == name :
            return students[student_id] 

    return {"message" : "Data not fonud"} 


@app.post("/create-student/{student_id}")
def create_student(student_id : int, student : Student) :
    if student_id in students :
        return {"Error" : "Student already exists"} 

    students[student_id] = student
    return {"message": "Student created successfully"}

  