const db = require('../config/database.js');
const { validateQuery } = require('../utils/queryValidator.js');
const { parseCSV } = require('../utils/csvParser.js');
const { generateCreateTableSQL, generateInsertSQL } = require('../utils/sqlGenerator.js');

const executeQuery = async (req, res) => {
    const { query } = req.body;

    try {
        validateQuery(query);
        const result = await db.query(query);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            error: error.message 
        });
    }
};

const handleCSVUpload = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ 
            success: false, 
            error: 'No file uploaded' 
        });
    }

    try {
        // Parse CSV content from the uploaded file
        const csvContent = req.file.buffer.toString('utf-8');
        const records = parseCSV(csvContent);
        // Generate and execute SQL statements
        const tableName = 'csv_data';
        const createTableSQL = generateCreateTableSQL(tableName, Object.keys(records[0]));
        
        const insertSQL = generateInsertSQL(tableName, records);
        // Drop existing table if it exists
        await db.query(`DROP TABLE IF EXISTS ${tableName}`);
        
        // Create new table and insert data
        await db.query(createTableSQL);
        if (insertSQL) {
            await db.query(insertSQL);
        }
        
        // Return preview of imported data
        const result = await db.query(`SELECT * FROM ${tableName} LIMIT 5`);
        res.json({ 
            success: true, 
            data: result,
            message: `CSV data imported successfully into table '${tableName}'`
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            error: `Failed to process CSV file: ${error.message}` 
        });
    }
};

module.exports = {
    executeQuery,
    handleCSVUpload
};