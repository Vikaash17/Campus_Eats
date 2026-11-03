// CampusEats Catalogue REST API (CS543 Node & Express practical)
const express = require('express');
const path = require('node:path');

const initialItems = [
  { id: 1, name: 'Veg Thali', price: 90 },
  { id: 2, name: 'Paneer Roll', price: 70 },
];

function createApp() {
  const app = express();
  let items = initialItems.map((item) => ({ ...item }));
  let nextId = 3;

  // Parse JSON bodies sent by POST requests and serve the catalogue page.
  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));

  // GET /items: return the complete menu.
  app.get('/items', (req, res) => {
    res.json(items);
  });

  // GET /items/:id: return one dish, or 404 when it does not exist.
  app.get('/items/:id', (req, res) => {
    const item = items.find((dish) => dish.id === Number(req.params.id));

    if (!item) {
      return res.status(404).json({ error: 'not found' });
    }

    return res.json(item);
  });

  // POST /items: validate the name and add a new dish to the menu.
  app.post('/items', (req, res) => {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';

    if (!name) {
      return res.status(422).json({ error: 'name required' });
    }

    const price = Number(req.body.price) || 0;
    const item = { id: nextId, name, price };
    nextId += 1;
    items.push(item);

    return res.status(201).json(item);
  });

  // Return a JSON error for malformed JSON instead of an HTML error page.
  app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
      return res.status(400).json({ error: 'invalid JSON body' });
    }

    console.error(error);
    return res.status(500).json({ error: 'internal server error' });
  });

  return app;
}

if (require.main === module) {
  const app = createApp();
  const port = Number(process.env.PORT) || 3000;

  app.listen(port, () => {
    console.log(`CampusEats Catalogue is running at http://localhost:${port}`);
  });
}

module.exports = createApp;
