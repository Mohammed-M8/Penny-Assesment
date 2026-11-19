import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrDetailComponent } from './cr-detail.component';
import { SessionService } from '../../session/session.service';
import { users } from '../../api/fixtures';
import { ReqUser } from '../../models/cr.models';

const flush = () => new Promise((r) => setTimeout(r, 0));

async function render(user: ReqUser, id: string): Promise<ComponentFixture<CrDetailComponent>> {
	TestBed.configureTestingModule({
		imports: [CrDetailComponent],
		providers: [{ provide: SessionService, useValue: { user } }],
	});
	await TestBed.compileComponents();
	const fixture = TestBed.createComponent(CrDetailComponent);
	fixture.componentInstance.id = id;
	fixture.detectChanges(); // ngOnInit -> load()
	await flush(); // let the mock API resolve
	fixture.detectChanges(); // render the loaded state
	return fixture;
}

describe('CrDetailComponent', () => {
	it('loads and renders the change request title', async () => {
		const fixture = await render(users.approver, 'CR-1');
		expect(fixture.nativeElement.querySelector('.cr-detail__header h2').textContent).toContain('Add 1 unit of SKU-A');
	});

	it('disables Approve for a read-only viewer on a pending CR', async () => {
		const fixture = await render(users.viewer, 'CR-1'); // viewer: cr_r_o only; CR-1 is PENDING_APPROVAL
		const approveBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.cr-actions__approve');
		expect(approveBtn.disabled).toBe(true);
	});

	it('hides Reject for a read-only viewer on a pending CR',async ()=>{
		const fixture=await render(users.viewer,'CR-1');
		const rejectDiv:HTMLButtonElement=fixture.nativeElement.querySelector('.cr-actions__reject');
		const rejectBtn:HTMLButtonElement=fixture.nativeElement.querySelector('.cr-actions__reject-btn')
		expect(rejectDiv).toBeNull()
		expect(rejectBtn).toBeNull()
	})

	it('disables reject button on invalidity of rejection reason input',async ()=>{
		const fixture=await render(users.approver,'CR-1')
		const rejectBtn:HTMLButtonElement=fixture.nativeElement.querySelector('.cr-actions__reject-btn')
		expect(rejectBtn.disabled).toBe(true)
	})

	it('enables reject button on validity of rejection reason input',async ()=>{
		const fixture=await render(users.approver,'CR-1')
		const reasonTextArea:HTMLTextAreaElement=fixture.nativeElement.querySelector('.cr-actions__reason')
		const rejectBtn:HTMLButtonElement=fixture.nativeElement.querySelector('.cr-actions__reject-btn')
		reasonTextArea.value='test'
		reasonTextArea.dispatchEvent(new Event('input'))
		fixture.detectChanges()
		expect(rejectBtn.disabled).toBe(false)
	})
	it('disables reject button on whitespace in rejection reason input',async ()=>{
		const fixture=await render(users.approver,'CR-1')
		const reasonTextArea:HTMLTextAreaElement=fixture.nativeElement.querySelector('.cr-actions__reason')
		const rejectBtn:HTMLButtonElement=fixture.nativeElement.querySelector('.cr-actions__reject-btn')
		reasonTextArea.value='     '
		reasonTextArea.dispatchEvent(new Event('input'))
		fixture.detectChanges()
		expect(rejectBtn.disabled).toBe(true)
	})

	it('timeline entries are sorted from oldest to newest',async ()=>{
		const fixture=await render(users.approver,'CR-1')
		const crTimelines:HTMLLIElement[]=fixture.nativeElement.querySelectorAll('.cr-timeline__entry')
		const dates=Array.from(crTimelines).map((e)=>e.querySelector('.cr-timeline__at').textContent)
		expect(new Date(dates[0]!).getTime()).toBeLessThan(new Date(dates[1]!).getTime())

	})

	it('show error message on wrong organisation user access',async ()=>{
		const fixture=await render(users.otherOrg,'CR-1')
		const crErrorElement:HTMLDivElement=fixture.nativeElement.querySelector('.cr-detail__error')
		expect(crErrorElement).not.toBeNull()
	})


});
