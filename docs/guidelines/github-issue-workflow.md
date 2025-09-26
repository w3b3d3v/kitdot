# GitHub Issue & PR Workflow

This document outlines the BMad-enhanced workflow for managing GitHub issues and pull requests with automatic issue closing capabilities.

## Overview

The BMad workflow provides a comprehensive system for tracking work from GitHub issues through story development to automatic issue resolution via pull request merging.

### Workflow Stages

```
GitHub Issue → Story Creation → Development → PR Creation → QA/PM Review → Merge → Issue Closed
```

## Writing Standards for GitHub Content

**CRITICAL RULE**: All GitHub issues, pull requests, and commit messages MUST follow `docs/writing-guidelines.md` standards.

### Key Requirements for GitHub Content

**Brevity and Clarity:**
- Strip every sentence to its cleanest components
- Remove every word that serves no function
- Choose simple words over complex ones
- Lead with the result, not the process

**Zinsser Test for All GitHub Content:**
1. Can I cut this sentence in half?
2. Is there a simpler word?
3. Does the reader need to know this?
4. Am I saying this twice?

**Specific GitHub Rules:**
- **Issues**: State the problem and desired outcome first
- **PR Descriptions**: State changes and impacts, skip the journey
- **Commit Messages**: What changed and why, in present tense
- **Write for developers/users, not agents**
- Use active voice: "Fixed login bug" not "Login bug was fixed"

### Prohibited Content in GitHub
- AI tool mentions ("Generated with Claude Code")
- AI co-author attribution ("Co-Authored-By: Claude")
- Throat-clearing phrases ("It is important to note that")
- Redundant pairs ("each and every", "first and foremost")
- Meaningless jargon ("utilize" → "use", "implement" → "do")

## Agent Responsibilities

### 1. PM Agent - Issue Management & Oversight

**PM Agent Commands:**
- `*issues` - Search and display open GitHub issues as numbered options
- `*pick-issue` - Work from existing GitHub issue (prompts for issue number)
- `*create-issue` - Create new GitHub issue with proper formatting and corresponding story
- `*close-issue` - Close GitHub issue when work is completed
- `*sync-check` - Check for inconsistencies between GitHub issues and local stories
- `*sync-fix` - Automatically fix inconsistencies between issues and stories
- `*merge-pr {pr_number}` - Merge PR with project management oversight

**PM Workflow:**
1. **Issue Discovery**: Use `*issues` to view open issues
2. **Issue Creation**: Use `*create-issue` to create new issues with stories
3. **Consistency Management**: Use `*sync-check` and `*sync-fix` to maintain alignment
4. **Project Oversight**: Use `*merge-pr` for final project management approval

### 2. Dev Agent - Implementation & PR Creation

**Dev Agent Commands:**
- `*develop-story` - Implement story requirements
- `*create-pr` - Create pull request when development complete
- `*review-qa` - Apply QA feedback and fixes
- `*run-tests` - Execute linting and tests

**Dev Workflow:**
1. **Development**: Use `*develop-story` to implement requirements
2. **Testing**: Use `*run-tests` to validate implementation
3. **PR Creation**: Use `*create-pr` to create pull request with automatic issue linking
4. **Iteration**: Use `*review-qa` to address feedback

### 3. QA Agent - Quality Validation & Merge

**QA Agent Commands:**
- `*review {story}` - Comprehensive quality review with gate decision
- `*merge-pr {pr_number}` - Review and merge PR with quality validation
- `*gate {story}` - Execute quality gate assessment
- `*test-design {story}` - Create comprehensive test scenarios

**QA Workflow:**
1. **Quality Review**: Use `*review` to assess story quality
2. **Gate Decision**: Quality gates determine merge eligibility
3. **PR Merge**: Use `*merge-pr` to merge approved PRs
4. **Issue Resolution**: GitHub issues close automatically on merge

## Automatic Issue Closing System

### Issue Detection in Stories

The system automatically detects GitHub issues referenced in stories using these patterns:

**Direct References:**
- `#123` - Direct issue number
- `issue #123` - Explicit issue reference
- `GitHub issue #123` - Full GitHub issue reference
- `closes #123` - Already formatted for closing
- `fixes #123` - Already formatted for closing

