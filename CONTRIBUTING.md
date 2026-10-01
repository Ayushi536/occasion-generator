# Team Git Workflow

## Branches

```text
main
dev
feature/m1-templates
feature/m2-wizard
feature/m3-backend
feature/m4-media
feature/m5-devops
```

## Before Starting

```bash
git status
git branch --show-current
git pull origin dev
```

## Commit Frequently

Use meaningful commits:

```text
feat(auth): add JWT login
feat(wizard): add recipient step
feat(media): add signed Cloudinary upload
feat(template): add neon night hero
fix(api): validate publish payload
docs: update team task tracker
```

Avoid:

```text
final
asdf
changes
done
final-final
```

## Before Merge

```bash
git fetch origin
git checkout dev
git pull origin dev
git checkout <your-branch>
git merge dev
```

Resolve conflicts, run the app, test, then push.

## Never Run Without Team Agreement

```bash
git push --force
git reset --hard
git clean -fd
```

## Conflict Rule

If a conflict touches another member's owned files:
1. Stop.
2. Do not overwrite.
3. Identify the intended behavior.
4. Inform the owner.
5. Resolve together.
6. Test the integrated result.
