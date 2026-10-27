import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render brand or hero headline', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toBeTruthy();
  });

  it('should contain all 17 freelance tracks matching program highlights', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect((app as any).freelanceTracks.length).toBe(17);
  });

  it('should filter freelance tracks correctly', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance as any;
    app.setFreelanceTrackFilter('engineering');
    expect(app.filteredFreelanceTracks().length).toBe(6);

    app.setFreelanceTrackFilter('ai-data');
    expect(app.filteredFreelanceTracks().length).toBe(6);

    app.setFreelanceTrackFilter('cloud');
    expect(app.filteredFreelanceTracks().length).toBe(3);

    app.setFreelanceTrackFilter('business');
    expect(app.filteredFreelanceTracks().length).toBe(2);

    app.setFreelanceTrackFilter('all');
    expect(app.filteredFreelanceTracks().length).toBe(17);
  });

  it('should navigate to freelance page and select track', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance as any;
    app.navigateTo('freelance');
    expect(app.currentPage()).toBe('freelance');

    app.selectFreelanceTrack('Artificial Intelligence (AI)');
    expect(app.freelanceSelectedTrack()).toBe('Artificial Intelligence (AI)');
  });
});