**Search Locations:**
1. Story content body
2. Dev Notes section
3. Change Log entries
4. Task descriptions
5. Story metadata/frontmatter

### PR Creation with Issue Linking

When Dev Agent runs `*create-pr`, it:

1. **Scans Story**: Extracts all GitHub issue references
2. **Generates Syntax**: Creates proper "Closes #123" format
3. **PR Description**: Includes comprehensive development summary
4. **Issue Linking**: Automatically links issues for closure on merge

**Example PR Description:**
```markdown
## Summary
Implement user authentication system with JWT tokens and session management.

## Closes Issues
Closes #15 (user login functionality)
Closes #23 (session management)

## Implementation
- [x] Task 1: Create login endpoint
- [x] Task 2: Implement JWT token generation
- [x] Task 3: Add session middleware

## Changes Made
- `src/auth/login.ts` - Login endpoint implementation
- `src/auth/jwt.ts` - JWT token generation
- `test/auth/login.test.ts` - Login endpoint tests
```

### Quality-Gated Merging

QA and PM agents use quality gates to determine merge eligibility:

**Quality Gate Statuses:**
- `PASS` - Auto-merge approved (score ≥80)
- `CONCERNS` - Manual review required (score 60-79)
- `FAIL` - Block merge, needs fixes (score <60)
- `WAIVED` - Issues acknowledged but explicitly approved

**Merge Decision Criteria:**
1. **Quality Score Threshold**: Default minimum 80/100
2. **CI/CD Checks**: All automated tests must pass
3. **Security Review**: No high-severity security issues
4. **Test Coverage**: Adequate test coverage verified
5. **Code Standards**: Follows project coding standards

## Workflow Examples

### Example 1: New Feature Development

```bash
# PM Agent - Create issue and story
*agent pm
*create-issue
# Creates GitHub issue #45 and corresponding story

# Dev Agent - Implement feature  
*agent dev
*develop-story 2.3
*run-tests
*create-pr
# Creates PR #12 with "Closes #45"

# QA Agent - Review and merge
*agent qa  
*review 2.3
*merge-pr 12
# Merges PR, automatically closes issue #45
```

### Example 2: Issue Consistency Check

```bash
# PM Agent - Check for inconsistencies
*agent pm
*sync-check
# Shows: "Story 1.2 references issue #30 but issue is closed"
*sync-fix
# Updates story status or reopens issue as needed
```

### Example 3: Quality Gate Failure

```bash
# QA Agent - Review finds issues
*agent qa
*merge-pr 15
# Output: "FAIL - Quality score 45/100, 3 high-severity issues found"
# PR remains open, dev notified to address issues

# Dev Agent - Address feedback
*agent dev  
*review-qa
*create-pr
# Updates existing PR with fixes
```

## Issue-to-Story Synchronization

### Bidirectional Sync Requirements

**All GitHub Issues MUST have:**
- Corresponding user story in `docs/stories/`
- Proper story formatting and acceptance criteria
- Clear link between issue and story

**All User Stories MUST have:**
- Corresponding GitHub issue for tracking
- Issue reference in story metadata
- Consistent status between issue and story

### Sync Commands (PM Agent)

**`*sync-check` - Detect Inconsistencies:**
- Stories without corresponding issues
- Issues without corresponding stories  
- Status mismatches (open issue, done story)
- Closed issues with incomplete stories
- Orphaned references

**`*sync-fix` - Automatic Resolution:**
- Create missing issues for stories
- Create missing stories for issues
- Update statuses to maintain consistency
- Fix broken references
- Report changes made

## Quality Thresholds

### Default Quality Score Calculation

```
Quality Score = 100 - (20 × FAILs) - (10 × CONCERNS)
```

**Merge Thresholds:**
- `≥90`: Excellent (auto-merge)
- `80-89`: Good (auto-merge with notes)  
- `60-79`: Acceptable (manual review required)
- `<60`: Needs improvement (block merge)

### Customizable Thresholds

Configure in `docs/technical-preferences.md`:

