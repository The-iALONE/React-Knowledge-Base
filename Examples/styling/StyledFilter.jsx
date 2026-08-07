// Examples/styling/StyledFilter.jsx — Styling/CSS-in-JS.md
import styled, { css } from "styled-components";

const StyledFilter = styled.div`
  display: flex;
  gap: 0.8rem;
  padding: 0.4rem;
  border-radius: 6px;
  background-color: #f3f4f6;
`;

const FilterButton = styled.button`
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 1.4rem;
  cursor: pointer;
  background: transparent;

  ${(props) =>
    props.$active &&
    css`
      background-color: #059669;
      color: white;
    `}
`;

export default function StyledFilter({ filter, onFilterChange }) {
  return (
    <StyledFilter>
      <FilterButton
        $active={filter === "all"}
        onClick={() => onFilterChange("all")}
      >
        All
      </FilterButton>
      <FilterButton
        $active={filter === "discounted"}
        onClick={() => onFilterChange("discounted")}
      >
        Discounted
      </FilterButton>
    </StyledFilter>
  );
}
