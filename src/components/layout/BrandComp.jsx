import { Orbit } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BrandComp({ light = false }) {
  return (
    <Link to="/" className={`brand ${light ? 'brand--light' : ''}`} aria-label="ORBITAL home">
      <span className="brand__mark"><Orbit size={19} strokeWidth={1.55} /></span>
      <span className="brand__word">ORBITAL<span>.</span></span>
    </Link>
  );
}
