// Examples/react-router/DynamicRoutes.jsx
// مستندات: React-Router/Dynamic-Routes.md
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Outlet,
  useParams,
} from "react-router-dom";

const CITIES = [
  { id: "73930358", name: "Tehran", emoji: "🇮🇷" },
  { id: "2988507", name: "Paris", emoji: "🇫🇷" },
];

function CityList() {
  return (
    <ul>
      {CITIES.map((city) => (
        <li key={city.id}>
          {/* نسبی: به انتهای /cities اضافه می‌شود */}
          <Link to={city.id}>
            {city.emoji} {city.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function CityDetail() {
  const { cityId } = useParams();
  const city = CITIES.find((c) => c.id === cityId);
  if (!city) return <p>City not found</p>;
  return (
    <div>
      <h1>
        {city.emoji} {city.name}
      </h1>
      <p>ID from URL: {cityId}</p>
    </div>
  );
}

function CitiesLayout() {
  return (
    <div>
      <h2>Cities</h2>
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cities" element={<CitiesLayout />}>
          <Route index element={<CityList />} />
          <Route path=":cityId" element={<CityDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
