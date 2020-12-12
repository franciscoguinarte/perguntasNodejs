//Imports

const { render } = require("ejs");
const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./database/database");
const app = express();
const perguntaModel = require("./database/Perguntas");
const Pergunta = require("./database/Perguntas");
const Resposta = require("./database/Resposta");

//Configs
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB CONFIG
connection
  .authenticate()
  .then(() => {
    console.log("Database is running...");
  })
  .catch((err) => {
    console.log("Error on starting database :" + err);
  });
//Routes
app.get("/", (req, res) => {
  Pergunta.findAll({ raw: true, order: [["createdAt", "desc"]] })
    .then((perguntas) => {
      res.render("index.ejs", {
        perguntas: perguntas,
      });
    })
    .catch((e) => {
      console.log("Cannot find Perguntas because ..." + e);
    });
});
app.get("/perguntas", (req, res) => {
  res.render("perguntas.ejs");
});
app.post("/salvarpergunta", (req, res) => {
  let perg = req.body.perg;
  let desc = req.body.desc;

  // res.send("Formulario Enviado" + perg + desc);

  Pergunta.create({
    titulo: perg,
    descricao: desc,
  })
    .then(() => {
      console.log("Table filled with " + perg + "AND" + desc);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(e);
    });
});

app.get("/pergunta/:id", (req, res) => {
  let id = req.params.id;

  Pergunta.findOne({
    where: { id: id },
  }).then((pergunta) => {
    if (pergunta != undefined) {
      Resposta.findAll({ where: { perguntaId: pergunta.id } }).then(
        (respostas) => {
          res.render("pergunta", {
            pergunta: pergunta,
            respostas: respostas,
          });
        }
      );
    } else {
      res.redirect("/");
    }
  });
});

app.post("/responder", (req, res) => {
  var corpo = req.body.corpo;
  var perguntaId = req.body.pergunta;
  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId,
  }).then(() => {
    res.redirect("/pergunta/" + perguntaId);
  });
});

//Server
app.listen(8080, () => {
  console.log("Server is running...");
});
