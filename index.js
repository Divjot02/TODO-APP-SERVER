const express = require("express");
const fs = require("fs");
const app = express();
//hrr request se pelle chlega, request mein json ari h usmese data nikalega and  request ke andr body m append krdega
app.use(express.json());
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/styles.css", (req, res) => {
  res.sendFile(__dirname + "/styles.css");
});
app.get("/script.js", (req, res) => {
  res.sendFile(__dirname + "/script.js");
});
function readAllTodos(callback) {
  fs.readFile("./store.json", "utf-8", function (err, data) {
    if (err) {
      callback(err);
      return;
    }

    if (data.length === 0) {
      data = "[]";
    }

    try {
      data = JSON.parse(data);
      callback(null, data);
    } catch (err) {
      callback(err);
    }
  });
}
function saveTodoInFile(todo, callback) {
  fs.writeFile("./store.json", JSON.stringify(todo), function (err) {
    if (err) {
      callback(err);
      return;
    }

    callback(null);
  });
}

app.post("/todo", (req, res) => {
  const todo = req.body;
  readAllTodos(function (err, data) {
    if (err) {
      res.status(500).send("error");
      return;
    }
    data.push(todo);

    saveTodoInFile(data, function (err) {
      if (err) {
        res.status(500).send("error");
        return;
      }

      res.status(200).send("Todo successfully added");
    });
  });
});

app.get("/todo-data", function (req, res) {
  readAllTodos(function (err, data) {
    if (err) {
      res.status(500).send("error");
      return;
    }
    res.status(200).json(data);
  });
});
app.put("/update", function (req, res) {
  const updId = req.body.id;
  const complete = req.body.isComplete;
  readAllTodos(function (err, data) {
    if (err) {
      res.status(500).send("error");
      return;
    }
    //find the todo with id to modify its status
    const updateddata = data.find((d) => d.id === updId);

    updateddata.isComplete = complete;
    //save the modified data into file
    saveTodoInFile(data, (err) => {
      if (err) {
        res.status(500).send("error");
        return;
      }

      res.status(200).send("Todo status changed");
    });
  });
});
app.delete("/delete", function (req, res) {
  const delId = req.body.id;

  readAllTodos(function (err, data) {
    if (err) {
      res.status(500).send("error");
      return;
    }
    ///get the data after deletion
    const updateddata = data.filter((d) => d.id !== delId);
    //save this into file
    saveTodoInFile(updateddata, (err) => {
      if (err) {
        res.status(500).send("error");
        return;
      }

      res.status(200).send("Todo deleted");
    });
  });
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
