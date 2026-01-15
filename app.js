const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// UI routes
const route = require('./routes/route');

// API routes
const documentsRoutes = require('./server/routes/documents.routes');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const upload = require('express-fileupload');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(upload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'nodedemo',
  resave: false,
  saveUninitialized: true
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// UI ROUTES
app.use('/', route);

// 🔥 API ROUTES (THIS WAS MISSING)
app.use('/api', documentsRoutes);
app.use('/api', require('./server/routes/indexes.routes'));
app.use('/api', require('./server/routes/signatories.routes'));
app.use('/api', require('./server/routes/oath.routes'));
app.use('/api', require('./server/routes/oath.routes'));


// new code according to task 
const documentRoutes = require("./server/routes/documents.routes");
app.use("/documents", documentRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

