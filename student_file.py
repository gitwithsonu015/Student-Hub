import json
import os

FILE_NAME = "students.json"


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


students = load_students()


# ================= ADD =================
def add_student():
    roll = input("Enter Roll Number: ")

    # duplicate roll check
    for s in students:
        if s["roll"] == roll:
            print("⚠️ Roll already exists!")
            return

    name = input("Enter Your Name: ")
    age = input("Enter Your Age: ")
    branch = input("Enter Your branch: ")
    marks = input("Enter Your Marks: ")

    student = {
        "roll": roll,
        "name": name,
        "age": age,
        "branch": branch,
        "marks": marks
    }

    students.append(student)
    save_students(students)
    print("✅ Student Saved Permanently")


# ================= VIEW =================
def view_students():
    if not students:
        print("No records found")
        return

    print("\nRoll | Name | Age | Branch | Marks")
    print("-------------------------------------")
    for s in students:
        print(s["roll"], "|", s["name"], "|", s["age"], "|", s["branch"], "|", s["marks"])


# ================= SEARCH =================
def search_student():
    r = input("Enter Your Roll: ")
    for s in students:
        if s["roll"] == r:
            print("Found:", s)
            return
    print("❌ Not found")


# ================= UPDATE =================
def update_student():
    r = input("Enter Your Roll: ")
    for s in students:
        if s["roll"] == r:
            s["name"] = input("Enter Your Name: ")
            s["age"] = input("Enter Your Age: ")
            s["branch"] = input("Enter Your Branch: ")
            s["marks"] = input("Enter Your marks: ")
            save_students(students)
            print("✅ Updated & Saved")
            return
    print("❌ Not found")


# ================= DELETE =================
def delete_student():
    r = input("Enter Roll to delete: ")
    for s in students:
        if s["roll"] == r:
            students.remove(s)
            save_students(students)
            print("🗑️ Deleted Permanently")
            return
    print("❌ Not found")


# ================= MENU =================
while True:
    print("\n===== Student Management System =====")
    print("1. Add Student")
    print("2. View Students")
    print("3. Search Student")
    print("4. Update Student")
    print("5. Delete Student")
    print("6. Exit")

    ch = input("Enter choice: ")

    if ch == '1':
        add_student()
    elif ch == '2':
        view_students()
    elif ch == '3':
        search_student()
    elif ch == '4':
        update_student()
    elif ch == '5':
        delete_student()
    elif ch == '6':
        print("Data saved. Bye 👋")
        break
    else:
        print("Invalid choice")