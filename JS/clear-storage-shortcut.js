document.addEventListener('keydown', function (event) {
  if (!event.ctrlKey || !event.altKey || event.key.toLowerCase() !== 's') {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  try {
    localStorage.clear();
  } catch (error) {
    // Continue with session cleanup and reload if storage is unavailable.
  }

  try {
    sessionStorage.clear();
  } catch (error) {
    // Reload even if session storage is unavailable.
  }

  location.reload();
}, true);