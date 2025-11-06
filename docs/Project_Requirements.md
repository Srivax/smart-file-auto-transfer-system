# Smart File AutoTransfer System – Functional Specification

## 🎯 Project Goal
To build a unified MERN-based dashboard that automates uploading, analyzing, and sharing of student academic reports among Teachers, Principals, Students, and Parents.

## 👥 User Roles
- Teacher
- Principal
- Student
- Parent

## 🧩 Functional Requirements
1. Teachers can upload Excel mark files.
2. System validates file format and missing data.
3. The principal can view overall class analytics.
4. Students can view and download their reports.
5. Parents can access their child’s progress report.

## ⚙️ Non-Functional Requirements
1. Upload must finish within 5 seconds for 100 records.
2. Role-based access control (JWT).
3. System uptime 99%.
4. Responsive UI for all devices.

## 🔁 Workflow
1. Teacher uploads Excel.
2. Backend validates & stores data.
3. The system analyzes marks to generate charts.
4. The principal dashboard shows summaries.
5. Students & Parents view/download PDF reports.

## 📦 Future Enhancements
- Email notification on new report upload.
- Performance comparison between terms.

💾 Save the file and check Markdown preview for alignment.
