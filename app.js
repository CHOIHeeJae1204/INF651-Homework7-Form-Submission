const express = require("express");
const path = require("path");
const fs = require("fs");
const multiparty = require("multiparty");
const hbs = require("hbs");

const app = express();
const PORT = 3000;

// Middleware
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ENSURE uploads directory exists
const uploadsDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`✓ Created uploads directory at ${uploadsDir}`);
}

app.get("/", (req, res) => res.redirect("/register"));

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const form = new multiparty.Form();

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error("❌ Form parsing error:", err);
            return res.status(400).send("Error parsing the form.");
        }

        // multiparty stores values as arrays
        const fullName = fields.fullName ? fields.fullName[0] : "";
        const email = fields.email ? fields.email[0] : "";
        const courseTrack = fields.courseTrack ? fields.courseTrack[0] : "";

        // Validation: check file exists
        const uploadedFile = files.profilePic ? files.profilePic : null;

        if (!uploadedFile || uploadedFile.length === 0) {
            return res.status(400).send("No file uploaded. Please upload a profile picture.");
        }

        const file = uploadedFile[0];
        const originalFileName = file.originalFilename;
        const tempFilePath = file.path;

        const allowedExtensions = [".jpg", ".jpeg", ".png"];
        const ext = path.extname(originalFileName).toLowerCase();

        if (!allowedExtensions.includes(ext)) {
            try { fs.unlinkSync(tempFilePath); } catch (_) { }
            return res.status(400).send("Invalid file type. Only .jpg, .jpeg, .png allowed.");
        }

        const timestamp = Date.now();
        const safeName =
            fullName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "") || "user";

        const fileName = `${timestamp}_${safeName}${ext}`;
        const finalFilePath = path.join(uploadsDir, fileName);

        fs.rename(tempFilePath, finalFilePath, (moveErr) => {
            if (moveErr) {
                console.error("❌ File move error:", moveErr);
                if (fs.existsSync(tempFilePath)) {
                    try { fs.unlinkSync(tempFilePath); } catch (_) { }
                }
                return res.status(500).send("Error saving the uploaded file.");
            }

            const imagePath = `/uploads/${fileName}`;

            return res.render("profile", {
                fullName,
                email,
                courseTrack,
                imagePath,
            });
        });
    });
});

app.use((req, res) => {
    res.status(404).send("404 - Not Found");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});