import os,sys,inspect
currentdir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parentdir = os.path.dirname(currentdir)
sys.path.insert(0,parentdir)

from flask import Flask
from models.models import loadSession

app = Flask(__name__)
app.secret_key = 'development key'

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://jujhar:mypass@ec2-54-171-248-119.eu-west-1.compute.amazonaws.com/searcular2014'

from models.models import db
db.init_app(app)

sessions = loadSession()