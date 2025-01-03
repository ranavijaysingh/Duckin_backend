const db = require('../config/database.js');
const { validateQuery } = require('../utils/queryValidator.js');
const { parseCSV } = require('../utils/csvParser.js');
const { generateCreateTableSQL, generateInsertSQL } = require('../utils/sqlGenerator.js');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

const executeQuery = async (req, res) => {
    const { query } = req.body;
    const csvStructure= '("Index" VARCHAR, "Customer Id" VARCHAR, "First Name" VARCHAR, "Last Name" VARCHAR, "Company" VARCHAR, "City" VARCHAR, "Country" VARCHAR, "Phone 1" VARCHAR, "Phone 2" VARCHAR, "Email" VARCHAR, "Subscription Date" VARCHAR, "Website" VARCHAR)'
    const sqlQuery = await generateSQLQuery(query, csvStructure)
    console.log('sqlQuery', sqlQuery)
    try {
        validateQuery(sqlQuery);
        const result = await db.query(sqlQuery);
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
        const csvContent = req.file.buffer.toString('utf-8');
        const records = parseCSV(csvContent);
        const tableName = 'uploaded_csv';
        const createTableSQL = generateCreateTableSQL(tableName, Object.keys(records[0]));
        
        const insertSQL = generateInsertSQL(tableName, records);
        await db.query(`DROP TABLE IF EXISTS ${tableName}`);
        
        await db.query(createTableSQL);
        if (insertSQL) {
            await db.query(insertSQL);
        }
        
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

const generateSQLQuery = async (naturalLanguage, csvStructure) => { 
    try {
        const response = await openai.createChatCompletion({         
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are an expert SQL generator that converts natural language to SQL queries.",
            },
            {
              role: "user",
              content: `Convert this request into a SQL query: "${naturalLanguage}. The structure of this CSV file: ${csvStructure}. give answer in SQL query only and use table name as uploaded_csv and use proper alias where needed. take column headings as they are without adding any character to it or deleting white spaces and It should contain only SQL nothing else."`,
            },
          ],
        });
        const sqlQuery = response.data.choices[0].message.content.trim();
        return sqlQuery;
      } catch (error) {
        console.error("Error generating SQL query:", error);
        throw error;
      }
}
module.exports = {
    executeQuery,
    handleCSVUpload,
    generateSQLQuery
};