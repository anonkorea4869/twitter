from fastapi import FastAPI, Form, Request, Response, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import mysql.connector
from datetime import datetime
import requests
import os
import re
import subprocess
import asyncio
import base64
import subprocess
from datetime import datetime

app = FastAPI()
templates = Jinja2Templates(directory='./')

# 정적 파일 디렉토리를 설정
# app.mount("/thumbnail", StaticFiles(directory="/Users/anonkorea4869/Library/Mobile Documents/com~apple~CloudDocs/HTML/code/thumbnail/"), name="thumbnail")

class SQL:
    def __init__(self):
        self.db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="0000",
        database="twitter"
    )

    def select(self, sql):
        cursor = self.db.cursor(dictionary=True)
        cursor.execute(sql)
        data = cursor.fetchall()
        cursor.close()
        return data

    def insert(self, sql):
        cursor = self.db.cursor(dictionary=True)
        cursor.execute(sql)
        self.db.commit()
        cursor.close()

    def update(self, sql):
        self.insert(sql)

    def close(self):
        self.db.close()

sql = SQL()

@app.get("/login")
def login(request : Request) :
    return templates.TemplateResponse("./html/login.html", {"request": request})

@app.get("/register")
def login(request : Request) :
    return templates.TemplateResponse("./html/register.html", {"request": request})

@app.get("/post")
def login(request : Request) :
    return templates.TemplateResponse("./html/post.html", {"request": request})

def getSession(request : Request, session_key : str) :
    session_value = request.cookies.get(session_key)

    if session_value:
        return session_value
    else:
        return {"message": "Session value not found"}


@app.get("/api/login")
def login(response: Response, id : str, pw : str) :
    result1 = sql.select(f"SELECT count(*) as count FROM user WHERE id='{id}' AND pw ='{pw}'")

    if int(result1[0]['count']) != 0 : # 있으면
        response.set_cookie(key="session", value=f"{id}")
        return {"result": "success"}
    else :
        return {"result" : "fail"}

@app.get("/api/register")
def login(id : str, pw : str) :
    result1 = sql.select(f"SELECT count(*) as count FROM user WHERE id='{id}'")

    if int(result1[0]['count']) != 0 :
        return {"result" : "fail"}
    else : 
        sql.insert(f"INSERT INTO user(id, pw) VALUES('{id}', '{pw}')")
        return {"result" : "success"}

@app.get("/api/post")
def post(request : Request, content : str) :
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    id = getSession(request, 'session')

    try : 
        sql.insert(f"INSERT INTO post (writter_id, content, time) VALUES('{id}', '{content}', '{current_time}')")
        return {"result" : "success"}
    except : 
        return {"result" : "fail"}