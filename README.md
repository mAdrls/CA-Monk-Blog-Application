# CA Monk Blog Application

This project is built with React (frontend) and Node.js/Express (backend).

## Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (installed and running)

## Setup Instructions

1. **Extract the ZIP**
   Extract the downloaded files into a folder.

2. **Install Dependencies**
   Open your terminal in the project folder and run:
   ```bash
   npm install
   ```

3. **Database Configuration**
   - Create a new PostgreSQL database.
   - Set up an environment variable named `DATABASE_URL` with your connection string.
   - Example: `DATABASE_URL=postgres://username:password@localhost:5432/database_name`

4. **Prepare the Database**
   Run the following command to sync the schema to your local database:
   ```bash
   npm run db:push
   ```

5. **Start the Application**
   Run the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5000`.

```
