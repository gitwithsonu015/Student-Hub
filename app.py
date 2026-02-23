from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, session
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from urllib.parse import unquote
import json
import os

app = Flask(__name__)

# Secret key for sessions
app.secret_key = 'student_hub_secret_key_2024'

# Flask-Login setup
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

FILE_NAME = "students.json"
USERS_FILE = "users.json"


# ---------- User Class for Flask-Login ----------
class User(UserMixin):
    def __init__(self, id, username, password_hash):
        self.id = id
        self.username = username
        self.password_hash = password_hash


# ---------- Load Data ----------
def load_students():
    if os.path.exists(FILE_NAME):
        with open(FILE_NAME, "r") as f:
            return json.load(f)
    return []


# ---------- Save Data ----------
def save_students(data):
    with open(FILE_NAME, "w") as f:
        json.dump(data, f, indent=4)


# ---------- User Functions ----------
def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, "r") as f:
            return json.load(f)
    # Create default admin user if file doesn't exist
    default_users = {
        "admin": {
            "username": "admin",
            "password": generate_password_hash("admin123")
        }
    }
    save_users(default_users)
    return default_users


def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=4)


@login_manager.user_loader
def load_user(user_id):
    users = load_users()
    if user_id in users:
        user_data = users[user_id]
        return User(user_id, user_data['username'], user_data['password'])
    return None


# ---------- Home Route ----------
@app.route('/')
@login_required
def home():
    return render_template('index.html')


# ---------- Login Route ----------
@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        users = load_users()
        
        if username in users:
            user_data = users[username]
            if check_password_hash(user_data['password'], password):
                user = User(username, username, user_data['password'])
                login_user(user)
                return redirect(url_for('home'))
        
        flash('Invalid username or password!', 'error')
        return render_template('login.html')
    
    return render_template('login.html')


# ---------- Logout Route ----------
@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out successfully!', 'success')
    return redirect(url_for('login'))


# ---------- Forgot Password Route ----------
@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    
    if request.method == 'POST':
        old_username = request.form.get('old_username')
        new_username = request.form.get('new_username')
        new_password = request.form.get('new_password')
        confirm_password = request.form.get('confirm_password')
        
        users = load_users()
        
        if old_username not in users:
            flash('Username not found!', 'error')
            return render_template('forgot_password.html')
        
        current_key = old_username
        
        # Check if new username is provided and different from old
        if new_username and new_username != old_username:
            if new_username in users:
                flash('New username already exists!', 'error')
                return render_template('forgot_password.html')
            
            # Rename username
            users[new_username] = users.pop(old_username)
            current_key = new_username
            flash('Username updated successfully! ', 'success')
        
        if new_password:
            if new_password != confirm_password:
                flash('Passwords do not match!', 'error')
                return render_template('forgot_password.html')
            
            if len(new_password) < 4:
                flash('Password must be at least 4 characters!', 'error')
                return render_template('forgot_password.html')
            
            # Update password
            users[current_key]['password'] = generate_password_hash(new_password)
        
        save_users(users)
        
        if new_username and new_password:
            flash('Username and password updated successfully! Please login with new credentials.', 'success')
        elif new_username:
            flash('Username updated successfully! Please login with new username.', 'success')
        else:
            flash('Password reset successfully! Please login with your new password.', 'success')
        
        return redirect(url_for('login'))
    
    return render_template('forgot_password.html')


# ---------- API Routes ----------

# GET - View all students
@app.route('/api/students', methods=['GET'])
@login_required
def get_students():
    students = load_students()
    return jsonify(students)


# POST - Add student
@app.route('/api/students', methods=['POST'])
@login_required
def add_student():
    students = load_students()
    data = request.get_json()
    
    roll = data.get('roll')
    
    # Duplicate roll check
    for s in students:
        if s["roll"] == roll:
            return jsonify({"success": False, "message": "Roll number already exists!"}), 400
    
    student = {
        "roll": roll,
        "name": data.get('name'),
        "age": data.get('age'),
        "branch": data.get('branch'),
        "marks": data.get('marks')
    }
    
    students.append(student)
    save_students(students)
    return jsonify({"success": True, "message": "Student added successfully!"})


# GET - Search student by roll
@app.route('/api/students/<roll>', methods=['GET'])
@login_required
def search_student(roll):
    roll = unquote(roll)
    students = load_students()
    for s in students:
        if s["roll"] == roll:
            return jsonify(s)
    return jsonify({"success": False, "message": "Student not found!"}), 404


# PUT - Update student by index
@app.route('/api/students/index/<int:index>', methods=['PUT'])
@login_required
def update_student_by_index(index):
    students = load_students()
    data = request.get_json()
    
    if index < 0 or index >= len(students):
        return jsonify({"success": False, "message": "Student not found!"}), 404
    
    # Keep the original roll number, update only other fields
    students[index]['name'] = data.get('name')
    students[index]['age'] = data.get('age')
    students[index]['branch'] = data.get('branch')
    students[index]['marks'] = data.get('marks')
    
    save_students(students)
    return jsonify({"success": True, "message": "Student updated successfully!"})


# DELETE - Delete student by index
@app.route('/api/students/index/<int:index>', methods=['DELETE'])
@login_required
def delete_student_by_index(index):
    students = load_students()
    
    if index < 0 or index >= len(students):
        return jsonify({"success": False, "message": "Student not found!"}), 404
    
    students.pop(index)
    save_students(students)
    return jsonify({"success": True, "message": "Student deleted successfully!"})


# Legacy endpoints - kept for backward compatibility
# PUT - Update student (by roll number)
@app.route('/api/students/<roll>', methods=['PUT'])
@login_required
def update_student(roll):
    roll = unquote(roll)
    students = load_students()
    data = request.get_json()
    
    for i, s in enumerate(students):
        if s["roll"] == roll:
            students[i] = {
                "roll": roll,
                "name": data.get('name'),
                "age": data.get('age'),
                "branch": data.get('branch'),
                "marks": data.get('marks')
            }
            save_students(students)
            return jsonify({"success": True, "message": "Student updated successfully!"})
    
    return jsonify({"success": False, "message": "Student not found!"}), 404


# DELETE - Delete student (by roll number)
@app.route('/api/students/<roll>', methods=['DELETE'])
@login_required
def delete_student(roll):
    roll = unquote(roll)
    students = load_students()
    
    for i, s in enumerate(students):
        if s["roll"] == roll:
            students.pop(i)
            save_students(students)
            return jsonify({"success": True, "message": "Student deleted successfully!"})
    
    return jsonify({"success": False, "message": "Student not found!"}), 404


# ---------- Statistics Route ----------
@app.route('/api/stats', methods=['GET'])
@login_required
def get_stats():
    students = load_students()
    
    total = len(students)
    
    if total > 0:
        total_marks = sum(int(s.get('marks', 0)) for s in students)
        avg_marks = total_marks // total
        top_marks = max(int(s.get('marks', 0)) for s in students)
    else:
        avg_marks = 0
        top_marks = 0
    
    branches = len(set(s.get('branch') for s in students))
    
    return jsonify({
        "total": total,
        "avg_marks": avg_marks,
        "top_marks": top_marks,
        "branches": branches
    })


if __name__ == '__main__':
    print("\n" + "="*50)
    print("Student Management System - Flask")
    print("="*50)
    print("Server running at: http://127.0.0.1:5000")
    print("Default Login: admin / admin123")
    print("Press Ctrl+C to stop the server")
    print("="*50 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5000)
