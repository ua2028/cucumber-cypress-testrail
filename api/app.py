import json
from flask import Flask
from flask import Response
from api.dbworker import DBWorker
from random import randint, getrandbits
import time


#BE-DB wrapper
class BEWorker:
    def __init__(self):
        self.db = DBWorker();
        
    def makeResponse(self,data):
        res = Response(response=json.dumps(data['payload']), status=data['code'])
        res.headers["Content-Type"] = "text/json;"
        return res
            
    def addAsset(self,asset):
        return self.makeResponse(self.db.addAsset(asset))
    
    def getAssets(self):
        return self.makeResponse(self.db.getAssets())

    def removeAsset(self, asset):
        return self.makeResponse(self.db.removeAsset(asset))

    def removeAll(self):
        return self.makeResponse(self.db.removeAll())
##### Entry point
app = Flask(__name__)

#returns json
#201 if ok
#409 if value exists
#400 if exception
@app.route('/addAsset/<string:asset_name>', methods=['POST'])
def doAddAsset(asset_name):
    worker = BEWorker()
    return worker.addAsset(asset_name)

@app.route('/removeAsset/<string:asset_name>', methods=['DELETE'])
def doRemoveAsset(asset_name):
    worker = BEWorker()
    return worker.removeAsset(asset_name)

@app.route('/removeAll/', methods=['DELETE'])
def removeAll():
    worker = BEWorker()
    return worker.removeAll()



#returns json
#200 if ok
#400 if exception
@app.route('/getAssets', methods=['GET'])
def doGetAssets():
    
    # To simulate high load of the system we add the random latency
    # To handle this case is important part of the task  
    is_high_loaded = bool(getrandbits(1))
    if (is_high_loaded):
        latency = randint(0, 15)
        time.sleep(latency)

    worker = BEWorker()
    return worker.getAssets()
