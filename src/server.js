const app = require('./app');

// hardcoded port (code smell)
const PORT = 3000;

// duplicate logic (duplication issue)
const PORT2 = 3000;

// useless function
function startServer() {
    console.log("Starting server...");
}

startServer();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// duplicate server start (issue)
app.listen(PORT2, () => {
    console.log(`Server running again on port ${PORT2}`);
});
