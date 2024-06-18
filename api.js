const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

const sampleData = [
    { id: 1, name: 'Alice', score: 100 },
    { id: 2, name: 'Bob', score: 200 },
    { id: 3, name: 'Charlie', score: 150 }
];

app.get('/data', (req, res) => {
    const { name } = req.query;
    if (name) {
        const user = sampleData.find(user => user.name.toLowerCase() === name.toLowerCase());
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } else {
        res.json(sampleData);
    }
});

app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});
