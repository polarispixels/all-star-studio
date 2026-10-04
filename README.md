# All-Star Studio

Turn an idea into a star. A browser-based tool for designing five-point stars whose colors and patterns represent ideas, teams, causes, or values.

- App: https://polarispixels.github.io/all-star-studio/
- Docs: https://polarispixels.github.io/all-star-studio/docs/

Currently a coming-soon page. Releases follow [Semantic Versioning](https://semver.org/); see [CHANGELOG.md](CHANGELOG.md). See [docs/project-spec.md](docs/project-spec.md) for the full plan.

## Local development

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/. Run the tests with `node --test 'tests/*.test.mjs'`. Deployment is GitHub Pages from the `main` branch root; pushing to `main` publishes.
