const Database = require('better-sqlite3');
const db = new Database('roleplays.db');

console.log('=== Testing Database ===');

// Check tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('\nTables:', tables.map(t => t.name));

// Check prep_notes table structure
try {
    const columns = db.prepare('PRAGMA table_info(prep_notes)').all();
    console.log('\nprep_notes columns:', columns);
} catch (err) {
    console.log('\nprep_notes table does not exist!');
}

// Try to query prep_notes
try {
    const notes = db.prepare('SELECT * FROM prep_notes').all();
    console.log('\nExisting notes:', notes);
} catch (err) {
    console.log('\nError querying prep_notes:', err.message);
}

db.close();

