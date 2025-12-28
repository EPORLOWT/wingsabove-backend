const express = require("express");
const app = express();

const API_KEY = process.env.AERODATA_KEY;

app.get("/enrich", async (req, res) => {
  try {
    const cs = (req.query.callsign || "").trim().toUpperCase();
    if (!cs) return res.status(400).json({ error: "callsign required" });

    const url =
      `https://aerodatabox.p.rapidapi.com/flights/number/${cs}` +
      `?withAircraftImage=false&withLocation=false&withAircraft=false`;

    const resp = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "aerodatabox.p.rapidapi.com"
      }
    });

    if (!resp.ok) return res.status(500).json({ error: "api failure" });

    const data = await resp.json();
    if (!Array.isArray(data) || !data.length)
      return res.json({ found:false });

    const f = data[0];

    res.json({
      found: true,
      airline: f?.airline?.name || "",
      model: f?.aircraft?.model || "",
      origin: f?.departure?.airport?.iata || "",
      destination: f?.arrival?.airport?.iata || ""
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error:"server error" });
  }
});

app.get("/", (_, res)=> res.send("WingsAbove API Online"));

app.listen(process.env.PORT || 10000, ()=> {
  console.log("Server running");
});
