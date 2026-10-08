const numberFormatter = new Intl.NumberFormat();
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric"
});

const elements = {
  input: document.querySelector("#username-input"),
  button: document.querySelector("#search-button"),
  buttonLabel: document.querySelector(".button-label"),
  message: document.querySelector("#search-message"),
  results: document.querySelector("#results"),
  initialState: document.querySelector("#initial-state"),
  loadingState: document.querySelector("#loading-state"),
  resultsContent: document.querySelector("#results-content"),
  avatar: document.querySelector("#profile-avatar"),
  profileName: document.querySelector("#profile-name"),
  profileUsername: document.querySelector("#profile-username"),
  profileLink: document.querySelector("#profile-link"),
  bio: document.querySelector("#profile-bio"),
  details: document.querySelector("#profile-details"),
  stats: document.querySelector("#profile-stats"),
  repositoryGrid: document.querySelector("#repository-grid"),
  repositoryCount: document.querySelector("#repo-count"),
  emptyRepositories: document.querySelector("#empty-repositories")
};

function appendDetail(container, label, value, href) {
  if (!value) {
    return;
  }

  const detail = href ? document.createElement("a") : document.createElement("span");
  detail.className = "profile-detail";

  if (href) {
    detail.href = href;
    detail.target = "_blank";
    detail.rel = "noopener noreferrer";
  }

  const icon = document.createElement("span");
  icon.className = "detail-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = label === "Website" ? "↗" : label === "Joined" ? "◷" : "•";

  const text = document.createElement("span");
  text.className = "detail-value";
  text.textContent = value;
  detail.append(icon, text);
  container.append(detail);
}

function appendStat(container, value, label) {
  const wrapper = document.createElement("div");
  wrapper.className = "stat";

  const count = document.createElement("dd");
  count.textContent = numberFormatter.format(value);

  const name = document.createElement("dt");
  name.textContent = label;

  wrapper.append(count, name);
  container.append(wrapper);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? "" : dateFormatter.format(date);
}

function createRepositoryCard(repository) {
  const card = document.createElement("article");
  card.className = "repository-card";

  const titleRow = document.createElement("div");
  titleRow.className = "repository-title-row";

  const title = document.createElement("h3");
  title.className = "repository-name";
  const link = document.createElement("a");
  link.href = repository.html_url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = repository.name;
  title.append(link);

  const external = document.createElement("span");
  external.className = "repo-external";
  external.setAttribute("aria-hidden", "true");
  external.textContent = "↗";
  titleRow.append(title, external);

  const description = document.createElement("p");
  description.className = "repository-description";
  if (repository.description) {
    description.textContent = repository.description;
  } else {
    description.textContent = "No description provided.";
    description.classList.add("is-empty");
  }

  const metadata = document.createElement("div");
  metadata.className = "repository-meta";

  if (repository.language) {
    const language = document.createElement("span");
    language.className = "repo-language";
    const dot = document.createElement("span");
    dot.className = "language-dot";
    dot.setAttribute("aria-hidden", "true");
    const languageName = document.createElement("span");
    languageName.textContent = repository.language;
    language.append(dot, languageName);
    metadata.append(language);
  }

  const stars = document.createElement("span");
  stars.className = "repo-meta-item";
  const starSymbol = document.createElement("span");
  starSymbol.className = "repo-meta-symbol";
  starSymbol.setAttribute("aria-hidden", "true");
  starSymbol.textContent = "★";
  stars.append(starSymbol);
  stars.append(document.createTextNode(numberFormatter.format(repository.stargazers_count)));

  const forks = document.createElement("span");
  forks.className = "repo-meta-item";
  const forkSymbol = document.createElement("span");
  forkSymbol.className = "repo-meta-symbol";
  forkSymbol.setAttribute("aria-hidden", "true");
  forkSymbol.textContent = "⑂";
  forks.append(forkSymbol);
  forks.append(document.createTextNode(numberFormatter.format(repository.forks_count)));
  metadata.append(stars, forks);

  const updated = formatDate(repository.updated_at);
  if (updated) {
    const updatedLabel = document.createElement("span");
    updatedLabel.className = "repository-updated";
    updatedLabel.textContent = `Updated ${updated}`;
    metadata.append(updatedLabel);
  }

  card.append(titleRow, description, metadata);
  return card;
}

export function showValidationMessage(message) {
  elements.message.textContent = message;
  elements.input.setAttribute("aria-invalid", "true");
}

export function clearValidationMessage() {
  elements.message.textContent = "";
  elements.input.setAttribute("aria-invalid", "false");
}

export function setLoading(isLoading) {
  elements.button.disabled = isLoading;
  elements.buttonLabel.textContent = isLoading ? "Searching..." : "Explore";
  elements.results.setAttribute("aria-busy", String(isLoading));

  if (isLoading) {
    elements.initialState.hidden = true;
    elements.resultsContent.hidden = true;
  }

  elements.loadingState.hidden = !isLoading;
}

export function showInitialState() {
  elements.loadingState.hidden = true;
  elements.resultsContent.hidden = true;
  elements.initialState.hidden = false;
  elements.results.setAttribute("aria-busy", "false");
}

export function renderResults(profile, repositories) {
  elements.avatar.src = profile.avatar_url;
  elements.avatar.alt = `${profile.login}'s GitHub avatar`;
  elements.profileName.textContent = profile.name || profile.login;
  elements.profileUsername.textContent = `@${profile.login}`;
  elements.profileUsername.href = profile.html_url;
  elements.profileLink.href = profile.html_url;

  elements.bio.textContent = profile.bio || "";
  elements.bio.hidden = !profile.bio;

  elements.details.replaceChildren();
  appendDetail(elements.details, "Location", profile.location);
  appendDetail(elements.details, "Company", profile.company);

  if (profile.blog) {
    const website = profile.blog.match(/^https?:\/\//i) ? profile.blog : `https://${profile.blog}`;
    appendDetail(elements.details, "Website", profile.blog, website);
  }

  const joined = formatDate(profile.created_at);
  appendDetail(elements.details, "Joined", joined ? `Joined ${joined}` : "");

  elements.stats.replaceChildren();
  appendStat(elements.stats, profile.followers, "followers");
  appendStat(elements.stats, profile.following, "following");
  appendStat(elements.stats, profile.public_repos, "repositories");

  elements.repositoryGrid.replaceChildren();
  elements.repositoryCount.textContent = `· ${repositories.length}`;
  elements.repositoryCount.setAttribute("aria-label", `${repositories.length} public repositories`);
  elements.emptyRepositories.hidden = repositories.length > 0;
  elements.repositoryGrid.hidden = repositories.length === 0;

  for (const repository of repositories) {
    elements.repositoryGrid.append(createRepositoryCard(repository));
  }

  elements.loadingState.hidden = true;
  elements.initialState.hidden = true;
  elements.resultsContent.hidden = false;
  elements.results.setAttribute("aria-busy", "false");
}
