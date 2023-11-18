from fastapi import FastAPI, Form, Request, Response, HTTPException, Cookie, APIRouter
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
from pydantic import BaseModel

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

    def delete(self, sql) : 
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

def getSessionId(request : Request, session_key : str) :
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
    result1 = sql.select(f"SELECT COUNT(*) as count FROM user WHERE id='{id}'")

    if int(result1[0]['count']) != 0 :
        return {"result" : "fail"}
    else : 
        sql.insert(f"INSERT INTO user(id, pw) VALUES('{id}', '{pw}')")
        return {"result" : "success"}

@app.get("/api/article")
def getAllArticle() :
    result = sql.select(f"SELECT user_id, content, time FROM article ORDER BY time DESC")
    return result

@app.get("/api/article/{user_id}")
def getUserArticle(user_id: int) :
    result = sql.select(f"SELECT user_id, content, time FROM article WHERE user_id = {user_id} ORDER BY time DESC")
    return result

class InsertArticle(BaseModel):
    content: str

@app.post("/api/article")
def insertArticle(request : Request, parameter: InsertArticle) :
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    session_id = getSessionId(request, "session")

    try : 
        sql.insert(f"INSERT INTO article (user_id, content, time) VALUES('{session_id}', '{parameter.content}', '{current_time}')")
        return {"result" : "success"}
    except : 
        return {"result" : "fail"}

@app.delete("/api/article/{article_id}")
def insertArticle(request : Request, article_id : int) :
    session_id = getSessionId(request, "session")

    sql.delete(f"DELETE FROM article WHERE idx = '{article_id}' AND user_id='{session_id}'")
    return {"result" : "success"}

@app.get("/api/article/like/{article_id}")
def getArticleLike(article_id : int) :
    result = sql.select(f"SELECT COUNT(*) as count FROM article_like WHERE article_id={article_id}")
    
    return {"result" : result[0]['count']}

@app.post("/api/article/like/{article_id}")
def articleLike(request : Request, article_id : int) :
    session_id = getSessionId(request, "session")

    result = sql.select(f"SELECT COUNT(*) as count FROM article_like WHERE article_id={article_id} AND like_id='{session_id}'")
    
    if result[0]['count'] == 0 :
        sql.insert(f"INSERT INTO article_like(like_id, article_id) VALUES ('{session_id}', {article_id})")
        return {"result" : "like"}
    else : 
        sql.delete(f"DELETE FROM article_like WHERE article_id={article_id} AND like_id='{session_id}'")
        return {"result" : "dislike"}

class InsertComment(BaseModel):
    content: str
    
@app.post("/api/comment/{article_id}")
def insertComment(request : Request, parameter: InsertComment, article_id : int) :
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    session_id = getSessionId(request, "session")

    try : 
        sql.insert(f"INSERT INTO comment (article_id, user_id, content, time) VALUES({article_id}, '{session_id}', '{parameter.content}', '{current_time}')")
        return {"result" : "success"}
    except : 
        return {"result" : "fail"}