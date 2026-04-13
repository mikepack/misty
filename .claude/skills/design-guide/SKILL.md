---
# Design Guide

## Overview

This skill defines the visual design system for Open Orchestration. Consult this before writing any frontend code, creating components, or making styling decisions.

The design system is based on **Primer** (GitHub's design system), implemented in **Tailwind CSS v4** with domain-specific extensions for care orchestration. Brand context is in `docs/brand-overview.md`. Design tokens are defined in `packages/design-tokens/globals.css`.

## Token Architecture

Three layers. Always use the highest applicable layer:

1. **Functional tokens** — semantic roles like `fg-default`, `bg-muted`, `border-default`. Use these for all standard UI.
2. **Domain tokens** — care orchestration extensions like `executor-human`, `status-active`. Use these for domain-specific UI.
3. **Base scale** — raw gray values (`scale-gray-0` through `scale-gray-9`). Never use directly in components. Reference only for building new functional tokens.

## Color Roles

| Role | Token prefix | Hex | Use for |
|------|-------------|-----|---------|
| Default | `fg-default` | #1f2328 | Primary text |
| Muted | `fg-muted` | #656d76 | Secondary text, labels |
| Accent | `fg-accent` / `bg-accent-*` | #0969da | Links, focus rings, selected states |
| Success | `fg-success` / `bg-success-*` | #1a7f37 | Positive states, primary actions, human work |
| Attention | `fg-attention` / `bg-attention-*` | #9a6700 | Warnings, guardrail states |
| Danger | `fg-danger` / `bg-danger-*` | #d1242f | Errors, destructive actions, failed states |
| Done | `fg-done` / `bg-done-*` | #8250df | Completed states, agent/AI activity |

## Domain Color Mapping

### Executor type
- **Human** → `success` (green) — `var(--color-executor-human)`
- **Agent** → `done` (purple) — `var(--color-executor-agent)`
- **System** → `gray-4` — `var(--color-executor-system)`

### Track status
- **Active** → `success` — `var(--color-status-active)`
- **Completed** → `done` — `var(--color-status-completed)`
- **Suspended** → `attention` — `var(--color-status-suspended)`
- **Failed** → `danger` — `var(--color-status-failed)`
- **Draft** → `gray-4` — `var(--color-status-draft)`
- **Pending** → `gray-5` — `var(--color-status-pending)`

## Typography

Two font stacks. No custom or display fonts.

| Stack | Token | Use for |
|-------|-------|---------|
| System | `--font-family-system` | All UI text: body, headings, labels, buttons |
| Monospace | `--font-family-mono` | Code, tokens, timestamps, data values, status labels |

### Type scale

| Name | Size | Weight | Use for |
|------|------|--------|---------|
| title-lg | 32px | 600 | Page titles |
| title-md | 20px | 600 | Section headings |
| title-sm | 16px | 600 | Subsection headings |
| body-lg | 16px | 400 | Prominent body text |
| body-md | 14px | 400 | Default body text (base) |
| body-sm | 12px | 400 | Captions, helper text |

Base size is **14px**. Line-heights are unitless, aligned to a 4px grid.

## Spacing

Base-4 scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64. Use Tailwind spacing utilities (`p-2`, `gap-4`, etc.) which map to the scale defined in `globals.css`.

## Border Radius

| Name | Value | Use for |
|------|-------|---------|
| sm | 3px | Inline elements, badges, code |
| md | 6px | Cards, inputs, buttons (default) |
| lg | 12px | Modals, overlays, large containers |
| full | 9999px | Pills, avatars, status dots |

## Rules

### Do
- Use functional tokens (`fg-default`, `bg-muted`, `border-default`) for all styling
- Use domain tokens (`executor-human`, `status-active`) for care orchestration UI
- Use `done` (purple) for agent/AI activity — this is the primary visual differentiator between human and agent work
- Use `success` (green) for human-completed work and primary actions
- Use `attention` (amber) for guardrail-related states
- Use monospace for code, tokens, timestamps, and data values
- Write irreverent microcopy in empty states, error messages, loading states, and tooltips
- Keep density — this is an operations platform, not a consumer app

### Don't
- Don't use base scale tokens (`scale-gray-*`) directly in components
- Don't use `accent` (blue) and `done` (purple) interchangeably — accent is for interactive states, done is for completion and agent activity
- Don't use irreverent tone in clinical context: patient data, care flow execution status, goal evaluation, guardrail violations, ledger records
- Don't add custom fonts, display typefaces, or decorative typography
- Don't flatten complex views into oversimplified dashboards — density is expected
- Don't use color for decoration — every color use must carry semantic meaning
- Don't use arbitrary spacing values — stick to the base-4 scale
- Don't hardcode hex values — always use CSS variables or Tailwind utilities

## Irreverence Boundary

System voice allows personality: empty states, error messages, onboarding, loading states, tooltips, hints.

Clinical context requires neutrality: patient data, care flow execution, goal evaluation, guardrail violations, ledger records. If a clinician is reading it to make a care decision, it's clinical context.

## Related Files

| File | Purpose |
|------|---------|
| `docs/brand-overview.md` | Brand identity, attributes, principles, tone |
| `docs/ui-philosophy.md` | UI decision framework and principles |
| `packages/design-tokens/globals.css` | Design tokens (CSS custom properties + Tailwind theme) |
| `docs/Ontology.md` | Domain concepts that inform naming and color mapping |