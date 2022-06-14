// component
import { config } from '../../consts';
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('mdi:cloud-upload'),
  },
  {
    title: 'show files',
    path: '/dashboard/files',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: 'metrics',
    path: '/dashboard/metrics',
    icon: getIcon('mdi:chart-areaspline'),
  },
  {
    title: 'help',
    path: '/dashboard/help',
    icon: getIcon('bx:help-circle'),
    icon: getIcon('eva:file-text-fill'),
  }
].concat(!config.SHOW_TEMPLATE ? [] : [
  {
    title: 'user',
    path: '/dashboard/user',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'product',
    path: '/dashboard/products',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: 'blog',
    path: '/dashboard/blog',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'login',
    path: '/login',
    icon: getIcon('eva:lock-fill'),
  },
  {
    title: 'register',
    path: '/register',
    icon: getIcon('eva:person-add-fill'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: getIcon('eva:alert-triangle-fill'),
  }],
);

export default navConfig;
