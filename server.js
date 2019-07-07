const express = require("express");
require("dotenv").config();
const jwt = require("express-jwt"); // Validate JWT and set req.user
const jwksRsa = require("jwks-rsa"); // Retrieve RSA keys from a JSON Web Key set (JWKS) endpoint that oauth0 exposes under our domain
const checkScope = require("express-jwt-authz"); // Validate JWT scopes

// A function to validate that the information inside a jwt is valid and assures that the jwt was generated by oauth0
// It uses the public signing key that oauth0 exposes for our domain
// Validation of jwt is done by 1. Verifying the signature, 2. Validating the claims (expiration, issued by, audience)
const checkJwt = jwt({
    // Dynamically provide a signing key based on the kid in the header
    // and the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
      cache: true, // cache the signing key
      rateLimit: true,
      jwksRequestsPerMinute: 5, // prevent attackers from requesting more than 5 per minute
      jwksUri: `https://${
        process.env.REACT_APP_AUTH0_DOMAIN
      }/.well-known/jwks.json`
    }),
  
    // Validate the audience and the issuer.
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
  
    // This must match the algorithm selected in the Auth0 dashboard under your app's advanced settings under the OAuth tab
    algorithms: ["RS256"]
});

const app = express();

app.get("/public", function(req, res) {
    res.json({
      message: "Hello from a public API!"
    });
});

app.get("/private", checkJwt, function(req, res) {
    res.json({
      message: "Hello from a private API!"
    });
});

app.get("/course", checkJwt, checkScope(["read:courses"]), function(req, res) {
    res.json({
      courses: [
        { id: 1, title: "Building Apps with React and Redux" },
        { id: 2, title: "Creating Reusable React Components" }
      ]
    });
});

app.listen(3001);
console.log("API server listening on " + process.env.REACT_APP_AUTH0_AUDIENCE);