import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Home',
    url: '/landlord/dashboard',
    icon: 'fa fa-home',
  },
  {
    name: 'Property Manager',
    icon: 'fa fa-building',
    url: '/landlord/property',
  },
  {
    name: 'Tenant Manager',
    icon: 'fa fa-user',
    url: '/landlord/tenant',
    children: [
      {
        name: 'Ongoing Tenancy',
        url: '/landlord/tenant/ongoing',
      },
      {
        name: 'Add Tenant',
        url: '/landlord/tenant/add',
      },
      {
        name: 'Issue Tracker',
        url: '/landlord/tenant/issue-tracker',
      },
    ],
  },
  {
    name: 'Reports',
    icon: 'fa fa-bar-chart',
    url: '/landlord/report',
    children: [
      {
        name: 'View Rent Report',
        url: '/landlord/report/rent-report',
      },
      {
        name: 'View Issue Report',
        url: '/landlord/report/issue-report',
      },
    ],
  },
];
