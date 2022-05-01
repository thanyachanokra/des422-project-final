import sqlite3
# Connect to database
conn = sqlite3.connect("test.sqlite")
#Add user
f = open("users.txt", "r")
data = f.read()
f.close()
data = data.split("\n")
for user in data:
	user = user.split("\t")
	print(user[0]+" "+user[1])
	conn.execute("INSERT INTO USERS(USERNAME, PASSWORD) VALUES ('"+user[0]+"', '"+user[1]+"');")
conn.commit()
# Close connection
conn.close()