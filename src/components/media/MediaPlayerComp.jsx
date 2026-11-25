import { useState } from 'react';
import { Film, Headphones, Image as ImageIcon, Maximize2 } from 'lucide-react';

export default function MediaPlayerComp({ media, assetUrl, captionUrl }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!assetUrl) {
    return <div className="detail-viewer__unavailable"><ImageIcon size={29} /><span>Original asset is not available through the NASA manifest.</span></div>;
  }

  if (media.mediaType === 'video') {
    return <div className="detail-video"><video src={assetUrl} controls playsInline preload="metadata">{captionUrl && <track kind="captions" src={captionUrl} srcLang="en" label="English captions" default />}</video></div>;
  }

  if (media.mediaType === 'audio') {
    return <div className="detail-audio"><div className="detail-audio__art"><Headphones size={38} strokeWidth={1.1} /></div><div className="detail-audio__content"><span className="section-kicker">NASA AUDIO ARCHIVE</span><strong>{media.title}</strong><audio src={assetUrl} controls preload="metadata" /></div></div>;
  }

  return (
    <div className="detail-image">
      {imageFailed ? <div className="detail-viewer__unavailable"><ImageIcon size={29} /><span>Image preview could not be loaded.</span></div> : <img src={assetUrl} alt={media.title} onError={() => setImageFailed(true)} />}
      <a className="detail-image__expand" href={assetUrl} target="_blank" rel="noreferrer" title="Open original asset"><Maximize2 size={15} /></a>
    </div>
  );
}
