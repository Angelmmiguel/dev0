#!/usr/bin/env node
const dev0 = require(".");

// CLI arguments
const availableArgs = [
  {
    name: "port",
    defaultValue: dev0.defaultPort,
    description: "Port to use",
    alias: [
      "--port",
      "-p"
    ],
    validate: v => !isNaN(v),
    parse: v => parseInt(v)
  },
  {
    name: "help",
    description: "Display this help",
    alias: [
      "--help",
      "-h"
    ]
  }
];

// dev0 arguments
const folders = [];
const options = {};

// Set default values
availableArgs.forEach(arg => {
  if (arg.defaultValue != null) {
    options[arg.name] = arg.defaultValue
  }
});

// Process the arguments
const args = process.argv.slice(2);
let currentArg;

args.forEach(arg => {
  const argType = availableArgs.find(availableArg => availableArg.alias.includes(arg));

  if (currentArg == null && argType != null) {
    currentArg = argType;
  } else if (currentArg != null) {
    if (currentArg.validate(arg)) {
      options[currentArg.name] = typeof currentArg.parse === "function" ? currentArg.parse(arg) : arg;
    } else {
      console.log(`[ERROR] ${arg} is not a valid value for ${currentArg.name}`);
      process.exit(1);
    }
    currentArg = null
  } else if (arg.startsWith("-")) {
    console.log(`[ERROR] ${arg} is not a valid argument.`);
  } else {
    folders.push(arg);
  }
});

dev0(folders, options);