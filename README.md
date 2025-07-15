# SDG-Docs

This is a local-first, real-time collaborative document editor built to enterprise standards.

## How to Run

1.  **Install Dependencies:**
    ```bash
    # using pnpm (recommended)
    pnpm install:all
    ```

2.  **Run the application (Server + Client):**
    ```bash
    pnpm run dev:concurrently
    ```

This will start the WebSocket server and the React client application. Open multiple browser tabs to `http://localhost:5173` to simulate multi-user collaboration.
