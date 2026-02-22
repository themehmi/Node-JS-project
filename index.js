const express = require('express');
const app = express();
const port = 3001;
const path = require("path");
const mongoose = require("mongoose");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb://localhost:27017/Expense")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['Food', 'Rent', 'Transport', 'Entertainment', 'Other'], 
    default: 'Other' 
  },
  date: { type: Date, default: Date.now }
});

const Expense = mongoose.model("Expense", expenseSchema);

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/submit", async (req, res) => {
   
  try {
    const { title, amount, category, date} = req.body;

    // Save to database
    const newExpense = new Expense({
      title,
      amount,
      category,
      date
    });

    await newExpense.save();

    res.redirect("/expenses");
  } catch (error) {
    res.send("Error saving data");
    console.log(error);
  }
   
});

app.get("/expenses", async (req, res) => {
  const expenses = await Expense.find();
  console.log(expenses);
  res.render("expenses", { expenses : expenses });
});



app.get("/edit/:id", async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  res.render("edit", { expense });
});

app.post("/update/:id", async (req, res) => {
  const { name, email, age } = req.body;
  try {
    await Expense.findByIdAndUpdate(req.params.id, { name, email, age });
    res.redirect("/expenses");
  } catch (error) {
    res.send("Error updating data");
  }
});

app.get("/delete/:id", async (req, res) =>{
  try{
    await Expense.findByIdAndDelete(req.params.id);
    res.redirect("/expenses");
  }catch(error){
    res.send("Error deleting data");  
  }
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
