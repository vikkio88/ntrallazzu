#!/usr/bin/env node

import { argv } from "process";
import { main } from "./src/main.js";

main(argv.slice(2));

