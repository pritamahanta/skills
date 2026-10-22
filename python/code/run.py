
a = [0, 1, 2, 3]


# print(a[-1:-1:-1])
# print(len(a))

# a.append(4) 
# a.extend([5, 6])
a.insert(3, 1)

# print(a)

# a.remove(1)
# print(a)

# print(a.pop(), a)
# a.sort() 
# print(a)


b = (5, 3, 2, 1)

# print(b, type(b))

def min_max(b):
    return min(b), max(b)

low, high = min_max(b) 

# print(low, high)


user = {
    "name" : "pritam", 
    "age" : 22
}

print(user, user["name"])

user["city"] = "Siliguri"

print(user)