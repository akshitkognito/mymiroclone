**Live Link**: http://139.59.77.53

**Backend Base URL**: http://139.59.77.53/api/v1/shapes

## How to run

**Frontend**

```json
cd client
pnpm install
pnpm run dev
```

**Backend**

```json
cd server
npm install
npm run start
```

## Endpoints

#### 1. GET / – Get all shapes

Returns a list of all saved shapes.

**Example response:**

```json
[
  {
    "id": "6738e8c",
    "type": "rectangle",
    "x": 120,
    "y": 80,
    "width": 100,
    "height": 60,
    "fillColor": { "r": 255, "g": 0, "b": 0 },
    "strokeColor": { "r": 0, "g": 0, "b": 0 }
  }
]
```

#### 2. GET /:id – Get shape by ID

Fetches a single shape using its ID.

**Example**

GET /api/v1/shapes/6738e8c

**Example response:**

```json
{
  "id": "6738e8c",
  "type": "circle",
  "x": 200,
  "y": 150,
  "radius": 50,
  "fillColor": { "r": 34, "g": 197, "b": 94 }
}
```

#### 3. POST / – Create a new shape

Create a new shape.

**Example response:**

```json
{
  "type": "line",
  "x": 50,
  "y": 100,
  "x2": 150,
  "y2": 200,
  "strokeColor": { "r": 0, "g": 0, "b": 0 },
  "fillColor": { "r": 255, "g": 255, "b": 255 }
}
```

#### 4. PUT /:id – Update shape by ID

Updates the properties of an existing shape.

**Example request body:**

```json
{
  "x": 120,
  "y": 200,
  "fillColor": { "r": 249, "g": 115, "b": 22 }
}
```

**Example response:**

```json
{
  "message": "Shape updated successfully",
  "updatedShape": {
    "id": "6738f002",
    "x": 120,
    "y": 200
  }
}
```

#### 5. DELETE / – Delete all shapes

Deletes all the shapes from the database.

**Example response:**

```json
{ "message": "All shapes deleted successfully" }
```

#### 6. DELETE /:id – Delete shape by ID

Deletes a single shape by its ID.

**Example response:**

```json
{ "message": "Shape deleted successfully" }
```
