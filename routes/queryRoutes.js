const { executeQuery, handleCSVUpload } = require('../controllers/queryControllers');

const express = require('express');
const multer = require('multer');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', (req, res) => {
    res.send('Hello, this is the query route!');
});

router.post('/execute', executeQuery);
router.post('/upload-csv', upload.single('file'), handleCSVUpload);

module.exports = router;