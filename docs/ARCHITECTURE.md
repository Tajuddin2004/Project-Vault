# Project Vault architecture

## Main user flow

```text
Landing → Sign up / sign in → Email OTP verification → Dashboard
  → Profile update → Personal information on Home
  → Add project → View project → Publish / explore / search
```

## Roles

- `student`: owns a profile and projects.
- `faculty`: reviews submitted projects in a later phase.
- `recruiter`: explores published projects and contacts students.
- `admin`: manages platform-level concerns.

## Docker boundary

The API never runs student containers directly. It creates an `ExecutionRun` record and a job; the separately deployed sandbox worker pulls that job, runs a constrained container, streams logs, then deletes the workspace and container at expiry.
