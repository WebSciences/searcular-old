from flask import render_template, flash, redirect, session, url_for, request, g
from flask.ext.login import login_user, logout_user, current_user, login_required
from app import app

class pagination:
	has_prev = False
	prev_num = 1
	current_page = 2
	total_pages = [1,2,3,4,5]
	has_next = True
	next_num = 3

	def __init__(self, page):

		self.current_page = page;

		if page == 1:
			self.has_prev = False
		else:
			self.has_prev = True

		if self.has_prev:
			self.prev_num = page - 1

		if page == 5:
			self.has_next = False
		else:
			self.has_next = True

		if self.has_next:
			self.next_num = page + 1

		return

@app.route('/', methods = ['GET', 'POST'])
@app.route('/index', methods = ['GET', 'POST'])
@app.route('/index/tags/<string:tag>-<int:page>', methods = ['GET', 'POST'])
def index(tag = 'all', page = 1):
	user = {'name' : 'Miguel'}
	tags = ['car insurance', 'cheap flight', 'tag3', 'tag4']
	contents = [
		{'url':'http://www.google.com',
		'name':'link1'},

		{'url':'http://www.baidu.com',
		'name':'link1'},

		{'url':'http://www.flickr.com',
		'name':'link1'},
		{'url':'http://www.twitter.com',
		'name':'link1'},

		{'url':'http://pagepeeker.com',
		'name':'link1'},

		{'url':'http://www.youtube.com',
		'name':'link1'}
	]
	p = pagination(page)

	return render_template('index.html',
		user = user,
		title = 'Home',
		tag = tag,
		tags = tags,
		contents = contents,
		pagination = p)



	

@app.route('/history')
@app.route('/history/tags/<string:tag>-<int:page>', methods = ['GET', 'POST'])
def history(tag = 'all', page = 1):
	user = {'name' : 'Miguel'}
	tags = ['car insurance', 'cheap flight', 'tag3', 'tag4']
	contents = [
		{'url':'http://www.google.com',
		'image':'http://www.baidu.com/img/bdlogo.png',
		'description':'this is a website a',
		'name':'link1'},

		{'url':'http://www.google.com',
		'image':'http://www.baidu.com/img/bdlogo.png',
		'description':'this is a website b',
		'name':'link1'},

		{'url':'http://www.google.com',
		'image':'http://sdfacademy.com/wp-content/uploads/2012/11/SDFA-GU10-AA-C-1st-place.jpg',
		'description':'this is a website c',
		'name':'link1'}

	]
	p = pagination(page)

	return render_template('history.html',
		user = user,
		title = 'History',
		tag = tag,
		tags = tags,
		contents = contents,
		pagination = p)


@app.route('/login', methods = ["GET", "POST"])
def login():
	return render_template('login.html')

@app.route('/signup', methods = ["GET", "POST"])
def signup():
	return render_template('signup.html')



