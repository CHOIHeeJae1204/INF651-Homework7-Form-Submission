# INF651-Homework7-Form-Submission

# Simple User Registration App
## Part 1: The Registration Form (GET /register)
Create a view named register.hbs. It must include a form styled with Tailwind CSS.

### Required Fields:
1. Full Name (Text input)
2. Email Address (Email input)
3. Course Track (Dropdown: e.g., "Web Dev", "Data Science", "UX Design")
4. Profile Picture (File input - accepts .jpg, .jpeg, .png)
⚠️ Critical Warning: For your form to send the file correctly, you must set the encryption type on the form tag: <form action="/register" method="POST" enctype="multipart/form-data">

## Part 2: The Backend Logic (POST /register)
In app.js, create a route to handle the submission. You must use the multiparty library to parse the incoming request.

### Your Logic Flow:
1. Initialize the multiparty form.
2. Parse the request.
3. Validation:
   - Check if the user uploaded a file.
   - (Optional) Check if the file is an image.
4. File Handling:
   - Move the uploaded file from its temporary location to ./public/uploads.
   - Hint: Use the native Node fs (File System) module to rename/move the file.
5. Response:
   - Render the profile.hbs view, passing the user's name, email, course, and the path to their new image.

## Part 3: The Profile View (profile.hbs)
This page is the "Success" state. It should display:
- A welcome message (e.g., "Welcome, [Name]!").
- A summary of their registration details.
- The uploaded profile picture.
