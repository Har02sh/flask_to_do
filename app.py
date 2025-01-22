from flask import Flask, render_template, request, jsonify, session
from extension import db
from model import *
from waitress import serve


app = Flask(__name__)
app.secret_key = "your_secret_key"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///userDB.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)
with app.app_context():
    db.create_all()


@app.route("/dashboard")
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/register", methods=["GET","POST"])
def register():
    if request.method == "POST":
        data = request.get_json()
        name,password,email = data['name'],data['password'],data['email']
        user = User.query.filter_by(email= email).first()
        if user:
            return jsonify({"message":"Email already exists"}), 401
        new_user = User(name=name,email=email,hashPassword=generate_password_hash(password))
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message":"successfull"})
    return render_template("register.html")

@app.route("/login", methods=["GET","POST"])
def login():
    if request.method == "POST":
        data = request.get_json()
        email = data["email"]
        password = data["password"]
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"message":"User not found"}), 404
        if not check_password_hash(user.hashPassword, password):
            return jsonify({"message":"Email or Password Incorrect"}), 401
        session["name"] = user.name
        session["email"] = user.email
        return jsonify({"message":"successfull"})
    return render_template("register.html")

@app.route("/checkStatus")
def checkStatus():
    if "name" in session:
        print("This one")
        return jsonify({"user":session["name"]})
    print("Not this one needed")
    return jsonify({"user":None})

@app.route("/logout")
def logout():
    pass

@app.route("/todo",methods=["GET","POST","DELETE"])
def todo():
    if request.method == "POST":
        # Handle adding a new task
        data = request.get_json()
        todoName = data.get("todoName")
        due_date = data.get("due_date")

        # Check if user exists
        user = User.query.filter_by(email=session.get("email")).first()
        if not user:
            return jsonify({"message": "User not found"}), 404

        # Add new task
        new_task = TodoList(email=user.email, todoName=todoName, due_date=due_date)
        db.session.add(new_task)
        db.session.commit()
        return jsonify({"message": "Task added successfully"}), 201

    elif request.method == "DELETE":
        # Handle task deletion
        data = request.get_json()
        task_id = data.get("id")

        if not task_id:
            return jsonify({"message": "Task ID is required"}), 400

        task = TodoList.query.filter_by(id=task_id, email=session.get("email")).first()
        if not task:
            return jsonify({"message": "Task not found"}), 404

        db.session.delete(task)
        db.session.commit()
        return jsonify({"message": "Task deleted successfully"}), 200

    elif request.method == "GET":
        # Handle fetching tasks
        email = session.get("email")
        if not email:
            return jsonify({"message": "Email not found in session"}), 404

        tasks = TodoList.query.filter_by(email=email).all()
        task_list = [task.to_dict() for task in tasks]
        print(type(task_list))
        return jsonify({"message": "Success", "taskList": task_list}), 200


if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=5000)