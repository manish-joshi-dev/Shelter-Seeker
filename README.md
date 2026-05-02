# Shelter Seeker System Architecture

## Overview
This diagram models the full Shelter Seeker application architecture, including both frontend and backend systems, plus the fraud detection microservice.

## Frontend Architecture

```mermaid
flowchart TD
    A["React + Vite Client"]
    B["React Router Pages"]
    C["Firebase Auth / Session"]
    D["Redux Store + Persisted State"]
    E["Socket.IO Client"]
    F["Leaflet / OSM Map Picker"]
    G["Cloudinary Upload Integration"]

    A --> B
    A --> C
    A --> D
    A --> E
    A --> F
    A --> G

    B --> B1["Home / Search / Listing / Profile"]
    B --> B2["MyChats / Admin / Insights"]
```

## Backend Architecture

```mermaid
flowchart TD
    A["Node.js + Express + Socket.IO"]
    B["Auth Routes (/api/auth)"]
    C["User Routes (/api/user)"]
    D["Listing Routes (/api/listing)"]
    E["Chat Routes (/api/chat)"]
    F["Locality Insights (/api/locality-insights)"]
    H["Trust Routes (/api/trust)"]
    I["Upload Routes (/api/upload)"]
    J["Admin Routes (/api/admin)"]
    K["Error Handling / CORS / Cookies"]

    A --> B
    A --> C
    A --> D
    A --> E
    A --> F
    A --> H
    A --> I
    A --> J
    A --> K
```

## Data & Service Integration

```mermaid
flowchart LR
    A["Backend API Server"]
    B["MongoDB / Mongoose"]
    C["Flask Fraud Detection Service"]
    D["Cloudinary"]
    E["OpenStreetMap / Geocoding"]

    A -->|Read / Write| B
    A -->|Call /detect-fraud| C
    A -->|Image upload POST| D
    A -->|Reverse geocode request| E
```

## Architecture Notes

- **Frontend**: built with React and Vite, uses React Router for navigation, Redux for state management, Firebase for authentication, and Socket.IO client for real-time chat.
- **Backend**: Express server exposes REST endpoints, uses Socket.IO for chat events, and connects to MongoDB with Mongoose.
- **Realtime chat**: the backend keeps conversations in MongoDB and broadcasts chat messages and typing indicators using Socket.IO rooms.
- **Fraud detection**: a separate Flask microservice hosts the trained model and exposes `/detect-fraud` for listing validation.
- **Data flow**:
  1. User interacts with the React UI.
  2. Client sends API requests to the Node backend.
  3. Backend processes requests, reads/writes MongoDB, and returns JSON.
  4. Chat messages use websocket events for real-time delivery.
  5. Listing validation can call the Flask fraud service.
  6. Image upload requests are proxied to Cloudinary.

## How to use this model

- Open this file in VS Code and preview the Mermaid diagrams with a Mermaid preview extension.
- Use these smaller diagrams as separate images in your GitHub README.
- To export images, copy each Mermaid block into a Mermaid renderer or use a Mermaid CLI / live editor.
- Expand the model later with deployment details (e.g. Vite dev server, Node.js server, MongoDB Atlas, Flask service container).

## Architecture Notes

- **Frontend**: built with React and Vite, uses React Router for navigation, Redux for state management, Firebase for authentication, and Socket.IO client for real-time chat.
- **Backend**: Express server exposes REST endpoints, uses Socket.IO for chat events, and connects to MongoDB with Mongoose.
- **Realtime chat**: the backend keeps conversations in MongoDB and broadcasts chat messages and typing indicators using Socket.IO rooms.
- **Fraud detection**: a separate Flask microservice hosts the trained model and exposes `/detect-fraud` for listing validation.
- **Data flow**:
  1. User interacts with the React UI.
  2. Client sends API requests to the Node backend.
  3. Backend processes requests, reads/writes MongoDB, and returns JSON.
  4. Chat messages use websocket events for real-time delivery.
  5. Listing validation can call the Flask fraud service.
  6. Image upload requests are proxied to Cloudinary.

## How to use this model

- Open this file in VS Code and preview the Mermaid diagram with a Mermaid preview extension.
- Use the diagram as a blueprint to reproduce the architecture in Figma by creating blocks for each component and arrows for data flow.
- Expand the model later with deployment details (e.g. Vite dev server, Node.js server, MongoDB Atlas, Flask service container).
