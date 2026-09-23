# Contributing to FieldPulse

Thank you for your interest in contributing to **FieldPulse**! FieldPulse is an intelligent SLA-aware field service dispatch & operations platform built to provide production-grade field service management.

---

## 1. Code of Conduct

We expect all contributors to maintain a welcoming, respectful, and collaborative environment. Be thoughtful, constructive, and open to feedback.

---

## 2. Git Workflow & Branching Strategy

We follow a structured branch naming convention based on GitFlow:

- `main`: Production-ready releases.
- `develop` (or feature branches off `main` during initial build): Active development branch.
- Feature branches: `feat/<feature-name>` (e.g., `feat/sla-engine`, `feat/dispatch-board`)
- Bug fix branches: `fix/<bug-name>` (e.g., `fix/inventory-concurrency`)
- Documentation: `docs/<topic>` (e.g., `docs/api-specs`)
- Chore / Refactor: `chore/<description>` or `refactor/<description>`

---

## 3. Commit Message Conventions

FieldPulse adheres strictly to the [Conventional Commits specification](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

### Allowed Types:
- `feat`: A new feature or capability.
- `fix`: A bug fix.
- `docs`: Documentation-only changes.
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc.).
- `refactor`: A code change that neither fixes a bug nor adds a feature.
- `perf`: A code change that improves performance.
- `test`: Adding missing tests or correcting existing tests.
- `build`: Changes that affect the build system or external dependencies.
- `ci`: Changes to CI configuration files and scripts.
- `chore`: Miscellaneous housekeeping tasks.

**Example:**
```bash
feat(dispatch): add scoring formula weighting skill match and travel distance
fix(inventory): resolve race condition in concurrent part reservation
docs(architecture): add sequence diagram for SLA breach escalation
```

---

## 4. Local Development Guidelines

### Prerequisites
- **Java 21** (Temurin or OpenJDK recommended)
- **Node.js 20+** and **npm 10+**
- **Docker** & **Docker Compose**
- **Maven 3.9+** (or Maven wrapper)

### Coding Standards
- **Backend (Spring Boot)**:
  - Follow layered architecture: `controller` -> `service` -> `repository` -> `entity`/`dto`.
  - Always validate input with Jakarta Validation (`@Valid`, `@NotNull`, `@NotBlank`).
  - Encapsulate business logic in transactional service layers.
  - Return consistent DTO responses (`ApiResponse<T>`).
- **Frontend (React + Vite + TypeScript)**:
  - Strict TypeScript checking; avoid `any`.
  - Modular component structure with Tailwind CSS for clean, accessible styling.
  - Consistent state management and typed API service clients.

---

## 5. Pull Request Checklist

Before submitting a PR:
1. Ensure the code compiles cleanly (`mvn clean compile` and `npm run build`).
2. Run automated tests and ensure 100% pass rate (`mvn test`).
3. Verify that your branch is rebased on the latest `main`.
4. Provide a clear PR description detailing what was changed, why, and how to verify.
