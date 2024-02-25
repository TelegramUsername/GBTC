const express = require("express");
const router = express.Router();
const axios = require("axios");

// JDoodle API endpoint
router.post("/compile", async (req, res) => {
  const { code } = req.body;

  // Ensure the code variable is not empty
  if (!code) {
    return res.status(400).send("No code provided");
  }

  try {
    const jdoodleResponse = await axios.post(
      "https://api.jdoodle.com/v1/execute",
      {
        clientId: "",
        clientSecret:
          "",
        script: code,
        language: "cpp",
        versionIndex: "0",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Send JDoodle's response back to the client
    res.json(jdoodleResponse.data);
  } catch (error) {
    console.error("Error calling JDoodle API:", error.message);
    res.status(500).send("Failed to compile code");
  }
});

module.exports = router;