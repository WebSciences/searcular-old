from __init__  import app, sessions
from flask import Flask, render_template, request, session, flash, redirect, url_for
from forms.forms import SignupForm
from models import db, Users, Searches
from sqlalchemy import *
from routes_homepage import *


@app.route('/signup', methods=['GET', 'POST'])
def signup():
  form = SignupForm()

  if request.method == 'POST':
    if form.validate() == False:
      return render_template('signup.html', form=form,person="dd")
    else:
      newuser = Users(form.firstname.data, form.lastname.data, form.email.data, form.username.data, form.password.data)
      db.session.add(newuser)
      db.session.commit()
      return "User Created"
   
  elif request.method == 'GET':
    return render_template('signup.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
  person = None
  if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        person = Users.query.filter_by(username=username).first()
        
        if person and person.check_password(password):
           session['userID'] = person.userid
           session['logged_in'] = True
        else:
           return redirect(url_for('login'))  

  elif request.method == 'GET':
         return render_template('login.html')
         
@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('You were logged out')         

if __name__ == '__main__':
  app.run(debug=True)         