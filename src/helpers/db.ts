import { openDatabase } from "expo-sqlite";

const NAME = "workout";
const VERSION = "2.0";

export const db = openDatabase(NAME, VERSION);
