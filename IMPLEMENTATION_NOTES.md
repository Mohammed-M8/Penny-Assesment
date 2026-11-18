# Implementation Notes

## 1. What I changed

<!-- Grouped by task: bugs fixed and features implemented (component + template). -->

-

## 2. Component & state model

<!-- The screens, the view-state each component exposes, and how data flows from the mock API into the
template. -->

### Task 0

There are 2 Screens/Sections namely: _Change Request List_ and _Change Request Details_.

There are 5 view states in the application for all Change Requests namely: 'idle' | 'loading' | 'loaded' | 'empty' | 'error'

**The Screens:**

**The Change Request List:** contains a list of change requests for the selected user with status filter and the CR with details in shape of ID, Title, Status and Date. Initial state is of type *idle*
**The Change Request Detail:** contains a detailed summary of the change request with proposed changes, timeline entries along with approval or rejection inputs

## 3. Invariants I keep

<!-- Which properties the UI guarantees, and where in the component/template each is enforced. -->

| Invariant | How / where |
| --------- | ----------- |

## 4. Testing strategy

<!-- What you tested (component/DOM vs pure) and why; what you deliberately skipped given the budget. -->

-

## 5. Assumptions

<!-- Where the requirements left room for interpretation, the calls you made and why. -->

-

## 6. Where I used AI

-

## 7. What I'd improve with more time

-
