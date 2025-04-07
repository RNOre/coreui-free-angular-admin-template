import {INavData} from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Главная',
    iconComponent: {name: 'cil-home'},
    url: '/'
  },
  {
    name: 'Биллинг',
    iconComponent: {name: 'cil-credit-card'},
    children: [
      {
        name: 'Тарифы',
        url: '/billing/tariffs',
      },
      {
        name: 'Лицензии',
        url: '/billing/licenses',
      },
      {
        name: 'Оплаты',
        url: '/billing/payments'
      },
    ]
  },
  {
    name: 'Пользователи',
    url: '/users',
    iconComponent: {name: 'cil-user'}
  },
  {
    name: 'Организации',
    url: '/company',
    iconComponent: {name: 'cil-people'}
  },
  {
    name: 'Заявки',
    url: '/order',
    iconComponent: {name: 'cil-list'}
  },
  {
    name: 'Подписки',
    url: '/subs',
    iconComponent: {name: 'cil-heart'}
  }
];
