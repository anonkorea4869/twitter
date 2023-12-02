from fastapi import FastAPI, Form, Request, Response, HTTPException, Cookie, APIRouter
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import mysql.connector
from datetime import datetime
import subprocess
from datetime import datetime
from pydantic import BaseModel
import random
import string
from fastapi.responses import JSONResponse

app = FastAPI()
app.mount("/frontend", StaticFiles(directory="frontend"), name="frontend")
templates = Jinja2Templates(directory='./frontend')

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

@app.get("/{site}.html")
def loadSite(request: Request, site: str) :
    return templates.TemplateResponse(f"./{site}.html", {"request": request})

def expiredSession(id) :
    sql.update(f"UPDATE session SET manual_expired = 1 WHERE session_id = '{id}'")

def getSession(id) :
    characters = string.ascii_letters + string.digits
    random_string = ''.join(random.choice(characters) for _ in range(128))
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    sql.insert(f"INSERT INTO session(session_id, session, init_time, last_time) VALUES('{id}', '{random_string}', '{current_time}', '{current_time}')")
    return random_string

def getSessionId(request : Request, session_key : str) :
    session_value = request.cookies.get(session_key)

    if session_value:
        result = sql.select(f"SELECT session_id FROM session WHERE session = '{session_value}' AND manual_expired = 0 ORDER BY last_time DESC LIMIT 1")
        return result[0]['session_id']
    else:
        return {"result": "Session value not found"}
        
def checkSession(request : Request, session_key : str) :
    session_value = request.cookies.get(session_key)
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # 세션 expired 확인
    sql.update(f"UPDATE session SET last_time = '{current_time}' WHERE session='{session_value}'")

@app.get("/api/session")
def session(request : Request) :
    session_id = getSessionId(request, "session")

    return {"result" : session_id}

@app.get("/api/login")
def login(response: Response, id : str, pw : str) :
    result1 = sql.select(f"SELECT count(*) as count FROM user WHERE id='{id}' AND pw ='{pw}'")

    if int(result1[0]['count']) != 0 : # 있으면
        expiredSession(id)
        session = getSession(id)
        response.set_cookie(key="session", value=session)
        return {"result": "success"}
    else :
        return {"result" : "fail"}

class Register(BaseModel) :
    id : str
    pw : str

@app.post("/api/register")
def register(request : Register) :
    try :
        result = sql.select(f"SELECT COUNT(*) as count FROM user WHERE id='{request.id}'")
        if int(result[0]['count']) != 0 :
            return {"result": "ID aready exists"}
        else : 
            sql.insert(f"INSERT INTO user(id, pw) VALUES('{request.id}', '{request.pw}')")
            return {"result": "success"}
    except :
         return {"result": "ID too long"}

@app.get("/api/article")
def getAllArticle(request: Request, skip:int, limit: int) :
    session_id = getSessionId(request, "session")
    result = sql.select(f"""SELECT A.idx, 
       A.user_id, 
       A.content, 
       A.time, 
       COUNT(B.idx) AS like_count,
       MAX(IF(B.like_id = '{session_id}', 1, 0)) AS user_liked
        FROM article A 
        LEFT JOIN article_like B ON A.idx = B.article_id
        GROUP BY A.idx, A.user_id, A.content, A.time
        ORDER BY A.time DESC
        LIMIT {skip}, {limit};
    """)
    return result

@app.get("/api/article/{user_id}")
def getAllArticle(request: Request, skip:int, limit: int, user_id: str) :
    session_id = getSessionId(request, "session")
    result = sql.select(f"""SELECT A.idx, 
       A.user_id, 
       A.content, 
       A.time, 
       COUNT(B.idx) AS like_count,
       MAX(IF(B.like_id = '{session_id}', 1, 0)) AS user_liked
        FROM article A 
        LEFT JOIN article_like B ON A.idx = B.article_id
        WHERE A.user_id = '{user_id}'
        GROUP BY A.idx, A.user_id, A.content, A.time
        ORDER BY A.time DESC
        LIMIT {skip}, {limit};
    """)
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

class UpdateArticle(BaseModel):
    content: str

@app.put("/api/article/{article_id}")
def updateArticle(request : Request, parameter: UpdateArticle, article_id : int) :
    session_id = getSessionId(request, "session")

    result = sql.select(f"SELECT COUNT(*) as count FROM article WHERE idx = {article_id} AND user_id = '{session_id}'")

    if result[0]['count'] != 0 :
        sql.update(f"UPDATE article SET content = '{parameter.content}' WHERE idx = {article_id} AND user_id = '{session_id}'")
        return {"result" : "success"}
    else : 
        return {"result" : "fail"}

@app.delete("/api/article/{article_id}")
def deleteArticle(request : Request, article_id : int) :
    session_id = getSessionId(request, "session")

    result = sql.select(f"SELECT COUNT(*) as count FROM article WHERE idx = {article_id} AND user_id = '{session_id}'")

    if result[0]['count'] != 0 :
        sql.delete(f"DELETE FROM article WHERE idx = '{article_id}' AND user_id='{session_id}'")
        return {"result" : "success"}
    else : 
        return {"result" : "fail"}

