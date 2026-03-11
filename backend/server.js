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
    url: `https://birthday-wish-app-h3vf.onrender.com/card/${id}`,
  });
});

app.get("/card/:id", (req, res) => {
  const card = cards[req.params.id];

  if (!card) return res.send("Card not found");

  const photoHTML = card.photo
    ? `<img src="/uploads/${card.photo}" 
    style="
      width:400px;
      height:550px;
      object-fit: cover;
      border-radius:15px;
      margin-top:15px;
      box-shadow:0 6px 20px rgba(0,0,0,0.2);"
    />`
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
    height:200vh;
    background:#e4ebff;
    font-family:sans-serif;
    text-align:center;
  ">
  
    <div style="
  background:white;
  padding:80px;
  border-radius:25px;
  width:900px;
  max-width:500px;
  min-height: 600px;
  box-shadow:0 10px 30px rgba(0,0,0,0.2);
">

      <h1>🎂 Happy Birthday ${card.name}! 🎉</h1>
      <p>${card.message}</p>

      ${photoHTML}

      <br/><br/>

     <button onclick="playMusic()" style="
  padding:10px 20px;
  font-size:16px;
  border:none;
  border-radius:5px;
  background:#101c6b;
  color:white;
  cursor:pointer;
">

        ▶ More Pom-Pom!!
      </button>

      <audio id="music" src="https://pixabay.com/music/happy-childrens-tunes-happy-birthday-469282/"></audio>
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

//app.listen(5000, () => console.log("Server running on http://localhost:5000"));
