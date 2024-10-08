﻿# ProConnect

## How To Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Node.js and npm](https://nodejs.org/)

### Backend

1. **Install NestJS CLI** using the following command:

    ```bash
    npm install -g @nestjs/cli
    ```

2. **Run PostgreSQL Docker container** using the following command:

    ```bash
    docker run --name <container_name> -e POSTGRES_USER=<some_username> -e POSTGRES_PASSWORD=<some_password> -e POSTGRES_DB=<some_db_name> -p 5432:5432 -d postgres
    ```

3. In the `api` folder, create a `.env` file with the following structure:

    ```bash
    JWT_SECRET=<some_secret>
    DB_USER=<some_username>
    DB_PASSWORD=<some_password>
    DB_NAME=<some_db_name>
    ```

    `<some_secret>` can be something like `'sduhasnucijaosdoa2nij23'`. Make sure to use the same username, password, and database name in both the Docker command and the `.env` file.

4. In the `api` folder, run `npm install` to install the dependencies.

5. Start the backend with the following command:

    ```bash
    npm run start:dev
    ```

### Frontend

1. **Install Angular CLI** using the following command:

    ```bash
    npm install -g @angular/cli@17
    ```

2. **Add your OpenAI API key**. Create a file `apiKeys.ts` in the `frontend/src/environments` folder and add the following code:

    ```typescript
    export const apiKeys = {
        openai: '<your_openai_api_key>'
    };
    ```

3. In the `frontend` folder, run `npm install` to install the dependencies.

4. Start the frontend application with the following command:

    ```bash
    ng serve -o
    ```

---
