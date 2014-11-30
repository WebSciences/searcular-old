from flask import Flask
from models import loadSession

app = Flask(__name__)
app.secret_key = 'development key'

#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:password@localhost/searcular2014'

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://jujhar:mypass@ec2-54-171-248-119.eu-west-1.compute.amazonaws.com/searcular2014'

from models import db
db.init_app(app)

sessions = loadSession()