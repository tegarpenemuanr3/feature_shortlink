// Import dependencies
import express from "express";
import { nanoid } from "nanoid";
import knex from "knex";
import knexfile from "./knexfile.js";

// Create a Knex connection
const connection = knex(knexfile.development);

// Create an Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Set up a route to create a shortlink
app.post("/shortlinks", async (req, res) => {
  // Generate a unique ID using nanoid
  const id = nanoid(7);

  try {
    const exist = await connection("shortlinks")
      .select("*")
      .where({ origin_path: req.body.origin_path })
      .first();

    if (exist) {
      res.send(`Shortlink created: http://localhost:7000/${exist.id}`);
    } else {
      await connection("shortlinks").insert({
        id,
        origin_path: req.body.origin_path,
      });
      res.send(`Shortlink created: http://localhost:7000/${id}`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});

app.get("/", (req, res) => {
  res.json({
    data: "Hello World",
  });
});

// Set up a route to handle shortlink redirects
app.get("/:id", async (req, res) => {
  // Retrieve the URL associated with the shortlink ID
  const id = req.params.id;

  await connection("shortlinks")
    .where({ id })
    .first()
    .then((row) => {
      if (row) {
        res.redirect(row.origin_path);
      } else {
        res.status(404).send("Shortlink not found");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal server error");
    });
});

// Start the server
const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
