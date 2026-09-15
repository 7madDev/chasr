# Contributing to Chasr

First off, thank you for considering contributing to Chasr! It's people like you that make Chasr a great tool for the community.

## 🚀 How to Contribute

We welcome all kinds of contributions: bug reports, feature requests, documentation improvements, and code contributions.

### 1. Find an Issue
Before you start coding, please check the [Issues](https://github.com/yourusername/chasr/issues) tab to see if someone is already working on what you want to do. 
- If the issue exists, leave a comment saying you'd like to work on it.
- If it doesn't exist, please open a new issue to discuss your proposed changes before writing any code.

### 2. Fork the Repository
Click the "Fork" button in the top right corner of the GitHub repository to create your own copy of the project.

### 3. Clone and Setup
Clone your fork to your local machine:
```bash
git clone https://github.com/YOUR_USERNAME/chasr.git
cd chasr
```
Install the dependencies:
```bash
npm install
```
Copy the `.env` template and set up your environment variables (you will need a local or Supabase PostgreSQL database):
```bash
cp .env.example .env
```
Push the database schema:
```bash
npx prisma db push
```

### 4. Create a Branch
Always create a new branch for your work. Use a descriptive name:
```bash
git checkout -b feature/add-dark-mode
# or
git checkout -b fix/header-alignment
```

### 5. Make Your Changes
Write your code! We use Next.js (App Router), Tailwind CSS, and Prisma.
- Please follow the existing code style.
- Make sure your changes are responsive and look good on mobile.

### 6. Test and Lint
Before committing, ensure your code passes our linting rules. The project is currently configured to have **0 warnings and 0 errors**.
```bash
npm run lint
```
If you encounter any errors, please fix them before submitting your PR.

### 7. Commit and Push
Commit your changes with a clear, descriptive commit message:
```bash
git add .
git commit -m "Add dark mode toggle to the dashboard"
git push origin feature/add-dark-mode
```

### 8. Open a Pull Request (PR)
Go back to the original Chasr repository on GitHub. You should see a prompt to "Compare & pull request" for your new branch.
- Fill out the PR template describing what you changed.
- Link the issue your PR resolves (e.g., "Fixes #12").
- Wait for a maintainer to review your code!

## 💡 Code of Conduct
By participating in this project, you agree to abide by common open-source standards of respect and collaboration. Be kind to others!
