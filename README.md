# starworks_test
---
#### How to start the server:
1. copy/rename .env.example to .env
2. change env variables
3. run `npm install` or `docker build . -t rey/starworks:latest` for docker use
4. run the migration `npm run migrate:up` or `docker compose run --rm migrator`
5. start the server `npm run dev` or `docker compose up -d`

#### For postman use
- Import collection and environment from `misc`
- Explore the endpoints

### Auth Flowchart
![Auth Flowchart](./misc/flowchart_auth.jpg)

### Wallet Flowchart
![Wallet Flowchart](./misc/flowchart_wallet.jpg)

### Database
![Database Diagram](./misc/database.png)
