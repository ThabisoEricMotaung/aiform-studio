const STUDIO_ADDRESS = "607 Fred Messenger Avenue, Andeon AH, Pretoria, 0183, South Africa";

// Google's documented "search action" URL — resolves reliably without an
// API key or hardcoded coordinates, and opens the Maps app on mobile.
export const STUDIO_ADDRESS_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  STUDIO_ADDRESS,
)}`;
