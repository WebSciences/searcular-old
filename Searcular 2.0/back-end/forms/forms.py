from flask.ext.wtf import Form
from wtforms import TextField, BooleanField, SubmitField, validators, PasswordField, ValidationError
from wtforms.validators import Required
from models import db, Users

class SignupForm(Form):
  firstname = TextField("First name",  [validators.Required("Please enter your first name."),validators.Length(min=4, max=25)])
  lastname = TextField("Last name",  [validators.Required("Please enter your last name.")])
  email = TextField("Email",  [validators.Required("Please enter your email address."), validators.Email("Please enter your email address.")])
  username = TextField("Username",  [validators.Required("Please enter a username.")])
  password = PasswordField('New Password', [
        validators.Required(),
        validators.EqualTo('confirm', message='Passwords must match')
    ])
  confirm = PasswordField('Repeat Password')
  submit = SubmitField("Create account")
 
  def __init__(self, *args, **kwargs):
    Form.__init__(self, *args, **kwargs)
 
  def validate(self):
    if not Form.validate(self):
      return False
     
    user = Users.query.filter_by(email = self.email.data.lower()).first()
    if user:
      self.email.errors.append("That email is already taken")
      return False
    else:
      return True