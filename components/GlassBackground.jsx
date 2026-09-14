import styles from './GlassBackground.module.css'

// Apple-glass mesh fon + grain overlay — dashboard, landing va boshqa
// sahifalarda bir xil vizual tilni saqlash uchun umumiy komponent.
export default function GlassBackground() {
  return (
    <>
      <div className={styles.mesh} aria-hidden="true">
        <span className={`${styles.meshSpan} ${styles.b1}`} />
        <span className={`${styles.meshSpan} ${styles.b2}`} />
        <span className={`${styles.meshSpan} ${styles.b3}`} />
        <span className={`${styles.meshSpan} ${styles.b4}`} />
      </div>
      <svg className={styles.grain} aria-hidden="true">
        <filter id="grainFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grainFilter)" />
      </svg>
    </>
  )
}
