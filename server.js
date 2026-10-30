
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Temporary storage for testing
const users = [];
const blogs = [];

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to My Blog Backend!",
        status: "Server is running successfully"
    });
});

// Register API
app.post("/api/register", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Please fill in all fields."
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must contain at least 6 characters."
        });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (users.some(user => user.email === normalizedEmail)) {
        return res.status(409).json({
            message: "This email is already registered."
        });
    }

    users.push({
        id: Date.now().toString(),
        name: name.trim(),
        email: normalizedEmail,
        password
    });

    res.status(201).json({
        message: "Registration successful!",
        user: {
            name: name.trim(),
            email: normalizedEmail
        }
    });
});

// Login API
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Please enter your email and password."
        });
    }

    const user = users.find(
        item => item.email === email.trim().toLowerCase()
    );

    if (!user || user.password !== password) {
        return res.status(401).json({
            message: "Invalid email or password."
        });
    }

    res.json({
        message: "Login successful!",
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});

// Create blog API
app.post("/api/blogs", (req, res) => {
    const { title, category, content } = req.body;

    if (!title || !category || !content) {
        return res.status(400).json({
            message: "Please fill in all blog fields."
        });
    }

    const blog = {
        id: Date.now().toString(),
        title: title.trim(),
        category,
        content: content.trim(),
        date: new Date().toLocaleDateString()
    };

    blogs.push(blog);

    res.status(201).json({
        message: "Blog published successfully!",
        blog
    });
});

// Get all blogs API
app.get("/api/blogs", (req, res) => {
    res.json({
        blogs: [...blogs].reverse()
    });
});

// Get individual blog API
app.get("/api/blogs/:id", (req, res) => {
    const blog = blogs.find(item => item.id === req.params.id);

    if (!blog) {
        return res.status(404).json({
            message: "Blog not found."
        });
    }

    res.json({ blog });
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        message: `Route not found: ${req.method} ${req.path}`
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