@app.get("/api/article/like/{article_id}")
def getArticleLikeCount(article_id : int) :
    result = sql.select(f"SELECT COUNT(*) as count FROM article_like WHERE article_id={article_id}")
    
    return {"result" : result[0]['count']}

@app.post("/api/article/like/{article_id}")
def articleLike(request : Request, article_id : int) :
    session_id = getSessionId(request, "session")

    result = sql.select(f"SELECT COUNT(*) as count FROM article_like WHERE article_id={article_id} AND like_id='{session_id}'")
    
    if result[0]['count'] == 0 :
        sql.insert(f"INSERT INTO article_like(article_id, like_id) VALUES ({article_id}, '{session_id}')")
        return {"result" : "like"}
    else : 
        sql.delete(f"DELETE FROM article_like WHERE article_id={article_id} AND like_id='{session_id}'")
        return {"result" : "dislike"}

@app.get("/api/comment/{article_id}")
def getUserComment(article_id: int) :
    result = sql.select(f"SELECT * FROM comment WHERE article_id = {article_id} ORDER BY time DESC")
    return result

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

class UpdateComment(BaseModel):
    content: str

@app.put("/api/comment/{comment_id}")
def updateComment(request : Request, parameter: UpdateComment, comment_id : int) :
    session_id = getSessionId(request, "session")

    result = sql.select(f"SELECT COUNT(*) as count FROM comment WHERE idx = {comment_id} AND user_id = '{session_id}'")

    if result[0]['count'] != 0 :
        sql.update(f"UPDATE comment SET content = '{parameter.content}' WHERE idx = {comment_id} AND user_id = '{session_id}'")
        return {"result" : "success"}
    else : 
        return {"result" : "fail"}

@app.delete("/api/comment/{comment_id}")
def insertArticle(request : Request, comment_id : int) :
    session_id = getSessionId(request, "session")

    result = sql.select(f"SELECT COUNT(*) as count FROM comment WHERE idx = {comment_id} AND user_id = '{session_id}'")

    if result[0]['count'] != 0 :
        sql.delete(f"DELETE FROM comment WHERE idx = '{comment_id}' AND user_id='{session_id}'")
        return {"result" : "success"}
    else : 
        return {"result" : "fail"}

@app.get("/api/comment/like/{comment_id}")
def getCommentLikeCount(comment_id : int) :
    result = sql.select(f"SELECT COUNT(*) as count FROM comment_like WHERE comment_id={comment_id}")
    
    return {"result" : result[0]['count']}

@app.post("/api/comment/like/{comment_id}")
def articleLike(request : Request, comment_id : int) :
    session_id = getSessionId(request, "session")

    result = sql.select(f"SELECT COUNT(*) as count FROM comment_like WHERE comment_id={comment_id} AND like_id='{session_id}'")
    
    if result[0]['count'] == 0 :
        sql.insert(f"INSERT INTO comment_like(comment_id, like_id) VALUES ({comment_id}, '{session_id}')")
        return {"result" : "like"}
    else : 
        sql.delete(f"DELETE FROM comment_like WHERE comment_id={comment_id} AND like_id='{session_id}'")
        return {"result" : "dislike"}

@app.get("/api/follow/{user_id}")
def getFolloweCount(request : Request, user_id : str) :
    
    return {"follower_count" : 1, "following_count" : 2}

    follower_count = sql.select(f"SELECT COUNT(*) FROM follow WHERE follower_id = '{user_id}'")
    following_count = sql.select(f"SELECT COUNT(*) as following_count FROM follow WHERE following_id = '{user_id}'")
    return {"follower_count" : 2, "following_count" : 1}

@app.get("/api/follow/check/{user_id}")
def followed(request : Request, user_id : str) :
    session_id = getSessionId(request, "session")
    result = sql.select(f"SELECT count(*) as is_follwed FROM follow WHERE follower_id='{session_id}' AND following_id='{user_id}'")

    return {"result" : result[0]['is_follwed']}

@app.post("/api/follow/{following_id}")
def follow(request : Request, following_id : str) :
    session_id = getSessionId(request, "session")

    result = sql.select(f"SELECT COUNT(*) as count FROM follow WHERE follower_id='{session_id}' AND following_id='{following_id}'")
    
    if result[0]['count'] == 0 :
        sql.insert(f"INSERT INTO follow(follower_id, following_id) VALUES ('{session_id}', '{following_id}')")
        return {"result" : "follow"}
    else : 
        sql.delete(f"DELETE FROM follow WHERE follower_id='{session_id}' AND following_id='{following_id}'")
        return {"result" : "unfollow"}

@app.get("/api/explore")
def getAllUserId(request : Request, skip: int, limit: int) :
    result = sql.select(f"SELECT id FROM user ORDER BY id LIMIT {skip}, {limit}")

    return result

@app.get("/api/explore/{keyword}")
def getUserIdForKeyword(request : Request, keyword: str, skip: int, limit: int) :
    result = sql.select(f"SELECT id FROM user WHERE id LIKE '%{keyword}%' ORDER BY id LIMIT {skip}, {limit}")

    return result