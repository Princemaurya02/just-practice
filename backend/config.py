from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "nexoraDB"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

prediction_collection = db["predictions"]
