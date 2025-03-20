const path = require('node:path');
const fs = require('node:fs');
const express = require('express');
const cors = require('cors');

const PORT = 8000; // Fixed port number

const app = express();

// Custom middleware function to log requests and response status
const logRequests = (req, res, next) => {
    const startTime = new Date();

    // Capture the end function to get the response status
    const end = res.end;
    res.end = function (chunk, encoding) {
        res.end = end;
        const endTime = new Date();
        const duration = endTime - startTime;

        console.log(
            `[${endTime.toISOString()}] ${req.method} ${req.url} - ${res.statusCode
            } - ${duration}ms`
        );

        // Call the original end function to complete the response
        res.end(chunk, encoding);
    };

    next();
};

// Use the middleware for all routes
app.use(logRequests);
app.use(cors());
app.use(express.json());

const loadData = (key) => {
    try {
        const dbPath = path.resolve(__dirname, 'db.json');
        const dataBuffer = fs.readFileSync(dbPath);
        const dataJSON = dataBuffer.toString();
        const data = JSON.parse(dataJSON);
        return key ? data[key] : data;
    } catch (e) {
        console.error('Error loading data:', e);
        return key === 'doors' ? [] : {};
    }
};

const saveData = (key, data) => {
    try {
        const dbPath = path.resolve(__dirname, 'db.json');
        const existingData = loadData();
        const newData = { ...existingData, [key]: data };
        const dataJSON = JSON.stringify(newData, null, 2);
        fs.writeFileSync(dbPath, dataJSON);
        return data;
    } catch (e) {
        console.error('Error saving data:', e);
        return key === 'doors' ? [] : {};
    }
};

app.get('/doors', (_, res) => {
    const doorsData = loadData('doors');
    res.json(doorsData);
});

app.get('/doors/:id', (req, res) => {
    const doorsData = loadData('doors');
    const door = doorsData.find((door) => door.id === req.params.id.toString());
    if (door) {
        return res.json(door);
    }

    res.status(404).json({ message: 'Door not found' });
});

app.post('/doors', (req, res) => {
    const doorsData = loadData('doors');
    const newDoor = { 
        id: (doorsData.length + 1).toString(), 
        ...req.body,
        status: req.body.status || 'closed' // Default status
    };
    doorsData.push(newDoor);
    saveData('doors', doorsData);
    res.status(201).json(newDoor);
});

app.put('/doors/:id', (req, res) => {
    const doorsData = loadData('doors');
    const doorIndex = doorsData.findIndex((door) => door.id === req.params.id.toString());

    // dont allow to update 'id' field
    delete req.body.id;

    if (doorIndex !== -1) {
        doorsData[doorIndex] = { ...doorsData[doorIndex], ...req.body };
        saveData('doors', doorsData);
        return res.status(200).json(doorsData[doorIndex]);
    }

    res.status(404).json({ message: 'Door not found' });
});

app.delete('/doors/:id', (req, res) => {
    const doorsData = loadData('doors');
    const doorIndex = doorsData.findIndex((door) => door.id === req.params.id.toString());
    if (doorIndex !== -1) {
        const deletedDoor = doorsData[doorIndex];
        doorsData.splice(doorIndex, 1);
        saveData('doors', doorsData);
        return res.status(200).json(deletedDoor);
    }

    res.status(404).json({ message: 'Door not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
