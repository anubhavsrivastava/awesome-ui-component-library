---
name: generate_star_badge
description: Generates a GitHub star badge markdown snippet for a given GitHub repository URL.
---

# Generate GitHub Star Badge

When the user asks you to create, generate, or add a star badge for a GitHub repository, you should use the provided local script to generate the correct markdown snippet.

## Instructions
1. Run the local script located at `_tools/starBadge/index.js` using Node.js, passing the target GitHub repository URL as an argument.
   Example command:
   ```bash
   node _tools/starBadge/index.js https://github.com/username/repository
   ```
2. The script will output a string containing the markdown snippet, which looks similar to:
   `Badge Url:  [![Repo Star](https://img.shields.io/github/stars/username/repository.svg?label=&style=social)](https://github.com/username/repository)`
3. Extract the markdown snippet from the output.
4. Provide this snippet to the user, or directly insert it into the `README.md` or other specified markdown files if the user requested you to add it to a file.
