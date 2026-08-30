export function RouteLoading() {
  return (
    <div className="wr-route-loading" role="status" aria-live="polite">
      <span className="wr-route-loading__line" />
      <span className="sr-only">Loading page</span>
    </div>
  );
}
