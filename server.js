const express = require("express");
const session = require("express-session");
const app = express();
const flash = require("connect-flash");
const path = require("path");
const RSA = require("./cryptoDir/RSA");

app.use(express.json());
app.use(flash());

app.use(
  session({
    secret: "your secret key",
    saveUninitialized: true,
    resave: true,
  })
);
const rsa = new RSA.default();
const serverKeys = rsa.generateKeyPair("survybviuerv", "vaoeruyvbvi");

const userData = {
  name: "tabor",
};

const chatMessage = require("./models/chatMessage");
const profile = require("./models/profile");

const mongoose = require("mongoose");

const mongoURI =
  "mongodb+srv://taborgreat:4RItcoXARM01azej@cluster0.lh8r06j.mongodb.net/Chatroom?retryWrites=true&w=majority";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log("working");
  username = req.session.user?.username || "guest";
  res.render("index", { username });
});

app.get("/getUpdatedMessages", async (req, res) => {
  try {
    const updatedMessages = await chatMessage.find({}).exec();

    res.json(updatedMessages);
  } catch (err) {
    console.error("Error fetching updated messages:", err);
    res.status(500).json({ error: "Error fetching updated messages" });
  }
});

app.get("/register", (req, res) => {
  const errorFlashMessages = req.flash("error");
  const message = errorFlashMessages.length > 0 ? errorFlashMessages[0] : "";
  res.render("register", { message });
});

app.get("/login", (req, res) => {
  const errorFlashMessages = req.flash("error");
  const message = errorFlashMessages.length > 0 ? errorFlashMessages[0] : "";
  res.render("login", { message });
});

app.post("/register", async (req, res) => {
  const formData = req.body;

  async function checkIfUserExist() {
    const query = { username: formData.username };

    try {
      const document = await profile.findOne(query);
      return !!document; // Returns true if the document exists, false otherwise
    } catch (error) {
      // Handle any errors that occurred during the query
      console.error("Error checking if document exists:", error);
      return false;
    }
  }

  if (await checkIfUserExist()) {
    console.log("user already exist");
    req.flash("error", "Username already exists. Try again.");
    res.redirect("/register");
  } else {
    const user = new profile({
      username: formData.username,
      password: formData.password,
    });
    console.log(req.body);

    user
      .save()
      .then((result) => {
        // Respond with the saved message
        req.flash("error", "Account Successfully Created");
        res.redirect("login");
      })
      .catch((err) => {
        console.error("Error saving message:", err);
        res.status(500).json({ error: "Error saving message" });
      });
  }
});

app.post("/login", async (req, res) => {
  const formData = req.body;

  async function checkIfUserExist() {
    const query = { username: formData.username, password: formData.password };

    try {
      const document = await profile.findOne(query);
      return !!document; // Returns true if the document exists, false otherwise
    } catch (error) {
      // Handle any errors that occurred during the query
      console.error("Error checking if document exists:", error);
      return false;
    }
  }

  if (await checkIfUserExist()) {
    console.log("Login success");
    req.flash("error", "Log in successful.");
    req.session.user = {
      username: formData.username,
    };
    res.redirect("/");
  } else {
    console.log("login failed");
    req.flash("error", "Incorrect login information.");
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  req.session.user = {
    username: "guest",
  };
  req.flash("error", "");
  res.redirect("/");
});

app.post("/submitMessage", (req, res) => {
  const formData = req.body;
  const message = new chatMessage({
    name: req.session.user?.username || "guest",
    message: formData.message, // message: rsa.decryptMessage(formData.message,serverKeys.privateKey)
  });

  // Save the message to the database
  message
    .save()
    .then((result) => {
      // Respond with the saved message
      res.json(result);
    })
    .catch((err) => {
      console.error("Error saving message:", err);
      res.status(500).json({ error: "Error saving message" });
    });
});

const port = 3000;
const localIPAddress = "10.0.0.48";

app.listen(port, localIPAddress, () => {
  console.log(`Server is running on http://${localIPAddress}:${port}`);
});
