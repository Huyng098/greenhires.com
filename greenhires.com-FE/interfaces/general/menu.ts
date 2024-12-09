export type Menu = {
  id: number;
  title: string;
  path?: string;
  newTab: boolean;
  link?: string;
  icon?: any;
  submenu?: Menu[];
  description?: string;
};
