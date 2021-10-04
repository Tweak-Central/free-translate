const express = require("express");

const api = require("./api");

module.exports = (app) => {
    // API
    app.use("/api", api);

    // Handle front-end requests

    app.use(express.static("../../client/dist"));
};
