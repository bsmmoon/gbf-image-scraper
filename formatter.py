import json

npc = {}
with open("npc.json") as f:
    f.readline() # remove first line
    for line in f:
        tokens = line.strip().split(" ")
        url, name, id = tokens[0], " ".join(tokens[1:-1]), tokens[-1]
        npc[id] = name

with open("playable.json") as f:
    playable = json.loads(f.read())
    characters = { **playable, "NPC": npc }

print(json.dumps(characters, indent=2))
