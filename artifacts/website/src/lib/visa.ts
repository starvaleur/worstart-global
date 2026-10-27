export const destinations = ['USA', 'Europe / Schengen', 'UK', 'UAE', 'China', 'Türkiye', 'Other destination'];
export const visaTypes: Record<string, string[]> = {
  Tourist: ['Valid passport', 'Passport-style photos', 'Completed application form', 'Travel itinerary', 'Proof of accommodation', 'Proof of funds'],
  Business: ['Valid passport', 'Passport-style photos', 'Completed application form', 'Invitation or company letter', 'Business registration documents', 'Proof of funds'],
  Student: ['Valid passport', 'Passport-style photos', 'Completed application form', 'Admission letter', 'Proof of funds', 'Academic records'],
  Work: ['Valid passport', 'Passport-style photos', 'Completed application form', 'Employment offer or contract', 'Qualification records'],
  Transit: ['Valid passport', 'Onward ticket', 'Destination visa or entry proof, if required'],
};
export const appointmentServices = ['Consultation', 'Document review', 'Application assistance', 'Appointment assistance'];
export const DISCLAIMER = 'WORSTART provides assistance and document preparation support only. We are not a government authority or embassy, we do not guarantee visa approval, and we cannot see official appointment availability.';
