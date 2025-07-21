# Swiftie Song Analysis App

This app allows users to rank Taylor Swift songs from each of her albums to discover their favorite era!

## Development Plan (with help from Gemini)

Here is a high-level plan breaking down the development process into logical steps:

### **Phase 1: Backend Foundation (Rails API)**

1.  **Project Setup:**
    *   Initialize a new Rails 7 application in API-only mode.
    *   Configure `CORS` (Cross-Origin Resource Sharing) to allow your React frontend to communicate with the API.

2.  **Database Modeling:**
    *   Create the necessary models and database migrations:
        *   `User`: To manage user accounts (using a gem like Devise for authentication).
        *   `Album`: To store album information (title, release year).
        *   `Song`: To store song details (title, album_id, spotify_track_id).
        *   `Ranking`: To store a user's ranking for a specific song (user_id, song_id, tier).

3.  **Seeding Initial Data:**
    *   Create a seed file (`seeds.rb`) to populate the database with the 11 Taylor Swift albums and the full tracklist for each, starting with her debut album.

4.  **API Endpoints (Controllers):**
    *   Implement controllers to expose the data:
        *   `GET /api/v1/albums`: To list all albums.
        *   `GET /api/v1/albums/:id/songs`: To get all songs for a specific album.
        *   `POST /api/v1/rankings`: To create or update a user's song rankings.
        *   Endpoints for user registration and login.

### **Phase 2: Frontend Development (React)**

5.  **Project Setup:**
    *   Use `Create React App` to bootstrap a new React application.
    *   Install necessary libraries like `axios` for API calls and `react-router-dom` for navigation.

6.  **Component Scaffolding:**
    *   Create basic components for the UI:
        *   `AlbumView`: Fetches and displays the list of songs for a given album.
        *   `Tier`: Represents a single ranking category (e.g., "S Tier", "A Tier").
        *   `SongCard`: A draggable card representing a single song.

7.  **Drag-and-Drop Functionality:**
    *   Integrate a library like `react-beautiful-dnd` to enable dragging songs from a list and dropping them into the different tier components.
    *   When a user drops a song, update the component's state and send the new ranking to the Rails API.

### **Phase 3: Integrating Core Features**

8.  **User Authentication:**
    *   **Backend:** Implement token-based authentication using `has_secure_password` for password management and the `jwt` gem for token generation and validation.
    *   **Frontend:** Create Login and Signup pages. When a user logs in, store the received JWT (JSON Web Token) and include it in the header of all subsequent API requests.

9.  **Spotify Integration:**
    *   **Backend:** Add the `rspotify` gem to handle OAuth authentication with Spotify. Create endpoints for your frontend to initiate the Spotify login flow.
    *   **Frontend:** Add a "Connect to Spotify" button. Once authorized, use the Spotify Web Playback SDK to allow playback of 30-second song previews directly in the app. This will require storing the Spotify Track ID for each song in your database.

### **Phase 4: Finalizing and Polishing**

10. **Album Scoring and Navigation:**
    *   Implement the logic to calculate an album's score based on the tiers of its songs (e.g., S=4pts, A=3pts, etc.).
    *   Create a dashboard or results page where users can see their calculated scores for each album.
    *   Build the navigation to allow users to move between ranking different albums.

## Technical Decisions

### Authentication Strategy

For user authentication, we opted for a token-based approach using Rails' built-in `has_secure_password` for password management and the `jwt` gem for JSON Web Token (JWT) generation and validation. This decision was made for the following reasons:

*   **Lightweight and API-Centric:** Unlike full-fledged authentication frameworks (e.g., Devise), this combination is more lightweight and better suited for API-only applications. It avoids the overhead of session management, which is not necessary for a stateless API.
*   **Clear Separation of Concerns:** It promotes a clean separation between the backend (handling authentication logic and token issuance) and the frontend (responsible for storing and sending the JWT).
*   **Scalability:** By being stateless, the API can scale more easily as it doesn't need to maintain session information across multiple servers.
*   **Flexibility:** This approach provides greater control over the authentication flow, allowing for custom implementations tailored to the application's specific needs.
*   **Modern Web Practices:** Token-based authentication is a standard and secure practice for modern single-page applications and mobile clients.