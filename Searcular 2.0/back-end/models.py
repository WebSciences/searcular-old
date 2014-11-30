from flask.ext.sqlalchemy import SQLAlchemy
from werkzeug import generate_password_hash, check_password_hash
from sqlalchemy import *
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
 
#engine = create_engine("mysql://root:password@localhost/searcular2014", echo=True)
engine = create_engine("mysql://jujhar:mypass@ec2-54-171-248-119.eu-west-1.compute.amazonaws.com/searcular2014", echo=True)
Base = declarative_base(engine)
metadata1 = MetaData(bind=engine)
db = SQLAlchemy()
 
class Users(db.Model):
  __tablename__ = 'Users'
  userid= db.Column(db.Integer, primary_key = True)
  firstname = db.Column(db.String(50))
  lastname = db.Column(db.String(50))
  email = db.Column(db.String(50), unique=True)
  username = db.Column(db.String(25))
  password= db.Column(db.String(54))
   
  def __init__(self, firstname, lastname, email, username,password):
    self.firstname = firstname.title()
    self.lastname = lastname.title()
    self.email = email.lower()
    self.username = username.lower()
    self.set_password(password)
     
  def set_password(self, password):
    self.password = generate_password_hash(password)
   
  def check_password(self, password):
    return check_password_hash(self.password, password)

#The remainder of tables will be autoloaded
class Searches(Base):
    __tablename__ = 'Searches'
    __table_args__ = {'autoload':True}

    def __init__(self, userid,queryid):
      self.UserID=  userid
      self.QueryID = queryid
      self.Date_Time = datetime.now()

#######

class Query(Base):
    __tablename__ = 'Query'
    __table_args__ = {'autoload':True} 

    def __init__(self, query):
      self.Query =  query.lower()

#######

class Search_Websites(Base):
    __tablename__ = 'Search_Websites'
    __table_args__ = {'autoload':True}  

    def __init__(self, searchid,websiteid,duration):
      self.SearchID=  searchid
      self.WebsiteID = websiteid
      self.Duration = duration

#######

class Websites(Base):
    __tablename__ = 'Websites'
    __table_args__ = {'autoload':True} 

    def __init__(self, url):
      self.URL = url.lower()

#######

class Query_Keywords(Base):
    __tablename__ = 'Query_Keywords'
    __table_args__ = {'autoload':True}    

class Keywords(Base):
    __tablename__ = 'Keywords'
    __table_args__ = {'autoload':True}    

#Returns model session
def loadSession():
    metadata = Base.metadata
    Session = sessionmaker(bind=engine)
    session = Session()
    return session