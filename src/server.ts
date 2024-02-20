import express from "express";
import cors from "cors";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

import { Router, Request, Response } from "express";
import bodyParser from "body-parser";

const app = express();

const route = Router();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

route.get("/", (req: Request, res: Response) => {
  return res.json({ message: "QRCODE NODEJS" });
});

route.post("/generate", (req: Request, res: Response) => {
  const { content } = req.body;

  try {
    QRCode.toDataURL(
      content,
      { errorCorrectionLevel: "H" },
      function (err, url) {
        const image = url.replace(/^data:image\/\w+;base64,/, "");
        const imageBuffer = Buffer.from(image, "base64");

        const filePath = path.join(
          __dirname,
          "downloads",
          `${new Date().getTime()}-qrcode.png`
        );
        fs.writeFileSync(filePath, imageBuffer);

        res.setHeader(
          "Content-disposition",
          "attachment; filename=imagem_download.png"
        );
        res.setHeader("Content-type", "image/png");

        // Enviar a imagem como resposta
        return res.sendFile(filePath);
      }
    );
  } catch (error) {
    return res.status(400).json({ error: error });
  }
});

app.use(route);

app.listen(3333, () => "server running on port 3333");
