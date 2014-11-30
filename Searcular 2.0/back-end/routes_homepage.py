from __init__  import app,sessions
from flask import Flask, render_template, request, flash, session, redirect, url_for
from models import db, Users,Searches, Query, Search_Websites, Websites
from sqlalchemy import *

@app.route('/home', methods=['GET', 'POST'])
def getQueryByUserID():
  user_id = session['userid']
  result = sessions.query(Query.Query).\
                join(Searches, Searches.QueryID== Query.QueryID).\
                filter(Searches.UserID == user_id)
  return result

@app.route('/home/query_id=<query_id>', methods=['GET', 'POST'])
def getURLsByUserIDQueryID(query_id):
  user_id = session['userid']
  result = sessions.query(Websites.URL).\
                join(Search_Websites, Search_Websites.WebsiteID== Websites.WebsiteID).\
                join(Searches, Searches.SearchID == Search_Websites.SearchID).\
                filter(Searches.UserID == user_id).\
                filter(Searches.QueryID == query_id)
  return result

@app.route('/home', methods=['GET', 'POST'])
def getURLsByUserID():
  user_id = session['userid']
  result = sessions.query(Websites.URL).\
                join(Search_Websites, Search_Websites.WebsiteID== Websites.WebsiteID).\
                join(Searches, Searches.SearchID == Search_Websites.SearchID).\
                filter(Searches.UserID == user_id)
  return result

##############Delete
def deleteSearchByUserIDQueryID(query_id):
   user_id = session['userid']
   result = sessions.query(Searches).\
                filter(Searches.UserID == user_id).\
                filter(Searches.QueryID ==query_id)
   for res in result:
      sessions.delete(res)
      sessions.commit()
   return "deleted"             

def deleteWebsiteByUserID(website_id):
   user_id = session['userid']

   result = sessions.query(Search_Websites).\
                join(Searches, Searches.SearchID == Search_Websites.SearchID).\
                filter(Searches.UserID == user_id).\
                filter(Search_Websites.WebsiteID ==website_id).first()
   sessions.delete(result)
   sessions.commit()
   return "deleted"     

##############Global
def getURLsByQueryID():
     result = sessions.query(Websites.URL).\
                join(Search_Websites, Search_Websites.WebsiteID== Websites.WebsiteID).\
                join(Searches, Searches.SearchID == Search_Websites.SearchID)
     return result

def getURLs():
    result = sessions.query(Websites.URL)
    return result
 
if __name__ == '__main__':
  app.run(debug=True)