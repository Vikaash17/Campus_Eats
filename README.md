# CampusEats Catalogue — CS543 Node & Express Practical

This project implements the catalogue exercise from the CS543 Node & Express tutorial. The browser loads the dishes from an Express REST API and uses a form to add a new dish.

## Requirements

- Node.js 18 or newer
- npm (installed with Node.js)

## Run the project

Open a terminal in this `catalogue` folder and run:

```bash
npm install
npm start
```

Then open <http://localhost:3000> in your browser. The initial menu contains Veg Thali and Paneer Roll. Use the form to add another dish.

To stop the server, press `Ctrl + C` in the terminal.

## Run the checks

```bash
npm test
```

The tests cover the catalogue page, stylesheet, menu routes, missing-item response, request validation, malformed JSON, and adding a dish.

## REST API

| Method | Endpoint | Description | Response |
| --- | --- | --- | --- |
| GET | `/items` | List all dishes | `200 OK` |
| GET | `/items/:id` | Get one dish | `200 OK` or `404 Not Found` |
| POST | `/items` | Add a dish using JSON | `201 Created` or `422 Unprocessable Entity` |

Example request:

```bash
curl -i -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Masala Dosa","price":60}'
```

Example missing-item request:

```bash
curl -i http://localhost:3000/items/99
```

## Project structure

```text
catalogue/
├── server.js
├── package.json
├── README.md
├── .gitignore
├── public/
│   ├── index.html
│   └── style.css
└── test/
    └── server.test.js
```

## Storage

The menu is stored in an in-memory array, as required by the tutorial. A dish added through the form remains available while the server is running. Restarting the server resets the menu to the two initial dishes.

## CampusEats project reference

The broader CampusEats group project is available at <https://github.com/devdave17/campuseats>. This folder is the separate Node & Express catalogue practical and does not replace or include the repository's other assignment files.
