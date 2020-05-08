#!/usr/bin/env node
const dev0 = require(".");

// CLI arguments
const availableArgs = [
  {
    name: "port",
    defaultValue: dev0.defaultPort,
    description: "Port to use",
    alias: [
      "-p",
      "--port"
    ],
    validate: v => !isNaN(v),
    parse: v => parseInt(v)
  },
  {
    name: "help",
    description: "Display this help",
    bool: true,
    alias: [
      "-h",
      "--help"
    ]
  }
];

const showHelp = () => {
  console.log("Description:")
  console.log("  A zero-dependency static file server for development");
  console.log("\nUsage:");
  console.log("  dev0 [options] <folders>");
  console.log("\nOptions:");
  availableArgs.forEach(availableArg => {
    let out = `  ${availableArg.alias.join(", ")}\t${availableArg.description}`;

    if (availableArg.defaultValue != null) {
      out += ` (Default: ${availableArg.defaultValue})`;
    }
    console.log(`${out}`);
  });
  console.log("\nExamples:");
  console.log("  dev0 blog");
  console.log("  dev0 -p 8080 blog");
  console.log("  dev0 blog build");
  console.log("");
};

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
    if (argType.bool === true) {
      options[argType.name] = true;
    } else {
      currentArg = argType;
    }
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

if (options.help === true) {
  showHelp();
  process.exit(0);
}

if (folders.length === 0) {
  console.log("[ERROR] You should define at least one folder\n");
  showHelp();
  process.exit(1);
}

dev0(folders, options);