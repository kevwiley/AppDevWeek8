const express = require('express');
const { db, Track } = require('./database/setup');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

async function testConnection () { //function tests that the app connects to the database
    try {
        await db.authenticate();
        console.log("Successfully connected to Database.");
        } catch (error) { //error if can't connect
            console.error('Error Connecting to Database:', error);
        }
}

testConnection();

app.listen(PORT, () => { //starts server and listens for requests
    console.log(`Server running on port http://localhost:${PORT}`);
});

app.get('/api/tracks', async (req, res) => {
    try {
        //returns all tracks, returns error if issue
        const tracks = await Track.findAll();
        res.status(200).json(tracks);
    } catch (error) {
        console.error('Error Fetching Tracks:', error);
        res.status(500).json({ error: 'Failed to Fetch Tracks' });
    }
});

app.get('/api/tracks/:id', async (req, res) => {
    try {
        //gets a track by id
        const track = await Track.findByPk(req.params.id);

        //errors if track does not exits
        if (!track) {
            return res.status(404).json({ error: "Track Not Found"});
        }

        res.status(200).json(track);
    } catch (error) {
        console.error('Error Fetching Track: ', error)
        res.status(500).json({ error: "Error Fetching Track"});
    }
});

app.post('/api/tracks', async (req, res) => {
    //takes data from request body
    const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;

    //checks all fields are filled, errors if not
    if (!songTitle || !artistName || !albumName || !genre || !duration || !releaseYear) {
        return res.status(400).json({ error: "All track fields are required"});
    }

    try {
        //creates new track record
        const newTrack = await Track.create({
            songTitle,
            artistName,
            albumName,
            genre,
            duration,
            releaseYear
        });

        res.status(201).json(newTrack);
    } catch (error) {
        res.status(500).json({ error: "Error Creating Track"});
    }
});

app.put('/api/tracks/:id', async (req, res) => {
    try {
        //takes updated data from request body
        const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;

        //updates corresponding id
        const [updatedRowsCount] = await Track.update(
            { songTitle, artistName, albumName, genre, duration, releaseYear },
            { where: { trackId: req.params.id } }
        );

        //errors if cant find any rows for entered track
        if (updatedRowsCount === 0) {
            return res.status(404).json({ error: 'Track Not Found' });
        }

        //returns updated track
        const updatedTrack = await Track.findByPk(req.params.id);
        res.status(200).json(updatedTrack);

    } catch (error) {
        console.error('Error Updating Track: ', error);
        res.status(500).json({ error: 'Failed to Update Track'});
    }
});

app.delete('/api/tracks/:id', async (req, res) => {
    try {
        //tries to deletes row with specific id
        const deletedRowsCount = await Track.destroy({
            where: { trackId: req.params.id}
        });

        //errors if no rows were deleted
        if (deletedRowsCount === 0) {
            return res.status(404).json({ error: 'Track Not Found'});
        }

        //returns success or error if one is encountered.
        res.status(200).json({ message: 'Track Successfully Deleted' });
    } catch (error) {
        console.error('Track Deletion Error: ', error);
        res.status(500).json({ error: `Failed to Delete Track` });
    }
});

