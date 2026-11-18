# Implementation Notes

## 1. What I changed

<!-- Grouped by task: bugs fixed and features implemented (component + template). -->

### Task 1
The **diff.util.ts** was only checking for the difference in unit price between line items in the baseline list of items and the proposed list of items which led to the change detection test in diff.spec.ts (detects a quantity-only change as changed) failing. *Adding a quantity difference check between baseline item and proposed item fixed the test*

The **cr-detail.components.ts** was only checking if a CR Detail had status PENDING_APPROVAL in the function **canApprove** which was being used to render the Approve Button in CR Details Screen. This led to the test **disables Approve for a read-only viewer on a pending CR** from failing as it allowed non authorized users to see the Approve button. Adding a *&&* check using the **canApprovePolicy** function from **permission.ts** to check whether the Session User has policy to approve led to the successfull hiding of the Approve button for unauthorized users.

### Task 2 
The status filter in cr-list.component was not applying changes to the loaded CRs as the function **get visibleRows** was returning the full list as it is without filtering based on selected status filter. A simple **.filter** on the loaded rows with the match to the status filter fixed the filtering of the CRs based on status.

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
