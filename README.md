# URL Shortner

A tiny URL Shortener built using pure Node.js. No frameworks, no fancy libraries
just you, Node.js, and shorter URLs. No need to worry about dependencies, just clone the repository and run the application.

## What is this?

This project is a lightweight URL Shortener implemented with Node.js, using only
native modules. Inspired by the model described in the article URL Shortening System Design,
the application includes efficient short ID generation, fast redirection, and
data persistence with SQLite and Tests.

## How to Run

```bash
# Clone the repository
git clone https://github.com/Andre0n/url-shortner

# Change directory
cd url-shortner

# Start the application
npm start
```

## Running Tests

```bash
# Run the tests
npm test
```

## Architecture and Features

- [x] Short ID Generation
- [x] Efficient Redirection
- [x] Data Persistence
- [ ] User Authentication
- [ ] Basic Analytics
- [ ] Custom Short URLs
- [ ] Expiration Time
- [ ] Rate Limiting

## Technologies Used

- Only Node.js native modules like `node:http`, `node:test`, `node:sqlite` and `node:crypto`.

## License

MIT License
