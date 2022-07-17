import { openDatabase } from "expo-sqlite";

const NAME = "workout";
const VERSION = "1.1";

export const db = openDatabase(NAME, VERSION);
