import Dashboard from "./component/dashboard/Dashboard";
import Machine from "./component/machine/Machine";
import Order from "./component/order/Order";
import Product from "./component/product/Product";
import Production from "./component/production/Production";
import Packaging from "./component/packaging/Packaging";
import OutSource from "./component/outSource/outSource";
import Vendor from "./component/vendor/Vendor";

const routes = [
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/order",
    element: <Order />,
  },
  {
    path: "/product",
    element: <Product />,
  },
  {
    path: "/production",
    element: <Production />,
  },
  {
    path: "/machine",
    element: <Machine />,
  },
  {
    path: "/packaging",
    element: <Packaging />,
  },
  {
    path: "/outSource",
    element: <OutSource/>,
  },
  {
    path: "/vendor",
    element: <Vendor/>,
  },
];

export default routes;
