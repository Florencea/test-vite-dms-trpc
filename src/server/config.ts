import chalk from "chalk";
import { join } from "node:path";
import { exit } from "node:process";

/**
 * Is Server in production
 */
export const IS_PRODCTION = process.env.NODE_ENV === "production";
/**
 * Server port to listen
 *
 * from: `env.PORT`
 *
 * default: `3000`
 */
export const PORT = parseInt(process.env.PORT ?? "3000", 10);
/**
 * Server web base
 *
 * from: `env.VITE_WEB_BASE`
 *
 * default: `/`
 */
export const BASE = process.env.VITE_WEB_BASE ?? "/";
/**
 * Client output directory for Deployment
 *
 * from: `env.VITE_OUTDIR` + `/client`
 *
 * default: `dist/client`
 */
export const OUTDIR = process.env.VITE_OUTDIR
  ? join(process.env.VITE_OUTDIR, "client")
  : "dist/client";
/**
 * Server favicon
 *
 * from: `env.VITE_FAVICON`
 *
 * default: `vite.svg`
 */
export const FAVICON = process.env.VITE_FAVICON ?? "vite.svg";
/**
 * Server API route prefix
 *
 * from: `env.VITE_API_PREFIX`
 *
 * default: `/api`
 */
export const API_PREFIX = process.env.VITE_API_PREFIX ?? "/api";

const timestamp = chalk.gray(new Date().toLocaleTimeString("en-US"));
const plugin = chalk.bold.cyan("[vite-express]");
const message = chalk.green("Server Ready on");
const serverUrl = chalk.bold.cyan(
  IS_PRODCTION
    ? `port: ${PORT}, base: ${BASE}`
    : `http://localhost:${PORT}${BASE}`,
);
/**
 * Server ready message
 */
export const SERVER_READY_MESSAGE = `${timestamp} ${plugin} ${message} ${serverUrl}`;

/**
 * encrypted cookie name
 */
export const COOKIE_NAME = "sec";

/**
 * encrypted cookie secret
 */
export const COOKIE_SECRET = process.env.COOKIE_SECRET ?? "";

const messageError = chalk.red("No COOKIE_SECRET found in .env, exit");
if (!COOKIE_SECRET) {
  console.error(`${timestamp} ${plugin} ${messageError}`);
  exit(1);
}
