from extension import db
from datetime import datetime
import pytz
from werkzeug.security import generate_password_hash, check_password_hash

def get_current_time_in_ist():
    kolkata_tz = pytz.timezone('Asia/Kolkata')
    return datetime.now(kolkata_tz)

class User(db.Model):
    __tablename__ = "users"

    name = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(40), nullable=False, primary_key=True)
    hashPassword = db.Column(db.String(100), nullable=False)

    # Relationship to TodoList
    posts = db.relationship('TodoList', backref='author', lazy=True)

    def __repr__(self):
        return f"User(email='{self.email}')"

class TodoList(db.Model):
    __tablename__ = "todo_list"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(40), db.ForeignKey('users.email'), nullable=False)
    todoName = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=get_current_time_in_ist)
    due_date = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f"TodoList(todoName='{self.todoName}', email='{self.email}')"
    
    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "todoName": self.todoName,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "due_date": self.due_date
        }
