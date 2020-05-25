#!/bin/node
const fs = require("fs");

const environment = process.argv[2]

const envFileContent = require(`./metro.config.${environment}.json`);

fs.writeFileSync("metro-env.json", JSON.stringify(envFileContent, undefined, 2));
