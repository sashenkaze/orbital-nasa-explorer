import { ArrowUpRight, ExternalLink, Image, Telescope, Bookmark } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="about-page page-enter">
      <div className="page-heading"><div><span className="section-kicker">A SMALL NOTE ABOUT THIS PROJECT / 05</span><h1>Built for the <em>curious.</em></h1><p>ORBITAL is an independent way to browse the public NASA Image and Video Library.</p></div><span className="page-heading__index">ABOUT<br />ORBITAL / 01</span></div>
      <div className="about-hero"><div className="about-hero__orb"><div /><span>NASA<br />MEDIA</span></div><div className="about-hero__copy"><span className="section-kicker">AN INDEPENDENT PROJECT</span><h2>A different window into the archive.</h2><p>ORBITAL brings photographs, video, audio, and their supporting metadata into a single browsing experience. It is designed to make discovery feel a little more human, without getting in the way of the material itself.</p><a className="text-link" href="https://images.nasa.gov/" target="_blank" rel="noreferrer">Visit the official NASA library <ArrowUpRight size={15} /></a></div></div>
      <div className="about-facts">
        <div><Image size={19}/><span className="section-kicker">THE COLLECTION</span><h3>More than photographs</h3><p>Explore still images, moving footage, audio recordings, and the stories attached to each record.</p></div>
        <div><Telescope size={19}/><span className="section-kicker">THE WAY IN</span><h3>Follow your curiosity</h3><p>Move between missions, subjects, places, and the people who helped document them.</p></div>
        <div><Bookmark size={19}/><span className="section-kicker">YOUR ORBIT</span><h3>Keep what matters</h3><p>Save discoveries and return to recently viewed material as you explore.</p></div>
      </div>
      <div className="about-attribution"><span>DATA & MEDIA SOURCE</span><a href="https://images.nasa.gov/" target="_blank" rel="noreferrer">NASA Image and Video Library <ExternalLink size={13}/></a><p>NASA content may have individual credits or usage notes in its metadata. Please retain source credits and review the record for each asset before reuse. ORBITAL is not affiliated with or endorsed by NASA.</p></div>
    </div>
  );
}
