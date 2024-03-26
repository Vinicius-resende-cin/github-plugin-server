import "dotenv/config";

// Server configuration
const serverPort = process.env.SERVER_PORT || 4000;

// Analysis persistence configuration
const persistenceType = process.env.PERSISTENCE_TYPE || "file";
const persistencePath = process.env.PERSISTENCE_PATH || "src/data/analysisOutputs.json";

// Database configuration
const connectionString = process.env.ATLAS_URI || "";
const collectionName = "analysis";

export { serverPort, persistenceType, persistencePath, connectionString, collectionName };
