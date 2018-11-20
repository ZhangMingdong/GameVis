# -*- coding: utf-8 -*-
"""
Created on Mon May  7 11:01:26 2018

@author: Mingdong

merge wolf game data in the database.
"""

# Making a Connection with MongoClient
from pymongo import MongoClient

# write the data to a new collection and change the season
def modifySeason():
    client = MongoClient('localhost', 27020)


    # Getting a Database
    db = client.toponeliar
    #print(db)
    
    #Getting a Collection
    records=db.gamerecords;
    newrecords=db.newrecords;
    
    toNewRecord=0;
    if toNewRecord:
        for record in records.find():
             newR={'date':record['date'],'game':record['game'],'seat':record['seat'],'name':record['name'],'role':record['role'],'lover':record['lover'],'dying':record['dying'],'deathday':record['deathday'],'lucky':record['lucky'],'win':record['win'],'see':record['see'],'badge':record['badge'],'season':record['season'],'extra_score':record['extra_score']}
             newrecords.insert_one(newR)
    else:
        for record in newrecords.find():
             newR={'date':record['date'],'game':record['game'],'seat':record['seat'],'name':record['name'],'role':record['role'],'lover':record['lover'],'dying':record['dying'],'deathday':record['deathday'],'lucky':record['lucky'],'win':record['win'],'see':record['see'],'badge':record['badge'],'season':10,'extra_score':record['extra_score']}
             records.insert_one(newR)   

def merge():
    client = MongoClient('localhost', 27020)
    client2 = MongoClient('localhost', 27022)


    # Getting a Database
    db = client.toponeliar
    db2 = client2.toponeliar
    #print(db)
    
    #Getting a Collection
    records=db.gamerecords;
    records2=db2.gamerecords;
    
    

    for record in records2.find():
         records.insert_one(record)  
             


merge()

