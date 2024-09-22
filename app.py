from flask import Flask, request, jsonify, render_template, session, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from helpers import apology, login_required

app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure the SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///calendar.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define User model
class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    hash = db.Column(db.String, nullable=False)

# Define Event model
class Event(db.Model):
    __tablename__ = "events"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.String, nullable=False)
    title = db.Column(db.String, nullable=False)
    color = db.Column(db.String, default='#ff0000')

    user = db.relationship('User', backref='events', lazy=True)

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

@app.route('/')
@login_required
def index():
    return render_template('index.html')  # Ensure you have an 'index.html' template

@app.route('/get_events', methods=['GET'])
@login_required
def get_events():
    user_id = session["user_id"]
    events = Event.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'date': event.date,
        'title': event.title,
        'color': event.color
    } for event in events])

@app.route('/save_event', methods=['POST'])
def save_event():
    try:
        data = request.json
        if not data.get('date') or not data.get('title'):
            return jsonify({'success': False, 'message': 'Date and title are required'}), 400

        new_event = Event(
            date=data.get('date'),
            title=data.get('title'),
            color=data.get('color', '#ff0000'),
            user_id=int(session["user_id"])
        )
        db.session.add(new_event)
        db.session.commit()

        return jsonify({'success': True})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False, 'message': 'An error occurred'}), 500

@app.route('/delete_event', methods=['POST'])
@login_required
def delete_event():
    try:
        data = request.json

        if not data.get('date'):
            return jsonify({'success': False, 'message': 'Date is required'}), 400

        date = data.get('date')
        user_id = int(session["user_id"])

        # Delete the event(s) that match the date and user_id
        Event.query.filter_by(date=date, user_id=user_id).delete()

        # Commit the transaction
        db.session.commit()

        return jsonify({'success': True})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False, 'message': 'An error occurred'}), 500

@app.route("/login", methods=["GET", "POST"])
def login():
    session.clear()

    if request.method == "POST":
        if not request.form.get("username"):
            return apology("must provide username", 403)
        elif not request.form.get("password"):
            return apology("must provide password", 403)

        user = User.query.filter_by(username=request.form.get("username")).first()

        if not user or not check_password_hash(user.hash, request.form.get("password")):
            return apology("invalid username and/or password", 403)

        session["user_id"] = user.id

        return redirect("/")
    else:
        return render_template("login.html")

@app.route("/logout")
def logout():
    """Log user out"""
    session.clear()
    return redirect("/")

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        if not request.form.get("username"):
            return apology("must provide username", 400)
        elif not request.form.get("password"):
            return apology("must provide password", 400)
        elif request.form.get("password") != request.form.get("confirmation"):
            return apology("passwords don't match", 400)

        check_user = User.query.filter_by(username=request.form.get("username")).first()
        if check_user:
            return apology("username taken", 400)

        new_user = User(
            username=request.form.get("username"),
            hash=generate_password_hash(request.form.get("password"))
        )
        db.session.add(new_user)
        db.session.commit()

        return redirect("/")

    else:
        return render_template("register.html")

@app.route("/profile")
@login_required
def profile():
    user = User.query.get(session["user_id"])
    return render_template("profile.html", name=user.username)

@app.route("/new-username", methods=["GET", "POST"])
@login_required
def newusername():
    if request.method == "POST":
        if not request.form.get("username"):
            return apology("must provide username", 400)

        check_user = User.query.filter_by(username=request.form.get("username")).first()
        if check_user:
            return apology("username taken", 400)

        user = User.query.get(session["user_id"])
        user.username = request.form.get("username")
        db.session.commit()

        return redirect("/")
    else:
        return render_template("new-username.html")

@app.route("/new-password", methods=["GET", "POST"])
@login_required
def newpassword():
    if request.method == "POST":
        if not request.form.get("password"):
            return apology("must provide password", 400)
        elif not request.form.get("newpassword"):
            return apology("must provide new password", 400)
        elif request.form.get("newpassword") != request.form.get("confirmation"):
            return apology("passwords don't match", 400)

        user = User.query.get(session["user_id"])
        if not check_password_hash(user.hash, request.form.get("password")):
            return apology("invalid password", 403)

        user.hash = generate_password_hash(request.form.get("newpassword"))
        db.session.commit()

        return redirect("/")
    else:
        return render_template("new-password.html")

# Ensure the database is created before the app runs
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Creates the tables if they don't exist
    app.run(debug=True)