```yaml
qa_merge_thresholds:
  auto_merge_min: 80
  manual_review_min: 60
  block_merge_max: 59
```

## Best Practices

### For PM Agents

1. **Regular Sync Checks**: Run `*sync-check` weekly to maintain consistency
2. **Issue Lifecycle**: Use `*issues` to track open work and priorities  
3. **Quality Oversight**: Use `*merge-pr` for critical features requiring PM approval
4. **Writing Standards**: Enforce `docs/writing-guidelines.md` for all GitHub content
5. **Quality Control**: Apply Zinsser Test to all issues and PRs before creation

### For Dev Agents

1. **Reference Issues**: Always reference relevant GitHub issues in stories
2. **Complete Testing**: Run `*run-tests` before `*create-pr`
3. **Writing Standards**: Follow `docs/writing-guidelines.md` for PR descriptions and commit messages
4. **Clear Communication**: Lead with results, use active voice, cut unnecessary words
5. **Respond to Feedback**: Use `*review-qa` promptly to address QA concerns

### For QA Agents

1. **Thorough Review**: Use `*review` before considering `*merge-pr`
2. **Quality Standards**: Don't compromise on quality thresholds
3. **Writing Standards**: Verify PR descriptions follow `docs/writing-guidelines.md`
4. **Clear Feedback**: Provide actionable feedback for FAIL/CONCERNS statuses
5. **Documentation**: Maintain QA gate files for audit trails

## Integration Points

### With GitHub

- **Issue Closing**: Automatic via "Closes #123" syntax in PR descriptions
- **Branch Management**: Feature branches auto-created and cleaned up
- **CI/CD Integration**: Quality gates respect automated check results
- **Audit Trail**: Complete history preserved in PR discussions

### With BMad Stories

- **Status Synchronization**: Story status updates reflect issue states
- **File Tracking**: PR file changes align with story File Lists
- **Quality Gates**: QA results stored in story QA Results sections
- **Completion Tracking**: Stories marked "Done" when issues closed

### With Documentation

- **QA Reports**: Generated in `docs/qa/reports/`
- **Gate Files**: Stored in `docs/qa/gates/`
- **Merge History**: Preserved in `docs/qa/reports/{story}-merge-{date}.md`
- **Consistency Reports**: Generated by sync commands

## Troubleshooting

### Common Issues

**Issue Not Detected:**
- Check story content for proper #123 format
- Verify issue exists and is accessible
- Use explicit "GitHub issue #123" format if needed

**PR Creation Fails:**
- Ensure all tests pass (`deno test -A`)
- Check for uncommitted changes
- Verify GitHub CLI authentication (`gh auth status`)

**Merge Blocked:**
- Review QA gate status and quality score
- Address high-severity issues in gate file
- Ensure all CI/CD checks are passing

**Sync Issues:**
- Run `*sync-check` to identify problems
- Use `*sync-fix` to auto-resolve common issues
- Manually fix complex inconsistencies

### Recovery Procedures

**Orphaned Stories:**
1. Use PM `*sync-check` to identify
2. Create corresponding GitHub issues
3. Update story metadata with issue references

**Orphaned Issues:**
1. Use PM `*issues` to review open issues
2. Create corresponding stories using `*create-story`
3. Link issues in story content

**Failed Merges:**
1. Check QA gate file for specific failures
2. Use Dev `*review-qa` to address issues
3. Re-run QA review process
4. Attempt merge again when quality gates pass

## Monitoring & Metrics

### Key Metrics to Track

- **Issue Resolution Time**: From creation to closure
- **Quality Gate Pass Rate**: Percentage of PRs passing on first review
- **Sync Consistency**: Percentage of stories/issues properly synchronized
- **Merge Success Rate**: Percentage of PRs merged without rework

### Regular Maintenance

- **Weekly Sync Check**: Run PM `*sync-check` every week
- **Monthly Quality Review**: Analyze QA gate patterns and adjust thresholds
- **Quarterly Process Review**: Evaluate workflow efficiency and improvements

---

*This workflow integrates seamlessly with existing BMad processes while adding robust GitHub integration and automatic issue resolution capabilities.*