from fastapi import Response, Request, FastAPI, Depends, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from typing import Dict, List, Optional
from db import select, insert, update, delete
import json
import jwt
import time
import hashlib
import uvicorn
import sqlite3

class JWTBearer(HTTPBearer):
	def __init__(self, auto_error: bool = True):
		super(JWTBearer, self).__init__(auto_error=auto_error)

	async def __call__(self, request: Request):
		credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
		if credentials:
			if not credentials.scheme == "Bearer":
				raise HTTPException(status_code=403, detail="Invalid authentication scheme.")
			if not self.verify_jwt(credentials.credentials):
				raise HTTPException(status_code=403, detail="Invalid token or expired token.")
			return credentials.credentials
		else:
			raise HTTPException(status_code=403, detail="Invalid authorization code.")

	def verify_jwt(self, jwtoken: str) -> bool:
		isTokenValid: bool = False
		try:
			payload = decodeJWT(jwtoken)
		except:
			payload = None
		if payload:
			isTokenValid = True
		return isTokenValid

JWT_SECRET = "DES422"
JWT_ALGORITHM = "HS256"

def signJWT(userName: str):
	payload = {"userName" :userName, "expires":time.time() + 1800}
	token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
	return {"token": token}

def decodeJWT(token: str) -> dict:
	try:
		decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
		return decoded_token if decoded_token["expires"] >= time.time() else None
	except:
		return {}

#schema
class userLoginSchema (BaseModel):
	username: str
	password: str

class contentSchema(BaseModel):
	title: str
	content: str
	file: list = []

# Hash password function
def hashPassword(password: str):
	f = open("salt.txt", "r")
	salt = f.read()
	f.close()
	newPassword = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
	return str(newPassword)

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
@app.get("/content/{contentType}")
async def get_content(contentType: str):
	data = []
	content = select("ContentID, title, content", "CONTENTS", "TYPE = '"+contentType+"'")
	for i in content:
		d = {}
		d['id'] = i[0]
		d['title'] = i[1]
		d['content'] = i[2]
		f = []
		file = select("ContentID, NAME, TYPE, PATH, DESCRIPTION", "FILES", "ContentID = '"+str(i[0])+"'")
		for j in file:
			fileDict = {}
			fileDict['name'] = j[1]
			fileDict['type'] = j[2]
			fileDict['path'] = j[3]
			fileDict['description'] = j[4]
			f.append(fileDict)
		d['file'] = f
		data.append(d)
	return data

@app.get("/content/{contentType}/{id}")
async def get_content(contentType: str, id: int):
	content = select("ContentID, title, content", "CONTENTS", "ContentID = "+str(id))
	content = content[0]
	d = {}
	d['id'] = content[0]
	d['title'] = content[1]
	d['content'] = content[2]
	f = []
	file = select("ContentID, NAME, TYPE, PATH, DESCRIPTION", "FILES", "ContentID = '"+str(content[0])+"'")
	for i in file:
		fileDict = {}
		fileDict['name'] = i[1]
		fileDict['type'] = i[2]
		fileDict['path'] = i[3]
		fileDict['description'] = i[4]
		f.append(fileDict)
	d['file'] = f
	return d

@app.post("/user/login")
async def post_login(user: userLoginSchema):
	users = select("USERNAME, PASSWORD", "USERS")
	for i in users:
		if user.username == i[0] and user.password == i[1]:
			return signJWT(user.username)
	return {"error": "Wrong login details"}

@app.post("/file/upload", status_code=201, dependencies=[Depends(JWTBearer())])
async def upload_file(files: List[UploadFile] = File(...)):
	fileList = []
	for i in files:
		if i:
			data = i.file.read()
			path = "files/"+str(time.time())+"_"+i.filename
			f = open("web/"+path, "wb")
			f.write(data)
			f.close()
			fileList.append({"name": i.filename,"path": path,"type": i.content_type})
	return fileList

@app.post("/content/add/{contentType}", dependencies=[Depends(JWTBearer())])
async def post_content(content: contentSchema, contentType: str):
	insert("CONTENTS", "TYPE, TITLE, CONTENT", "'"+contentType+"', '"+content.title+"', '"+content.content+"'")
	if content.file != []:
		id = str(select("ContentID", "CONTENTS")[-1][0])
		for i in range(len(content.file)):
			insert("files", "NAME, TYPE, PATH, DESCRIPTION, ContentID", "'"+content.file[i]['name']+"', '"+content.file[i]['type']+"', '"+content.file[i]['path']+"', '"+content.file[i]['description']+"', "+id)
	return {"result": "Content created"}

@app.get("/user/me", dependencies=[Depends(JWTBearer())])
def get_user(token: str = Depends(JWTBearer())):
	username = decodeJWT(token)['userName']
	return {"username": username}

@app.patch("/content/edit/{contentType}/{id}", dependencies=[Depends(JWTBearer())])
def update_content(content: contentSchema, contentType: str, id: int):
	update("CONTENTS", "TITLE = '"+content.title+"', CONTENT = '"+content.content+"'", "ContentID = "+str(id))
	for i in range(len(content.file)):
		if select("PATH", "FILES", "PATH = '"+content.file[i]['path']+"'") == []:
			insert("files", "NAME, TYPE, PATH, DESCRIPTION, ContentID", "'"+content.file[i]['name']+"', '"+content.file[i]['type']+"', '"+content.file[i]['path']+"', '"+content.file[i]['description']+"', "+str(id))
		elif select("PATH", "FILES", "PATH = '"+content.file[i]['path']+"'") != [[]]:
			print(select("PATH", "FILES", "PATH = '"+content.file[i]['path']+"'"))
			if select("PATH", "FILES", "PATH = '"+content.file[i]['path']+"'")[0][0] == content.file[i]['path']:
				update("FILES", "DESCRIPTION = '"+content.file[i]['description']+"'", "PATH = '"+content.files[i]['path']+"'")
			else:
				insert("files", "NAME, TYPE, PATH, DESCRIPTION, ContentID", "'"+content.file[i]['name']+"', '"+content.file[i]['type']+"', '"+content.file[i]['path']+"', '"+content.file[i]['description']+"', "+str(id))
	return {"result": "Content updated"}

@app.delete("/content/delete/{contentType}/{id}", dependencies=[Depends(JWTBearer())])
def delete_content(contentType: str, id: int):
	delete("CONTENTS", "ContentID = "+str(id))
	delete("FILES", "ContentID = "+str(id))
	return {"result": "Content deleted"}

@app.get("/")
def root():
	response = RedirectResponse(url="/home.html")
	return response

app.mount("/", StaticFiles(directory="web"), name="web")