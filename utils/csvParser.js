const parseCSV = (content) => {
  const rows = content.split('\n').filter(row => row.trim() !== ''); // Filter out empty rows
  const headers = rows[0].split(',').map(header => header.trim()); // Trim headers

  const records = rows.slice(1).map(row => {
    const values = row.split(',').map(value => value.trim()); // Trim values
    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index] !== undefined ? values[index] : null; // Handle missing values
    });
    return record;
  });

  return records;
};

module.exports = {
  parseCSV
};