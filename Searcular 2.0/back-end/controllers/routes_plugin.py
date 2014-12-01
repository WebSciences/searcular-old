from __init__  import app,sessions
from flask import Flask, render_template, request, flash, session, redirect, url_for
from models.models import db, Users,Searches, Query, Search_Websites, Websites
from sqlalchemy import *
import json


#call go with json data as arg to submit to db
def go(jsonString):
      #jsonString = '{"io":[{"url":"http://en.wikipedia.org/wiki/Io_(moon)","duration":2.399}],"iu":[{"url":"http://en.wikipedia.org/wiki/International_unit","duration":2.315}]}'
      data = json.loads(jsonString)
      keys = sorted(data.keys())
      for query in keys:
        result = data[query]
        for res in result:
          addSession(res['url'],query,res['duration'])
      return "search added"    

def addSession(url,query,duration): 
      website_id = addWebsite(url)
      query_id = addQuery(query)
      search_id = addSearch(query_id)
      addSearch_Websites(search_id,website_id,duration)

def addSearch(query_id):
       user_id = sessions['userID']
       newSearch = Searches(user_id,query_id)
       sessions.add(newSearch)
       sessions.commit()
       return newSearch.SearchID

def addSearch_Websites(search_id,website_id,duration):
       newSearch_Website = Search_Websites(search_id,website_id,duration)
       sessions.add(newSearch_Website)
       sessions.commit()

def addQuery(query):
      result = sessions.query(Query).filter(Query.Query == query).first()
      if result:
         return result.QueryID
      else:
         newQuery = Query(query)
         sessions.add(newQuery)
         sessions.commit()
         return newQuery.QueryID

def addWebsite(url):
      result = sessions.query(Websites).filter(Websites.URL == url).first()
      if result:
         return result.WebsiteID
      else:
         newWebsite = Websites(url)
         sessions.add(newWebsite)
         sessions.commit()
         return newWebsite.WebsiteID

if __name__ == '__main__':
  app.run(debug=True) 