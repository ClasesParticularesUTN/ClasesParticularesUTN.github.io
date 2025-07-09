const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { exec, spawn } = require("child_process");
const { randomUUID } = require("crypto");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/compile", (req, res) => {
  const { code, input } = req.body;
  const id = randomUUID(); // identificador único
  const cppPath = `temp_${id}.cpp`;
  const binPath = `temp_${id}`;

  fs.writeFileSync(cppPath, code);

  exec(`g++ ${cppPath} -o ${binPath}`, (compileErr, stdout, stderr) => {
    if (compileErr) {
      const humanizado = humanizarErrores(stderr);
      limpiarArchivos(cppPath, binPath);
      return res.json({
        output: `${humanizado}\n\nMensaje original de compilador:\n${stderr}`
      });
    }

    const proceso = spawn(`./${binPath}`);
    let output = "";
    let error = "";

    if (input) proceso.stdin.write(input);
    proceso.stdin.end();

    proceso.stdout.on("data", data => (output += data.toString()));
    proceso.stderr.on("data", data => (error += data.toString()));

    proceso.on("close", code => {
      limpiarArchivos(cppPath, binPath);
      res.json({ output: error || output });
    });

    proceso.on("error", err => {
      limpiarArchivos(cppPath, binPath);
      res.json({ output: `Error al ejecutar: ${err.message}` });
    });
  });
});

function limpiarArchivos(...archs) {
  for (const file of archs) {
    fs.unlink(file, err => {}); // silenciosamente ignora errores
  }
}

function humanizarErrores(stderr) {
  const errores = [];

  if (/expected.*;/.test(stderr)) {
    const match = stderr.match(/(\d+):\d+: error: expected .+?;/);
    if (match) errores.push(`🚫 Te falta un punto y coma en la línea ${match[1]}.`);
  }

  if (/was not declared in this scope/.test(stderr)) {
    const match = stderr.match(/‘(.+?)’ was not declared in this scope/);
    if (match) errores.push(`🔍 La variable o función '${match[1]}' no está declarada.`);
  }

  return errores.length ? errores.join("\n") : "❗ Error de compilación.";
}

app.listen(3000, () => {
  console.log("Servidor escuchando en puerto 3000");
});
