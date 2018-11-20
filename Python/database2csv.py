# -*- coding: utf-8 -*-
"""
Created on 11/19/2018

@author: Mingdong

copy the data record in database to csv file
"""

# Making a Connection with MongoClient
from pymongo import MongoClient

import csv

def database2csv():
    client = MongoClient('localhost', 27020)


    # Getting a Database
    db = client.toponeliar
    
    #Getting a Collection
    records=db.gamerecords;
    
    

    with open('gamerecords.csv', mode='w', newline='') as records_file:
        records_writer = csv.writer(records_file)
        records_writer.writerow(['season','date','game','name','role','dying','deathday','win','lover','luck','see','badge','extra_score'])
        for record in records.find():       
            records_writer.writerow([record['season'],record['date'].strftime('%m/%d/%Y'),record['game'],record['name'],record['role'],record['dying'],record['deathday'],record['win'],record['lover'],record['lucky'],(record['see'] if 'see' in record.keys() else ''),record['badge'],(record['extra_score'] if 'extra_score' in record.keys() else '')])
             


database2csv()

