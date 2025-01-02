const generateCreateTableSQL = (tableName, columns) => {
  const columnsSQL = columns.map(column => `"${column}" VARCHAR`).join(', ');
  console.log(`CREATE TABLE "${tableName}" (${columnsSQL})`);
  return `CREATE TABLE "${tableName}" (${columnsSQL})`;
};

const generateInsertSQL = (tableName, records) => {
  if (records.length === 0) return '';

  const columns = Object.keys(records[0]);
  const values = records.map(record => {
    const valueList = columns.map(column => `'${record[column].replace(/'/g, "''")}'`).join(', ');
    return `(${valueList})`;
  }).join(', ');

  return `INSERT INTO "${tableName}" (${columns.map(column => `"${column}"`).join(', ')}) VALUES ${values}`;
};

module.exports = {
  generateCreateTableSQL,
  generateInsertSQL
};