// Student Management System - JavaScript (Flask API Version)

// ============ API FUNCTIONS ============

// Load students from Flask API
async function loadStudents() {
    try {
        const response = await fetch('/api/students');
        return await response.json();
    } catch (error) {
        console.error('Error loading students:', error);
        return [];
    }
}

// Get statistics from Flask API
async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        return await response.json();
    } catch (error) {
        console.error('Error loading stats:', error);
        return { total: 0, avg_marks: 0, top_marks: 0, branches: 0 };
    }
}

// Add student via API
async function addStudent(student) {
    try {
        const response = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(student)
        });
        const result = await response.json();
        return { success: response.ok, message: result.message };
    } catch (error) {
        console.error('Error adding student:', error);
        return { success: false, message: 'Error adding student!' };
    }
}

// Search student via API
async function searchStudent(roll) {
    try {
        const response = await fetch(`/api/students/${roll}`);
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Error searching student:', error);
        return null;
    }
}

// Update student via API (using index)
async function updateStudent(index, updatedData) {
    try {
        const response = await fetch(`/api/students/index/${index}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });
        const result = await response.json();
        return { success: response.ok, message: result.message };
    } catch (error) {
        console.error('Error updating student:', error);
        return { success: false, message: 'Error updating student!' };
    }
}

// Delete student via API (using index)
async function deleteStudentAPI(index) {
    try {
        const response = await fetch(`/api/students/index/${index}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        return { success: response.ok, message: result.message };
    } catch (error) {
        console.error('Error deleting student:', error);
        return { success: false, message: 'Error deleting student!' };
    }
}

// ============ UI FUNCTIONS ============

let currentEditIndex = null;
let currentDeleteIndex = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    await renderStudents();
    await updateStats();
    setupSearch();
});

// Render all students in the table
async function renderStudents(students = null) {
    const tbody = document.getElementById('studentTableBody');
    const emptyState = document.getElementById('emptyState');
    
    if (students === null) {
        students = await loadStudents();
    }
    
    if (!students || students.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.add('show');
        return;
    }
    
    emptyState.classList.remove('show');
    tbody.innerHTML = '';
    
    students.forEach((student, index) => {
        const marks = parseInt(student.marks);
        let marksClass = 'marks-low';
        if (marks >= 75) marksClass = 'marks-high';
        else if (marks >= 50) marksClass = 'marks-medium';
        
        const encodedRoll = encodeURIComponent(student.roll);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${student.roll}</strong></td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.branch}</td>
            <td><span class="marks-badge ${marksClass}">${student.marks}%</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="openModal('edit', ${index})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete-small" onclick="openDeleteModal(${index}, '${student.name}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Update statistics cards
async function updateStats() {
    const stats = await loadStats();
    
    document.getElementById('totalStudents').textContent = stats.total;
    document.getElementById('avgMarks').textContent = stats.avg_marks + '%';
    document.getElementById('topMarks').textContent = stats.top_marks + '%';
    document.getElementById('totalBranches').textContent = stats.branches;
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', async function(e) {
        const query = e.target.value.toLowerCase().trim();
        
        if (query === '') {
            await renderStudents();
            return;
        }
        
        const students = await loadStudents();
        const filtered = students.filter(s => 
            s.name.toLowerCase().includes(query) || 
            s.roll.toLowerCase().includes(query) ||
            s.branch.toLowerCase().includes(query)
        );
        
        await renderStudents(filtered);
    });
}

// ============ MODAL FUNCTIONS ============

async function openModal(type, index = null) {
    const modal = document.getElementById('studentModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('studentForm');
    
    form.reset();
    document.getElementById('editIndex').value = '';
    
    if (type === 'edit' && index !== null) {
        const students = await loadStudents();
        const student = students[index];
        if (student) {
            currentEditIndex = index;
            modalTitle.innerHTML = '<i class="fas fa-user-edit"></i> Edit Student';
            document.getElementById('rollInput').value = student.roll;
            document.getElementById('rollInput').disabled = true;
            document.getElementById('nameInput').value = student.name;
            document.getElementById('ageInput').value = student.age;
            document.getElementById('branchInput').value = student.branch;
            document.getElementById('marksInput').value = student.marks;
            document.getElementById('editIndex').value = index;
        }
    } else {
        currentEditIndex = null;
        modalTitle.innerHTML = '<i class="fas fa-user-plus"></i> Add Student';
        document.getElementById('rollInput').disabled = false;
    }
    
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('studentModal');
    modal.classList.remove('show');
    currentEditIndex = null;
}

function openDeleteModal(index, name) {
    const modal = document.getElementById('deleteModal');
    document.getElementById('deleteStudentName').textContent = name;
    currentDeleteIndex = index;
    modal.classList.add('show');
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.classList.remove('show');
    currentDeleteIndex = null;
}

async function saveStudent(event) {
    event.preventDefault();
    
    const roll = document.getElementById('rollInput').value.trim();
    const name = document.getElementById('nameInput').value.trim();
    const age = document.getElementById('ageInput').value.trim();
    const branch = document.getElementById('branchInput').value;
    const marks = document.getElementById('marksInput').value.trim();
    const editIndex = document.getElementById('editIndex').value;
    
    let result;
    
    if (editIndex !== '') {
        result = await updateStudent(editIndex, { name, age, branch, marks });
        if (result.success) {
            showToast('Student updated successfully!', 'success');
        } else {
            showToast(result.message, 'error');
        }
    } else {
        const student = { roll, name, age, branch, marks };
        result = await addStudent(student);
        if (result.success) {
            showToast('Student added successfully!', 'success');
        } else {
            showToast(result.message, 'error');
            return;
        }
    }
    
    closeModal();
    await renderStudents();
    await updateStats();
}

async function confirmDelete() {
    if (currentDeleteIndex !== null) {
        const result = await deleteStudentAPI(currentDeleteIndex);
        if (result.success) {
            showToast('Student deleted successfully!', 'success');
        } else {
            showToast(result.message, 'error');
        }
        
        closeDeleteModal();
        await renderStudents();
        await updateStats();
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
    
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

// Close modal when clicking outside
document.getElementById('studentModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

document.getElementById('deleteModal').addEventListener('click', function(e) {
    if (e.target === this) closeDeleteModal();
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
        closeDeleteModal();
    }
});
