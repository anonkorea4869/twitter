from fastapi import FastAPI, Form, Request
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

@app.get("/login")
def login(request : Request) :
    return templates.TemplateResponse("./html/login.html", {"request": request})

@app.get("/api/login")
def login(id : str, pw : str) :
    pass