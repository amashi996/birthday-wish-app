const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();
app.use(cors());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const cards = {};

app.post("/create", upload.single("photo"), (req, res) => {
  const id = uuidv4();

  cards[id] = {
    name: req.body.name,
    message: req.body.message,
    photo: req.file ? req.file.filename : null,
  };

  res.json({
    url: `http://localhost:5000/card/${id}`,
  });
});

app.get("/card/:id", (req, res) => {
  const card = cards[req.params.id];

  if (!card) return res.send("Card not found");

  const photoHTML = card.photo
    ? `<img src="/uploads/${card.photo}" style="width:200px;border-radius:15px;margin-top:15px"/>`
    : "";

  res.send(`
  <html>
  <head>
    <title>Happy Birthday</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  </head>

  <body style="
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
    background:#ffe4e6;
    font-family:sans-serif;
    text-align:center;
  ">

    <div style="background:white;padding:40px;border-radius:20px;max-width:500px;">
      <h1>🎂 Happy Birthday ${card.name}! 🎉</h1>
      <p>${card.message}</p>

      ${photoHTML}

      <br/><br/>

      <button onclick="playMusic()" style="padding:10px 20px;font-size:16px">
        ▶ Play Birthday Music
      </button>

      <audio id="music" src="https://www2.cs.uic.edu/~i101/SoundFiles/HappyBirthday.mid"></audio>
    </div>

    <script>
      function playMusic(){
        document.getElementById('music').play();
        confetti({ particleCount: 150, spread: 100 });
      }

      setTimeout(()=>{
        confetti({ particleCount: 200, spread: 120 });
      },1000);
    </script>

  </body>
  </html>
  `);
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
