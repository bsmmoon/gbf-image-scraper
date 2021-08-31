playable:
	node playable.js -> playable.json

npc-links:
	node npc-links.js -> npc-links.json

npc:
	node npc -> npc.json

format-npc:
	python formatter.py -> characters.json
