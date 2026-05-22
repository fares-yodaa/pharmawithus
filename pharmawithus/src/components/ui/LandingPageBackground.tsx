/**
 * Single continuous background for the marketing homepage.
 * Soft pink + pharmacy purple mesh (Stripe/Linear-style) with a light dot grid.
 */
export function LandingPageBackground() {
  return (
    <div className="landing-page-bg" aria-hidden>
      <div className="landing-page-bg__blob landing-page-bg__blob--1" />
      <div className="landing-page-bg__blob landing-page-bg__blob--2" />
      <div className="landing-page-bg__blob landing-page-bg__blob--3" />
      <div className="landing-page-bg__grid dot-grid" />
    </div>
  );
}
