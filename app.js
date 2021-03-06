//Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const shortid = require("shortid");
//Sets up the Express app
const app = express();
var PORT = process.env.PORT || 3001;

//Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public/assets"));
const dir = __dirname + "/public";

//Basic route that sends the user first to the AJAX page
//GET `/notes` - Should return the `notes.html` file.
app.get("/notes", function (req, res) {
  console.log(__dirname);
  return res.sendFile(path.join(dir, "notes.html"));
});
//GET `*` - Should return the `index.html` file
app.get("/", function (req, res) {
  console.log("__dirname");
  return res.sendFile(path.join(dir, "index.html"));
});

//GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON
app.get("/api/notes", function (req, res) {
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) {
      throw err;
    }
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  });
});

//  * POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
app.post("/api/notes", function (req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
  let newNote = req.body;
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) {
      throw err;
    }
    const jsonData = JSON.parse(data);
    //Give each note a unique `id` when it's saved
    newNote.id = shortid.generate();
    jsonData.push(newNote);

    fs.writeFile(
      path.join(__dirname, "db/db.json"),
      JSON.stringify(jsonData),
      function (err) {
        if (err) {
          throw err;
        }
        res.json(jsonData);
      }
    );
  });
});

//DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique `id` when it's saved. In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.
app.delete("/api/notes/:id", function (req, res) {
  fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", function (
    err,
    data
  ) {
    if (err) {
      throw err;
    }
    const id = req.params.id;
    let db = JSON.parse(data);
    for (let i = 0; i < db.length; i++) {
      if (db[i].id === id) {
        db.splice(i, 1);
        return fs.writeFile(
          path.join(__dirname, "/db/db.json"),
          JSON.stringify(db),
          function (err) {
            if (err) {
              throw err;
            }
            res.send(db);
          }
        );
      }
    }
  });
});

//Starts the server to begin listening
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
