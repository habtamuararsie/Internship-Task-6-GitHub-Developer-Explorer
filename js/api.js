const API_BASE_URL = "https://api.github.com";

export class GitHubApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "GitHubApiError";
    this.status = status;
  }
}

export class GitHubNetworkError extends Error {
  constructor() {
    super("Unable to connect to GitHub.");
    this.name = "GitHubNetworkError";
  }
}

async function request(endpoint) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });
  } catch {
    throw new GitHubNetworkError();
  }

  if (!response.ok) {
    throw new GitHubApiError("GitHub API request failed.", response.status);
  }

  return response.json();
}

export async function fetchUserProfile(username) {
  return request(`/users/${encodeURIComponent(username)}`);
}

export async function fetchUserRepositories(username) {
  const query = new URLSearchParams({
    sort: "updated",
    direction: "desc",
    per_page: "12"
  });

  return request(`/users/${encodeURIComponent(username)}/repos?${query}`);
}
