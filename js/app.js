import { fetchUserProfile, fetchUserRepositories, GitHubApiError, GitHubNetworkError } from "./api.js";
import {
  clearValidationMessage,
  renderResults,
  setLoading,
  showInitialState,
  showValidationMessage
} from "./ui.js";

const form = document.querySelector("#search-form");
const usernameInput = document.querySelector("#username-input");

function isValidUsername(username) {
  return /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(username);
}

function getErrorMessage(error) {
  if (error instanceof GitHubApiError && error.status === 404) {
    return "GitHub user not found. Check the username and try again.";
  }

  if (error instanceof GitHubNetworkError) {
    return "Network error. Please check your connection and try again.";
  }

  return "Unable to load GitHub data. Please try again.";
}

async function searchUsername(username, focusResults = true) {
  clearValidationMessage();

  if (!username) {
    showValidationMessage("Please enter a GitHub username.");
    if (focusResults) {
      usernameInput.focus();
    }
    return;
  }

  if (!isValidUsername(username)) {
    showValidationMessage("Enter a valid GitHub username (letters, numbers, and single hyphens).");
    if (focusResults) {
      usernameInput.focus();
    }
    return;
  }

  setLoading(true);

  try {
    const [profile, repositories] = await Promise.all([
      fetchUserProfile(username),
      fetchUserRepositories(username)
    ]);
    renderResults(profile, repositories);
    if (focusResults) {
      document.querySelector("#repositories-title").focus({ preventScroll: true });
      document.querySelector("#results-content").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } catch (error) {
    showInitialState();
    showValidationMessage(getErrorMessage(error));
  } finally {
    setLoading(false);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  searchUsername(usernameInput.value.trim());
});

usernameInput.addEventListener("input", clearValidationMessage);

usernameInput.value = "habtamuararsie";
searchUsername(usernameInput.value, false);
