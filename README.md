## Prepare the database

You should already have a MySQL database set up with a `DATABASE_URL` environment variable pointing to the connection string.

###

`.env`

```sh
DATABASE_URL="mysql://{user}:{password}@{server}:3306/{database}"
```

## Run the API

```sh
npm run dev
```

or

```sh
yarn dev
```
