from pydantic import BaseModel
from typing import List, Dict, Optional


class employee(BaseModel):
    name: str
    age: int
    weight: float 
    disable: bool = False 
    courses: List[str]
    contacts: Optional[Dict[str, str]] = None


employee_info = {
    "name": "Pritam", 
    "age": "23",
    "weight": 78.0,
    'courses': ["Physics", "Math", "Chemistry"],
    "Contacts": {"Phone": "123452", "Email": "alwkejnt@gmail.com"}
}

employee1 = employee(**employee_info)


def insert_employee_into_db(employee1: employee):

    print(employee1)

    # print(employee1.name)
    # print(employee1.age) 
    print("Inserted into db")



def update_employee_into_db(employee1: employee):

    print(employee1.name)
    print(employee1.age) 
    print("Updated into db")


insert_employee_into_db(employee1)