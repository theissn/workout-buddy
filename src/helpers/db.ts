import { openDatabase } from "expo-sqlite";
import * as SQLite from "expo-sqlite";

const NAME = "workout";
const VERSION = "2.0";

export const db = SQLite.openDatabase(NAME, VERSION);
