import sqlite3
import json 

#db related work
class DBWorker:
    def __init__(self):
        try:
            self.createDB()
            self.createTable()
        except:
            #we will throw the result later on 
            pass
        
    def dto(self,code,payload):
        data = {
            'code' : 0,
            'payload' : []
        }
        data['code'] = code
        data['payload'] = payload
        return data
        
    def createDB(self):
        self.conn = sqlite3.connect('test5.db')
        
    def createTable(self):
        self.conn.execute('''CREATE TABLE ASSETS (NAME TEXT NOT NULL)''');
        self.conn.commit() 
        
    def addAsset(self,asset):
        try:
            #self.check_db_init_or_throw()
            cursor = self.conn.execute("SELECT * FROM ASSETS WHERE NAME = ?", (asset,))
            data = cursor.fetchall()
            if  data != [] : 
                return self.dto(409,'Value exisits')
            self.conn.execute("INSERT INTO ASSETS (NAME) VALUES('"+asset+"')")
            self.conn.commit() 
            return self.dto(201,'Ok')
        except:        
            return self.dto(400,'addAsset Exception')

    def removeAsset(self,asset):
        try:
            #self.check_db_init_or_throw()
            cursor = self.conn.execute("SELECT * FROM ASSETS WHERE NAME = ?", (asset,))
            data = cursor.fetchall()
            if  data != [] :
                self.conn.execute("DELETE FROM ASSETS WHERE NAME = ?", (asset,))
                self.conn.commit()
                return self.dto(200,'Ok')
            else:
                return self.dto(200,'Asset does not exist')

        except Exception as e:
            return self.dto(400,'removeAsset Exception')


    def removeAll(self):
        try:
            self.conn.execute("DELETE FROM ASSETS")
            self.conn.commit()
            return self.dto(200,'Deleted all assets')
        except:
            return self.dto(400,'removeAll Exception')

    def getAssets(self):
        try:
            #self.check_db_init_or_throw()
            cursor = self.conn.execute("SELECT * FROM ASSETS")
            rows = cursor.fetchall()
            dt = []
            for row in rows:
                dt.append(row[0])
            return self.dto(200,dt)
        except:
            return self.dto(400,'getAssets Exception')

