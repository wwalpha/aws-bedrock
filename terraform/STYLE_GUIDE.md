# Terraform Style Guide

Consistent header comments and structure for all Terraform resource blocks in this repository.

## Header Comment Block

Each logical resource (or tightly related group) must be preceded by a 3-line header:

```
# ----------------------------------------------------------------------------------------------
# <Component / Service / Purpose>
# ----------------------------------------------------------------------------------------------
```

- Use exactly 94 hyphens (match existing) between `# ` and line end.
- Wording: Start with AWS/Amazon/<Provider> followed by specific component and short purpose.
- For data sources: indicate with `AWS` or provider name and a short descriptor.

## Ordering Within Files

1. Header block for the file (optional concise summary)
2. Data sources required by subsequent resources
3. IAM roles/policies before the resources that depend on them
4. Core resources
5. Outputs (if file-scoped)

## Naming Conventions

- Resource names: keep existing pattern `<prefix>_<component>` where applicable.
- Local names: descriptive, snake_case.
- Variables: snake_case, explicit description.

## Inline Policies

- Use `jsonencode` with canonical ordering: Version, Statement.
- Statement list items: Effect, Action, Resource, Condition (if any).

## Comments

- Avoid redundant comments that restate code (e.g., `# Create bucket`). Prefer purpose/context.
- Group related minor resources (e.g., bucket + versioning) each with its own header.
- Outputs: every individual `output` block also gets its own header (no grouping header only). If multiple outputs are semantically identical (rare), still keep separate headers for scan consistency.

## Imports / New Resources Checklist

When adding a new resource:

- [ ] Add header block
- [ ] Reference existing locals/variables where possible
- [ ] Minimal privileges (least privilege)
- [ ] Add to env file if exposing identifier to runtime
- [ ] Add output only if needed by external module/user

## Formatting

Run `terraform fmt` before commit (CI will enforce later if added).

## Future Enhancements

- Pre-commit hook to enforce header detection.
- Lint: tflint + tfsec integration.
