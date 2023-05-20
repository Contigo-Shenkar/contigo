import json

def get_conditions():
    with open('data.json', 'r') as f:
        # load the JSON data into a dictionary
        data = json.load(f)
    return list(data.keys())

def get_medication(condition):
    with open('data.json', 'r') as f:
        # load the JSON data into a dictionary
        data = json.load(f)
    return(list(data[condition].keys()))

# print(get_medication("ADHD"))
# print(get_conditions())