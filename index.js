const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const _ = require("lodash");
const cors = require('cors')
app.use(cors());
// Set the view engine to EJS
app.set("view engine", "ejs");

// Middleware for parsing application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files directory
app.use(express.static(path.join(__dirname, "public")));

// Database connection
const mongoDBUri = "mongodb+srv://Angelo:WLJWOkYfAd6TjMIE@cluster0.jgbsgrq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true });


// Mongoose schema for blogs
const todoSchema = new mongoose.Schema({
    title: String,
    desc: String,
    date: { type: Date, default: Date.now },
    tags: [String],
    checked: { type: Boolean, default: false }
});


const Todo = mongoose.model("Todo", todoSchema);

app.get("/", async (req, res) => {
    try {
        const posts = await Todo.find({});
        res.render("todo", { posts });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching posts');
    }
});

app.post("/compose", async (req, res) => {
    const newTodo = new Todo({
        title: req.body.title,
        desc: req.body.desc,
        tags: req.body.tags.split(',').map(tag => tag.trim()) // convert comma-separated string to array
    });
    try {
        await newTodo.save();
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving post');
    }
});


app.post('/posts/:field/:id/:tf', async (req, res) => {
    try {
        const result = await Todo.findByIdAndUpdate(req.params.id, {[req.params.field]: req.params.tf === "true"})
        console.log(result, req.params)
        if (!result) {
            return res.status(404).send('Post not found');
        }
        
        res.redirect('/'); // Redirect to the homepage or another appropriate page
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating Todo item');
    }
});

app.post('/posts/delete/:id', async (req, res) => {
    try {
        const result = await Todo.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).send('Todo not found');
        }
        res.redirect('/'); // Redirect to the homepage or another appropriate page
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting todo');
    }
});

app.listen(3000);
