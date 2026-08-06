import { memo, useCallback, useMemo, useState } from "react";

const ProductRow = memo(function ProductRow({ product, onSelect }) {
  return (
    <tr onClick={() => onSelect(product.id)}>
      <td>{product.name}</td>
      <td>{product.price}</td>
    </tr>
  );
});

export default function ProductList({ products }) {
  const [filter, setFilter] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const filteredProducts = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(filter.toLowerCase())),
    [products, filter]
  );

  const handleSelect = useCallback((id) => setSelectedId(id), []);

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search products..."
      />
      <table>
        <tbody>
          {filteredProducts.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onSelect={handleSelect}
            />
          ))}
        </tbody>
      </table>
      {selectedId && <p>Selected: {selectedId}</p>}
    </div>
  );
}
