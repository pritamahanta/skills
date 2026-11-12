

def insert_into_db(name: str, age: int):

    if type(name) == str and type(age) == int:

        if age < 0:
            raise ValueError("Age can't be negative")
        
        print(name) 
        print(age)
        print("inserted into db")
    else:
        raise TypeError('Incorrect data type')


def update_into_db(name: str, age: int):

    if type(name) == str and type(age) == int:
        print(name) 
        print(age)
        print("Updated into db")
    else:
        raise TypeError('Incorrect data type')



insert_into_db("Pritam", "thirty")