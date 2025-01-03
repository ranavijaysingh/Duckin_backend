const parseCSV = (content) => {
  const rows = content.split('\n').filter(row => row.trim() !== ''); 
  const headers = rows[0].split(',').map(header => header.trim());

  const records = rows.slice(1).map(row => {
    const values = row.split(',').map(value => value.trim());
    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index] !== undefined ? values[index] : null;
    });
    return record;
  });

  return records;
};

module.exports = {
  parseCSV
};