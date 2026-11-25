import { ArrowUpRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ThemeToggleComp from './ThemeToggleComp.jsx';

export default function TopbarComp() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const submit = (event) => {
    event.preventDefault();
    const value = query.trim();
    if (value) navigate(`/search?q=${encodeURIComponent(value)}`);
  };

  return (
    <header className="topbar">
      <div className="topbar__breadcrumb"><span>THE ARCHIVE</span><i>/</i><strong>DISCOVER</strong></div>
      <form className="topbar-search" onSubmit={submit} role="search">
        <Search size={16} />
        <input aria-label="Search NASA media" placeholder="Search NASA media..." value={query} onChange={(event) => setQuery(event.target.value)} />
        <kbd>↵</kbd>
      </form>
      <div className="topbar__actions">
        <a className="topbar__external" href="https://images.nasa.gov/" target="_blank" rel="noreferrer">NASA LIBRARY <ArrowUpRight size={13} /></a>
        <ThemeToggleComp />
      </div>
    </header>
  );
}
