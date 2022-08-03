<p>
  <a href="https://le-classement.fr/#gh-light-mode-only" target="_blank">
    <img src="./.github/logo-light.svg" alt="Le Classement des Associations" width="350" height="70">
  </a>
  <a href="https://le-classement.fr/#gh-dark-mode-only" target="_blank">
    <img src="./.github/logo-dark.svg" alt="Le Classement des Associations" width="350" height="70">
  </a>
</p>

# votes.le-classement.fr

This project is a voting platform for ["Le Classement des Associations"](https://le-classement.fr).

All the participating associations are present with the different reports they could provide us. Anyone can come and vote with an email address and the two associations with the most votes go directly to the final.

## Tech Stack

**Client:** TailwindCSS, Alpine.js

**Server:** AdonisJS

## Run Locally

Clone the project

```bash
  git clone https://github.com/Barbapapazes/votes.le-classement.fr
```

Go to the project directory

```bash
  cd votes.le-classement.fr
```

Install dependencies

```bash
  npm ci
```

Start the server in development mode

```bash
  npm run dev
```

To be sure everything is working fine, you must also have a running [PostgreSQL](https://www.postgresql.org/) with a database for this project.

### Environment Variables

To run this project, you will need to copy `.env.example` to `.env` and fill every lines.

For the mail service, you can choose a local [MailHog](https://github.com/mailhog/MailHog), any mailing service with SMTP or SES.

The env `ENABLE_VOTE` can be set to `true` or `false` to enable or disable the voting feature, useful to start and stop easily the voting process.

## Deployment

To deploy this project run

```bash
  # Build server
  npm run build

  cd build
  npm ci --production
  # Start server
  node server.js
```

You can learn more about deployment [in documentation](https://docs.adonisjs.com/guides/deployment)!

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Authors

- [@Barbapapzes](https://www.github.com/barbapapazes)
