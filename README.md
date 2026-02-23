# Student Management System - Premium Web Application

A beautiful, colorful, and premium-level frontend for managing student records. This is a modern web application built with **Flask**, **HTML**, **CSS**, and **JavaScript** that provides a complete CRUD (Create, Read, Update, Delete) interface for managing student data.

![Student Management System](https://img.shields.io/badge/Status-Active-brightgreen)
![Version](https://img.shields.io/badge/Version-2.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-orange)

---

## ✨ Features

### 🎨 Premium UI/UX
- **Colorful Gradient Design**: Beautiful animated gradient backgrounds
- **Glassmorphism Effects**: Modern glass-effect cards and modals
- **Smooth Animations**: Fluid animations and transitions throughout
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### 📊 Dashboard
- **Statistics Cards**: 
  - Total Students count
  - Average Marks percentage
  - Top Marks percentage
  - Total Branches count
- **Real-time Updates**: Statistics update automatically when data changes

### 🔍 Search & Filter
- **Real-time Search**: Filter students by name, roll number, or branch
- **Instant Results**: Search results appear as you type

### ➕➖ CRUD Operations
- **Add Student**: Add new students with validation
- **View Students**: Beautiful table with all student records
- **Edit Student**: Update existing student information
- **Delete Student**: Remove students with confirmation

### 🔔 Notifications
- **Toast Notifications**: Beautiful success/error messages
- **Visual Feedback**: Clear indicators for all actions

### 💾 Data Persistence
- **JSON Database**: Data saved in students.json file
- **Flask Backend**: Professional server-side storage

---

## 🚀 Getting Started

### Option 1: Flask Web Application (Recommended)

#### Prerequisites
- Python 3.x
- Flask
- Gunicorn (for production)

#### Installation

1. **Clone or Download the Repository**
   
```
bash
git clone <repository-url>
```

2. **Navigate to Project Folder**
   
```
bash
cd "Student Hub"
```

3. **Install Dependencies**
   
```
bash
pip install -r requirements.txt
```

4. **Run the Application (Development)**
   
```
bash
python app.py
```

5. **Open in Browser**
   - Navigate to: http://127.0.0.1:5000

---

### Option 2: Gunicorn Production Server

For production deployment, use Gunicorn:

```
bash
gunicorn app:app
```

Or with custom settings:
```
bash
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

- `-w 4`: 4 worker processes
- `-b 0.0.0.0:8000`: Bind to port 8000

---

### Option 2: Standalone HTML (No Server)

Simply open `index.html` in any modern web browser - no installation required!

---

## 📁 File Structure

```
Student Hub/
├── app.py                 # Flask web application with REST API
├── templates/
│   └── index.html        # HTML template
├── static/
│   ├── styles.css        # Premium styling
│   └── script.js         # JavaScript functionality
├── student_file.py       # Original Python CLI version
├── students.json         # Database file (auto-created)
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students |
| POST | `/api/students` | Add new student |
| GET | `/api/students/<roll>` | Get student by roll |
| PUT | `/api/students/<roll>` | Update student |
| DELETE | `/api/students/<roll>` | Delete student |
| GET | `/api/stats` | Get statistics |

---

## 🎯 How to Use

### Adding a Student
1. Click the **"Add Student"** button
2. Fill in the form:
   - Roll Number (unique identifier)
   - Student Name
   - Age
   - Branch (dropdown selection)
   - Marks (0-100)
3. Click **"Save Student"**
4. Success notification will appear

### Viewing Students
- All students are displayed in a beautiful table
- Each student shows: Roll No., Name, Age, Branch, Marks
- Marks are color-coded:
  - 🟢 Green: 75% and above
  - 🟡 Yellow: 50-74%
  - 🔴 Red: Below 50%

### Searching Students
- Type in the search box to filter students
- Searches by: Name, Roll Number, or Branch

### Editing a Student
1. Click the **Edit** (✏️) icon on any student row
2. Modify the information in the form
3. Click **"Save Student"**

### Deleting a Student
1. Click the **Delete** (🗑️) icon on any student row
2. Confirm deletion in the popup
3. Student will be permanently removed

---

## 🛠️ Technical Details

### Technologies Used
- **Flask**: Python web framework
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients, animations, flexbox, grid
- **JavaScript (ES6+)**: Vanilla JavaScript with modern features
- **Font Awesome**: Icons
- **Google Fonts**: Poppins font family
- **JSON**: Data storage

### Browser Support
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Edge (latest)
- ✅ Safari (latest)

---

## 🎨 Color Scheme

| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary | #667eea | Main buttons, highlights |
| Secondary | #764ba2 | Gradients, accents |
| Success | #10b981 | Success messages, high marks |
| Warning | #f59e0b | Medium marks |
| Danger | #ef4444 | Errors, delete actions |
| Background | #1a1a2e | Dark theme background |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Inspiration from modern UI designs

---

**Made with ❤️ for Student Management**
