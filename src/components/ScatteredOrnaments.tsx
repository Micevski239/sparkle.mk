const images = [
  '/white.png',
  '/star.png',
  '/snowflake.png',
  '/red.png',
  '/present.png',
  '/pinetree.png',
  '/green.png',
  '/christmas.png',
  '/candy.png',
  '/bell.png',
];

const ornaments: { src: string; top: string; left?: string; right?: string; size: number; rotate: number }[] = [
  { src: images[1], top: '1%',   left: '7%',   size: 70,  rotate: -12 },
  { src: images[8], top: '2.5%', right: '14%', size: 60,  rotate: 22 },

  { src: images[5], top: '8%',   right: '3%',  size: 95,  rotate: -18 },

  { src: images[3], top: '13%',  left: '1%',   size: 65,  rotate: 14 },
  { src: images[2], top: '16%',  left: '62%',  size: 55,  rotate: -30 },

  { src: images[9], top: '22%',  right: '7%',  size: 80,  rotate: 8 },
  { src: images[0], top: '24%',  left: '4%',   size: 72,  rotate: -20 },

  { src: images[7], top: '29%',  left: '78%',  size: 68,  rotate: 32 },

  { src: images[4], top: '34%',  left: '2%',   size: 85,  rotate: -10 },
  { src: images[6], top: '36.5%',right: '5%',  size: 62,  rotate: 25 },

  { src: images[1], top: '41%',  left: '18%',  size: 55,  rotate: -28 },

  { src: images[2], top: '45%',  right: '2%',  size: 70,  rotate: 15 },
  { src: images[8], top: '47%',  left: '1%',   size: 78,  rotate: -22 },
  { src: images[5], top: '49.5%',left: '70%',  size: 88,  rotate: 10 },

  { src: images[3], top: '55%',  right: '12%', size: 65,  rotate: -16 },

  { src: images[9], top: '59%',  left: '5%',   size: 75,  rotate: 20 },
  { src: images[0], top: '62%',  right: '3%',  size: 68,  rotate: -24 },

  { src: images[7], top: '66%',  left: '25%',  size: 72,  rotate: 30 },
  { src: images[4], top: '69%',  right: '8%',  size: 82,  rotate: -14 },

  { src: images[6], top: '73%',  left: '2%',   size: 60,  rotate: 18 },

  { src: images[2], top: '77%',  left: '82%',  size: 65,  rotate: -26 },
  { src: images[1], top: '79%',  left: '6%',   size: 72,  rotate: 12 },

  { src: images[8], top: '83%',  right: '4%',  size: 80,  rotate: -20 },

  { src: images[5], top: '87%',  left: '15%',  size: 90,  rotate: 16 },
  { src: images[3], top: '90%',  right: '18%', size: 68,  rotate: -28 },

  { src: images[9], top: '94%',  left: '3%',   size: 74,  rotate: 22 },
  { src: images[7], top: '96%',  right: '6%',  size: 70,  rotate: -15 },
];

export default function ScatteredOrnaments() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {ornaments.map((o, i) => (
        <img
          key={i}
          src={o.src}
          alt=""
          className="absolute"
          loading="lazy"
          style={{
            top: o.top,
            left: o.left,
            right: o.right,
            width: o.size,
            height: 'auto',
            transform: `rotate(${o.rotate}deg)`,
            opacity: 0.12,
          }}
        />
      ))}
    </div>
  );
}
