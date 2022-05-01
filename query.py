import sqlite3
conn = sqlite3.connect("test.sqlite")
data = conn.execute("SELECT DESCRIPTION FROM FILES")
for row in data:
	for j in row:
		print(j)
conn.close()