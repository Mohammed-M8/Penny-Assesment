# Implementation Notes

## 1. What I changed

<!-- Grouped by task: bugs fixed and features implemented (component + template). -->

### Task 1
The **diff.util.ts** was only checking for the difference in unit price between line items in the baseline list of items and the proposed list of items which led to the change detection test in diff.spec.ts (detects a quantity-only change as changed) failing. *Adding a quantity difference check between baseline item and proposed item fixed the test*

The **cr-detail.components.ts** was only checking if a CR Detail had status PENDING_APPROVAL in the function **canApprove** which was being used to render the Approve Button in CR Details Screen. This led to the test **disables Approve for a read-only viewer on a pending CR** from failing as it allowed non authorized users to see the Approve button. Adding a *&&* check using the **canApprovePolicy** function from **permission.ts** to check whether the Session User has policy to approve led to the successfull hiding of the Approve button for unauthorized users.

### Task 2 
The status filter in cr-list.component was not applying changes to the loaded CRs as the function **get visibleRows** was returning the full list as it is without filtering based on selected status filter. A simple **.filter** on the loaded rows with the match to the status filter fixed the filtering of the CRs based on status.
### Task 3
The approval timeline was sorted chronologically (oldest -> newest) by using a simple **.sort** function on a copy of the timeline array's audit **at** field.

Approval of a CR was enabled in the **approve()** function that calls the mock api and passes the user , the id of the CR component and the time at approval. On success, the data is updated.

Rejection of a CR was enabled in the **reject()** function that calls the mock api and passes the user , the id of the CR component and the time at approval and a rejection reason. On success, the data is updated.

Rejection of a CR that is PENDING_APPROVAL is only enabled if there was a **rejection reason** given to the text area using angular's **FormControl** to let it control the enabling of the Reject Button, and provide error through **action_error**. 


## 2. Component & state model

<!-- The screens, the view-state each component exposes, and how data flows from the mock API into the
template. -->

### Task 0

There are 2 Screens/Sections namely: _Change Request List_ and _Change Request Details_.

There are 5 view states in the application for all Change Requests namely: 'idle' | 'loading' | 'loaded' | 'empty' | 'error'

**The Screens:**

**The Change Request List:** contains a list of change requests for the selected user with status filter and the CR with details in shape of ID, Title, Status and Date. Initial state is of type *idle*
**The Change Request Detail:** contains a detailed summary of the change request with proposed changes, timeline entries along with approval or rejection inputs

Data flows from the mock api to the templates (.html) mainly through **load** functions in the component (.ts) files which are binded to elements in the templates
## 3. Invariants I keep

<!-- Which properties the UI guarantees, and where in the component/template each is enforced. -->

| Invariant | How / where |
| --------- | ----------- |
| Viewer only user cannot see the approve or reject buttons but can read data | approve and rejection buttons rely on canApprove/canReject in cd-detail.component (ts and html) for enable
| Rejection reason is required | FormControl is added to the button and input area to disable on invalid status / cr-detail.component (ts/html)
| One organisation's user cannot view other organisation's users | getChangeRequest scopes requests retrieval based on session user's orgCode (cr-api.service.ts/cr-detail.component.ts)
| CR has to be of status PENDING_APPROVAL for it to be approved or rejected | canApprove/canReject are used to check the status of the CR and is binded to the enabling of the reject and approve buttons (cr-detail.component.html/ts)

## 4. Testing strategy

<!-- What you tested (component/DOM vs pure) and why; what you deliberately skipped given the budget. -->

- for testing if Loading UI shows , the latencyMS in the cr-api.service.ts was increased. **Successfully Showed Loading message**
- for testing if error paragraph shows, the failNExt was set to true in the cr-api.service.ts. **Successfully showed red error message**

### Component Tests
#### Diff Tests (diff.spec.ts)
- Test was added to confirm change is detected if price is only updated similar to the quantity only update test
- Test was added to confirm no changes confirmed as unchanged 
#### List Tests (cr-list.component.spec.ts)
- Test was added to confirm status filter updates the table of CR List elements based on selected status 

#### CR Detail Tests (cr-detail.component.spec.ts)
- Test was added to confirm reject button and div is hidden for viewer users
- Test was added to confirm reject button is enabled on adding input to reject reason text area input.
- Test was added to confirm timeline entries are actually sorted from oldest to newest
- Test was added to show error on unsuthorized user (different Organisation) from viewing the CR of one organisation.


## 5. Assumptions

<!-- Where the requirements left room for interpretation, the calls you made and why. -->

- **Task 3:** I assumed that only users that have approvePolicy permission can reject, therefore i added the same permission check in both **canApprove** and **canReject** functions.
- I also assumed in **Task 3** that the date stored for approval or rejection timeline is to be stored in ISO string format.
- In the detail component the details were only loading **onInit** and i assumed it needed to detect changes with **onChange** instead to bring the new selected detail.

## 6. Where I used AI

- To understand what Angular's Form Control provides out of the box and how i could use it to retrieve the value from rejection reason text area to pass in the **reject()** function as well as validate the input.
- **Task 5:** AI was used in **cr-detail.component.spec.ts** for test **timeline entries are sorted from oldest to newest** to figure out how to retrieve the dates of the entries from the span elements.
AI was used to understand how to inform the test simulation on simulated **inputs and select changes** using **fixture.detectChanges()**
- AI was used to fix the lack of selection of Detail to show by changing cr-detail.component.ts to use **ngOnChange**, instead of **ngOnInit**

## 7. What I'd improve with more time

- implement refresh of data in the list on status change in the detail component
- Add more tests for confirming api errors and loading
