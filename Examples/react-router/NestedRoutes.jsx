// Examples/react-router/NestedRoutes.jsx
// مستندات: React-Router/Nested-Routes.md
import { BrowserRouter, Routes, Route, Link, Outlet, useParams } from "react-router-dom";

function AppLayout() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
      </nav>
      <Outlet />
    </div>
  );
}

function ProductList() {
  return (
    <ul>
      <li><Link to="/products/1">Product 1</Link></li>
      <li><Link to="/products/2">Product 2</Link></li>
    </ul>
  );
}

function ProductDetail() {
  const { productId } = useParams();
  return <h1>Product #{productId}</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<h1>Home</h1>} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/:productId" element={<ProductDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
