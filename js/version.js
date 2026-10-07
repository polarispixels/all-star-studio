// App release version (SemVer). Bump with every release; see CHANGELOG.md and CLAUDE.md.
// Separate from data-format versions (schemaVersion, rendererVersion, prototypeVersion).
export const APP_VERSION = '0.9.0';

const stamp = typeof document !== 'undefined' && document.querySelector('[data-app-version]');
if (stamp) stamp.textContent = `v${APP_VERSION}`;
