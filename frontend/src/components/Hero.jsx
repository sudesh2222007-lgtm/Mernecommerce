import React from 'react';
import { Search } from 'lucide-react';

export default function Hero({ searchTerm, setSearchTerm, onSearchSubmit }) {
  return (
    <section className="hero-section">
      <h1 className="hero-title">Everyday essentials, made to last.</h1>
      <p className="hero-subtitle">
        Thoughtfully sourced electronics, footwear and accessories — shipped fast, backed by real reviews.
      </p>

      <form className="hero-search-wrapper" onSubmit={(e) => { e.preventDefault(); if (onSearchSubmit) onSearchSubmit(); }}>
        <Search size={18} color="#94a3b8" style={{ marginRight: '10px' }} />
        <input
          type="text"
          className="hero-search-input"
          placeholder="Search for headphones, shoes, watches..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="hero-search-btn">
          Search
        </button>
      </form>
    </section>
  );
}
