"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path = __importStar(require("path"));
const electron_1 = require("electron");
const migrations_1 = require("./migrations");
class DatabaseService {
    db = null;
    isInitialized = false;
    initialize() {
        if (this.isInitialized)
            return;
        try {
            // Create/open the sqlite database in the userData directory per specification
            const dbPath = path.join(electron_1.app.getPath('userData'), 'gliv.sqlite');
            this.db = new better_sqlite3_1.default(dbPath, {
            // Enable WAL mode for better performance
            });
            this.db.pragma('journal_mode = WAL');
            this.db.pragma('foreign_keys = ON');
            // Run migrations (currently an empty scaffold)
            (0, migrations_1.runMigrations)(this.db);
            this.isInitialized = true;
            console.log(`Database initialized at: ${dbPath}`);
        }
        catch (error) {
            console.error('Failed to initialize database:', error);
            throw error;
        }
    }
    isReady() {
        return this.isInitialized && this.db !== null && this.db.open;
    }
    close() {
        if (this.db) {
            this.db.close();
            this.isInitialized = false;
        }
    }
    /**
     * Returns the underlying better-sqlite3 database instance.
     * Required by services (like ProviderManager) for write operations.
     */
    getDb() {
        if (!this.db) {
            throw new Error('Database not initialized');
        }
        return this.db;
    }
}
exports.DatabaseService = DatabaseService;
