/** Shape a real carrier/API integration must return. No live data is produced today. */
export interface ShipmentEvent { at: string; location?: string; label: string }
export interface Shipment {
  trackingNumber: string;
  status: 'pending' | 'in_transit' | 'customs' | 'delivered' | 'exception';
  origin: string; destination: string; estimatedArrival?: string;
  milestones: ShipmentEvent[]; documents: { name: string; url: string }[];
}
export type TrackingResult = { state: 'not_configured' } | { state: 'found'; shipment: Shipment } | { state: 'not_found' };

/** Replace the body with a call to a server route that talks to a carrier API. */
export async function lookupShipment(_trackingNumber: string): Promise<TrackingResult> {
  return { state: 'not_configured' };
}
