import { Lead } from '../types/lead';

export const initialLeads: Lead[] = [
  {
    id: 'L-1234',
    date: '2026-01-15',
    firstName: 'Naufal',
    lastName: 'Ibrahim',
    email: 'naufal@example.com',
    company: 'HUPR',
    industry: 'Technology',
    source: 'IG Story',
    template: 'A3',
    type: 'Direct Ask',
    metrics: 'High',
    marketer: 'Dilla',
    status: 'New',
    approvalStatus: 'Pending'
  },
  {
    id: 'L-1235',
    date: '2026-01-20',
    firstName: 'Rieska',
    lastName: 'Putri',
    email: 'rieska@example.com',
    company: 'Finanem',
    industry: 'Finance',
    source: 'Direct Ad',
    template: 'A1',
    type: 'Direct Ask',
    metrics: 'Medium',
    marketer: 'Dilla',
    status: 'In Progress',
    approvalStatus: 'Approved'
  },
  {
    id: 'L-1236',
    date: '2026-02-09',
    firstName: 'Retta',
    lastName: 'Auzan',
    email: 'retta@example.com',
    company: 'Tech ID',
    industry: 'Technology',
    source: 'DM',
    template: 'A1',
    type: 'Soft Sell',
    metrics: 'Low',
    marketer: 'Dilla',
    status: 'Drop',
    approvalStatus: 'Declined'
  },
  {
    id: 'L-1237',
    date: '2026-02-23',
    firstName: 'Athilla',
    lastName: 'Rahma',
    email: 'athilla@example.com',
    company: 'Business Co',
    industry: 'Business',
    source: 'DM',
    template: 'A13',
    type: 'Direct Ask',
    metrics: 'High',
    marketer: 'Panji',
    status: 'New',
    approvalStatus: 'Pending'
  }
];