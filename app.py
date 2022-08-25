from enum import unique
import bcrypt
from datetime import date, datetime
from flask import Flask, render_template, redirect, url_for, request
from flask.helpers import flash
from flask.sessions import NullSession
from flask.templating import render_template
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from flask_wtf import form
from flask_wtf.form import FlaskForm
from sqlalchemy.orm import backref, session
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, ValidationError
from wtforms.widgets.core import Input
from flask_bcrypt import Bcrypt
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView


# app instance
app = Flask(__name__)
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
admin = Admin(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'my secretsss'

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"
# allow load users from id stored in session
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Creating table for login db
class User(db.Model, UserMixin):
    # identity column
    id = db.Column(db.Integer, primary_key=True)
    # username column - unique so no same usernames
    username = db.Column(db.String(20), nullable=False, unique=True)
    # nullable for now...
    email = db.Column(db.String(30), nullable=True, unique=True)
    # password column - 80 characters once hashed
    logs = db.relationship('Log', backref='author')
    password = db.Column(db.String(80), nullable=False)
    authenticated = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'{self.username}'


class Log(db.Model, UserMixin):
    # identity column
    id = db.Column(db.Integer, primary_key=True)
    time = db.Column(db.String(8), index=True, unique=False)
    refrence = db.Column(db.String(8), index=True, unique=False, nullable = True)
    content = db.Column(db.String(500), index=True, unique=True)
    tags = db.Column(db.String(500), index=True, unique=False, nullable = True)
    bpd = db.Column(db.Boolean, index=True, unique=False, nullable = True)
    timestamp = db.Column(db.DateTime, index=True, default=date.today())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    attachments = db.Column(db.String(300), nullable=True)


    def __repr__(self):
            return f"<tr> <td> {self.id} </td> <td> {self.author} </td>  <td> {self.content} </td> <td> {self.time} </td> <td> {self.timestamp} </td> <td> {self.bpd} </td> <td> {self.tags} </td> <td> {self.refrence} </td> <td> {self.attachments} </td> </tr>"

admin.add_view(ModelView(Log,db.session))
admin.add_view(ModelView(User,db.session))

class RegisterForm(FlaskForm):
    username = StringField(validators=[InputRequired(), Length(min=4, max=20)],
    render_kw={"placeholder": "Username"})

    email = StringField(validators=[InputRequired(), Length(min=4, max=30)],
    render_kw={"placeholder": "Email"})

    password = PasswordField(validators=[InputRequired(), Length(min=4, max=20)],
    render_kw={"placeholder": "Password"})

    submit = SubmitField("Register")
    
    def validate_username(self, username):
        existing_user_username = User.query.filter_by(
            username=username.data).first()
        if existing_user_username:
            raise form.ValidationError("That username already exists. Please choose a different one.")

def email_validator():
    # """validate email address. Handle both only email and email with name:
    # - ab@cd.com
    # - AB CD <ab@cd.com>

    # """
    # message = "Invalid email format. Email must be either email@example.com or *First Last <email@example.com>*"
    message = "That username already exists. Please choose a different one."


class LoginForm(FlaskForm):
    username = StringField(validators=[InputRequired(), Length(min=4, max=20)],
    render_kw={"placeholder": "Username"})

    password = PasswordField(validators=[InputRequired(), Length(min=4, max=20)],
    render_kw={"placeholder": "Password"})

    submit = SubmitField("Login")

db.create_all()

@app.route('/registerlog',methods = ['POST'])
def logreg():
    time = request.form['time']
    refrence = request.form['refrence']
    des = request.form['about']
    bpd = request.form.get('bpd')
    tags = request.form['tags']
    print(bpd)
    if bpd is None:
        log = Log(time = time, refrence = refrence, content = des, bpd = False, tags = tags, user_id = current_user.id)
    else:
         log = Log(time = time, refrence = refrence, content = des, bpd = True, tags = tags, user_id = current_user.id)
    
    db.session.add(log)
    db.session.commit()
    return redirect(url_for('viewlog')) 

@app.route('/logs')
def logsView():
    retData = Log.query.all()
    return str(retData)

@app.route('/logs/<currentdate>')
def specificVlogView(currentdate):
    myString = currentdate + " 00:00:00.000000"
    retData = Log.query.filter_by(timestamp=myString).all() 
    return str(retData)

@app.route('/test', methods = ['GET', 'POST'])
def test():
    return render_template("test.html")


# Setting up first route with decorator
@app.route('/', methods=['GET', 'POST'])
def home():
    form = LoginForm()

    if form.validate_on_submit():
        # check if user is in db
        user = User.query.filter_by(username=form.username.data).first()
        if user:
            if bcrypt.check_password_hash(user.password, form.password.data):
                login_user(user)
                return redirect(url_for('viewlog'))
            else:
                error = 'Invalid credentials'

    return render_template("login.html", form=form)



# Setting up login route
@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()

    if form.validate_on_submit():
        # check if user is in db
        user = User.query.filter_by(username=form.username.data).first()
        if user:
            if bcrypt.check_password_hash(user.password, form.password.data):
                login_user(user)
                flash('You were successfully logged in')
                return redirect(url_for('viewlog'))
            else:
                error = 'Invalid credentials'


    return render_template('login.html', form=form)

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()

    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data)
        new_user = User(username=form.username.data, email=form.email.data, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for('login'))
    return render_template('register.html', form=form)


@app.route('/logout', methods = ['GET', 'POST'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))


@app.route('/editor', methods = ['GET', 'POST'])
@login_required
def editor():
    return render_template("editor.html")


@app.route('/media', methods = ['GET'])
@login_required
def media():
    return render_template("media.html")

@app.route('/viewlog', methods = ['GET'])
@login_required
def viewlog():
    return render_template("viewlog.html")


@app.route('/profile/<username>', methods = ['GET'])
@login_required
def profile(username):
    user = User.query.filter_by(username=username).first()

    return render_template('profilecard.html', user=user)


if __name__ == '__main__':
    app.run(debug=True)