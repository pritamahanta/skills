from pydantic import BaseModel


class employee(BaseModel):
    name: str
    age: int

employee_info = {
    "name": "Pritam", 
    "age": "23"   
}

employee1 = employee(**employee_info)


def insert_employee_into_db(employee1: employee):

    print(employee1.name)
    print(employee1.age) 
    print("Inserted into db")



def update_employee_into_db(employee1: employee):

    print(employee1.name)
    print(employee1.age) 
    print("Updated into db")


insert_employee_into_db(employee1)