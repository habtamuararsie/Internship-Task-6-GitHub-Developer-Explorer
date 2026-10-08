# GitHub Developer Explorer

A responsive, accessible frontend for exploring public GitHub profiles and their recently updated repositories. The app loads the live `habtamuararsie` profile on startup, and lets you search for another GitHub username to view profile details, public activity metrics, and up to 12 repositories—without signing in.

## Synent Technologies Internship — Task 6

This project was created for the Web Development Internship API Integration Project. It demonstrates a complete client-side integration with the GitHub REST API using semantic HTML, modern CSS, and vanilla JavaScript.

## Features

- Search public GitHub profiles by username.
- Automatically load the configured `habtamuararsie` profile when the app opens.
- View profile bio, avatar, location, company, website, account creation date, and public statistics when available.
- Browse up to 12 repositories, sorted by most recently updated.
- See each repository's language, stars, forks, description, and last update date.
- Get input validation and distinct not-found, network, and API error messages.
- Use the interface with keyboard navigation and assistive technology.
- Open GitHub profile, repository, and website links in a new tab.

## Technologies

- HTML5
- CSS3 (custom properties, Grid, Flexbox, and responsive media queries)
- Vanilla JavaScript ES modules and async/await
- Fetch API
- GitHub REST API

No frontend framework, backend, database, authentication, or personal access token is used.

## GitHub API endpoints

- `GET https://api.github.com/users/{username}` — public profile
- `GET https://api.github.com/users/{username}/repos?sort=updated&direction=desc&per_page=12` — public repositories

Unauthenticated GitHub API rate limits apply.

## Project structure

```text
.
├── index.html
├── README.md
├── ARCHITECTURE.md
├── .gitignore
├── LICENSE
├── css/
│   ├── variables.css
│   ├── style.css
│   └── responsive.css
└── js/
    ├── api.js
    ├── app.js
    └── ui.js
```

## How it works

1. The app loads the configured `habtamuararsie` profile on startup. The search form validates that a username is present and follows GitHub's username format.
2. The application displays a loading state and requests the profile and repositories in parallel.
3. `api.js` handles API requests and HTTP status errors; `app.js` coordinates validation and the search flow.
4. `ui.js` renders returned data with DOM methods and `textContent`, without inserting untrusted API values as HTML.
5. The results show available profile information and the repositories returned by GitHub, or a clear error/empty state.

For a detailed, file-by-file walkthrough of the architecture and request flow, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Run locally

Because the JavaScript uses ES modules, serve the project from a local web server rather than opening `index.html` directly. From the project directory, run one of:

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000). The app requires an internet connection to contact the GitHub API.

## Testing

There is no test framework or build step in this dependency-free project. Verify the main flows manually in a browser:

1. Submit an empty search and confirm the required-field message appears.
2. Search for a valid public username (for example, `octocat`) and inspect the profile and repository cards.
3. Search for a nonexistent username and confirm the not-found message.
4. Try malformed usernames and confirm validation prevents the request.
5. Disconnect the network or simulate a failed API request to inspect the network/API error state.
6. Check a user with no public repositories, responsive layouts, and keyboard-only operation.

## Responsive design and accessibility

The repository layout adapts from three columns on desktop, to two on tablet, and one on mobile. Semantic landmarks, a skip link, a labeled form input, visible focus indicators, loading announcements, meaningful link names, and reduced-motion support are included. Profile and repository links use `noopener noreferrer`.

## Future enhancements

- Add repository filters and language-based grouping.
- Support pagination or a user-selected result count.
- Add automated tests for validation, API errors, and rendering.
- Offer an optional theme switch.

## Author

**Habtamu Ararsie**

## GitHub repository

[habtamuararsie/Internship-Task-6-GitHub-Developer-Explorer](https://github.com/habtamuararsie/Internship-Task-6-GitHub-Developer-Explorer)
