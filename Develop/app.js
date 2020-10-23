//Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

//Sets up the Express app
const app = express();
const PORT = 3001;
let notes = require("./db/db.json");

//Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));

//Basic route that sends the user first to the AJAX page
//GET `/notes` - Should return the `notes.html` file.
app.get("/notes", function (req, res) {
  return res.sendFile(path.join(__dirname, "notes.html"));
});
//GET `*` - Should return the `index.html` file
app.get("*", function (req, res) {
  return res.sendFile(path.join(__dirname, "index.html"));
});

//The following API routes should be created:
//GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON
app.get("/api/notes", function (req, res) {
  return res.json(notes);
});

//POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
app.post("/api/notes", function (req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
  let newNote = req.body;
  let arrNote = [];
  arrNote.concat(
    fs.readFile("./db/db.json", "utf8", function (err) {
      if (err) {
        throw err;
      }
    })
  );
  arrNote.push(newNote);
  console.log("arr", arrNote);
  console.log(newNote);
  fs.writeFile(
    path.join(__dirname, "db/db.json"),
    JSON.stringify(arrNote),
    function (err) {
      if (err) {
        throw err;
      }
    }
  );

  // Using a RegEx Pattern to remove spaces from newCharacter
  // newNote.note = newNote.id.replace(/\s+/g, "").toLowerCase();
  //note key word came from index.js line 19: const saveNote = (note) =>

  res.json(newNote);
});

//DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique `id` when it's saved. In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.
app.get("/api/notes/:id", function (req, res) {
  const del = req.params.id;
  for (let i = 0; i < id.length; i++) {
    if (del === id[i].routeName) {
      return res.destroy(del);
    }
  }
});

//Starts the server to begin listening
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});