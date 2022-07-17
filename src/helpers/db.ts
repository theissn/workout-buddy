import { openDatabase } from "expo-sqlite";

const NAME = "workout";
const VERSION = "1.0";

export const db = openDatabase(NAME, VERSION);
