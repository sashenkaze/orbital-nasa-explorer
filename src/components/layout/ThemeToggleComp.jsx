import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function ThemeToggleComp({ compact = false }) {
  const { theme, toggleTheme } = useTheme();
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  return (
    <button className={`icon-button theme-toggle ${compact ? 'icon-button--compact' : ''}`} type="button" onClick={toggleTheme} aria-label={label} title={label}>
      <span className="theme-toggle__icon theme-toggle__icon--sun"><Sun size={17} strokeWidth={1.7} /></span>
      <span className="theme-toggle__icon theme-toggle__icon--moon"><Moon size={17} strokeWidth={1.7} /></span>
    </button>
  );
}
