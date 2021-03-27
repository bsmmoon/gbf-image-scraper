import json

data = {}
with open("output2") as f:
    f.readline() # remove first line
    for line in f:
        tokens = line.strip().split(" ")
        url, name, id = tokens[0], " ".join(tokens[1:-1]), tokens[-1]
        data[id] = name

print(json.dumps(data, indent=2))



