// Student Management System - JavaScript
// Database: localStorage (simulates JSON file behavior)

// Constants
const STORAGE_KEY = 'students_data';

// ============ DATABASE FUNCTIONS ============

// Load students from localStorage (similar to load_students() in Python)
function loadStudents() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Save students to localStorage (similar to save_students() in Python)
function saveStudents(students) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students, null, 4));
}

// ============ CRUD OPERATIONS ============

// Add Student (similar to add_student() in Python)
function addStudent(student) {
    const students = loadStudents();
    
    // Duplicate roll check
    for (let s of students) {
        if (s.roll === student.roll) {
            return { success: false, message: 'Roll number already exists!' };
        }
    }
    
    students.push(student);
    saveStudents(students);
    return { success: true, message: 'Student added successfully!' };
}

// View Students (similar to view_students() in Python)
function getAllStudents() {
    return loadStudents();
}

// Search Student (similar to search_student() in Python)
function searchStudent(roll) {
    const students = loadStudents();
    for (let s of students) {
        if (s.roll === roll) {
            return s;
        }
    }
    return null;
}

// Update Student (similar to update_student() in Python)
function updateStudent(roll, updatedData) {
    const students = loadStudents();
    for (let i = 0; i < students.length; i++) {
        if (students[i].roll === roll) {
            students[i] = { ...students[i], ...updatedData };
            saveStudents(students);
            return { success: true, message: 'Student updated successfully!' };
        }
    }
    return { success: false, message: 'Student not found!' };
}

// Delete Student (similar to delete_student() in Python)
function deleteStudent(roll) {
    const students = loadStudents();
    for (let i = 0; i < students.length; i++) {
        if (students[i].roll === roll) {
            students.splice(i, 1);
            saveStudents(students);
            return { success: true, message: 'Student deleted successfully!' };
        }
    }
    return { success: false, message: 'Student not found!' };
}

// ============ UI FUNCTIONS ============

// Global variables
let currentEditRoll = null;
let currentDeleteRoll = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderStudents();
    updateStats();
    setupSearch();
});

// Render all students in the table
function renderStudents(students = null) {
    const tbody = document.getElementById('studentTableBody');
    const emptyState = document.getElementById('emptyState');
    
    if (students === null) {
        students = getAllStudents();
    }
    
    if (students.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.add('show');
        return;
    }
    
    emptyState.classList.remove('show');
    tbody.innerHTML = '';
    
    students.forEach(student => {
        const marks = parseInt(student.marks);
        let marksClass = 'marks-low';
        if (marks >= 75) marksClass = 'marks-high';
        else if (marks >= 50) marksClass = 'marks-medium';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${student.roll}</strong></td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.branch}</td>
            <td><span class="marks-badge ${marksClass}">${student.marks}%</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="openModal('edit', '${student.roll}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete-small" onclick="openDeleteModal('${student.roll}', '${student.name}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Update statistics cards
function updateStats() {
    const students = getAllStudents();
    
    // Total Students
    document.getElementById('totalStudents').textContent = students.length;
    
    // Average Marks
    if (students.length > 0) {
        const totalMarks = students.reduce((sum, s) => sum + parseInt(s.marks || 0), 0);
        const avgMarks = Math.round(totalMarks / students.length);
        document.getElementById('avgMarks').textContent = avgMarks + '%';
        
        // Top Marks
        const topMarks = Math.max(...students.map(s => parseInt(s.marks || 0)));
        document.getElementById('topMarks').textContent = topMarks + '%';
    } else {
        document.getElementById('avgMarks').textContent = '0%';
        document.getElementById('topMarks').textContent = '0%';
    }
    
    // Total Branches
    const branches = [...new Set(students.map(s => s.branch))];
    document.getElementById('totalBranches').textContent = branches.length;
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase().trim();
        
        if (query === '') {
            renderStudents();
            return;
        }
        
        const students = getAllStudents();
        const filtered = students.filter(s => 
            s.name.toLowerCase().includes(query) || 
            s.roll.toLowerCase().includes(query) ||
            s.branch.toLowerCase().includes(query)
        );
        
        renderStudents(filtered);
    });
}

// ============ MODAL FUNCTIONS ============

// Open modal for add/edit
function openModal(type, roll = null) {
    const modal = document.getElementById('studentModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('studentForm');
    
    form.reset();
    document.getElementById('editRoll').value = '';
    
    if (type === 'edit' && roll) {
        currentEditRoll = roll;
        const student = searchStudent(roll);
        if (student) {
            modalTitle.innerHTML = '<i class="fas fa-user-edit"></i> Edit Student';
            document.getElementById('rollInput').value = student.roll;
            document.getElementById('rollInput').disabled = true;
            document.getElementById('nameInput').value = student.name;
            document.getElementById('ageInput').value = student.age;
            document.getElementById('branchInput').value = student.branch;
            document.getElementById('marksInput').value = student.marks;
            document.getElementById('editRoll').value = roll;
        }
    } else {
        currentEditRoll = null;
        modalTitle.innerHTML = '<i class="fas fa-user-plus"></i> Add Student';
        document.getElementById('rollInput').disabled = false;
    }
    
    modal.classList.add('show');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('studentModal');
    modal.classList.remove('show');
    currentEditRoll = null;
}

// Open delete confirmation modal
function openDeleteModal(roll, name) {
    const modal = document.getElementById('deleteModal');
    document.getElementById('deleteStudentName').textContent = name;
    currentDeleteRoll = roll;
    modal.classList.add('show');
}

// Close delete modal
function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.classList.remove('show');
    currentDeleteRoll = null;
}

// Save student (add or update)
function saveStudent(event) {
    event.preventDefault();
    
    const roll = document.getElementById('rollInput').value.trim();
    const name = document.getElementById('nameInput').value.trim();
    const age = document.getElementById('ageInput').value.trim();
    const branch = document.getElementById('branchInput').value;
    const marks = document.getElementById('marksInput').value.trim();
    const editRoll = document.getElementById('editRoll').value;
    
    let result;
    
    if (editRoll) {
        // Update existing student
        result = updateStudent(editRoll, { name, age, branch, marks });
        if (result.success) {
            showToast('Student updated successfully!', 'success');
        } else {
            showToast(result.message, 'error');
        }
    } else {
        // Add new student
        const student = { roll, name, age, branch, marks };
        result = addStudent(student);
        if (result.success) {
            showToast('Student added successfully!', 'success');
        } else {
            showToast(result.message, 'error');
            return;
        }
    }
    
    closeModal();
    renderStudents();
    updateStats();
}

// Confirm delete
function confirmDelete() {
    if (currentDeleteRoll) {
        const result = deleteStudent(currentDeleteRoll);
        if (result.success) {
            showToast('Student deleted successfully!', 'success');
        } else {
            showToast(result.message, 'error');
        }
        
        closeDeleteModal();
        renderStudents();
        updateStats();
    }
}

// ============ TOAST NOTIFICATIONS ============

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Remove toast after animation completes
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

// Close modal when clicking outside
document.getElementById('studentModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

document.getElementById('deleteModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeDeleteModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
        closeDeleteModal();
    }
});
