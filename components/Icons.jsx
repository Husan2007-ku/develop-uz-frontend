// Bir xil uslubdagi (stroke-based, 1.8px) ikonkalar to'plami — butun sayt bo'ylab
// (dashboard, navbar, landing) ishlatiladi. currentColor bilan chiziladi.

function Base({ children, size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  )
}

export function IconPencil(props) {
  return (
    <Base {...props}>
      <path d="M14.5 4.5l5 5L8 21H3v-5z" />
      <path d="M12.5 6.5l5 5" />
    </Base>
  )
}

export function IconMic(props) {
  return (
    <Base {...props}>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
      <path d="M12 17.5v4" />
      <path d="M8.5 21.5h7" />
    </Base>
  )
}

export function IconCards(props) {
  return (
    <Base {...props}>
      <rect x="3" y="6" width="13" height="15" rx="2.5" transform="rotate(-8 3 6)" />
      <rect x="7" y="3" width="14" height="16" rx="2.5" />
      <path d="M11 9h6M11 12.5h6M11 16h3.5" />
    </Base>
  )
}

export function IconBook(props) {
  return (
    <Base {...props}>
      <path d="M4 4.5C4 3.7 4.7 3 5.5 3H12v18H5.5c-.8 0-1.5-.7-1.5-1.5z" />
      <path d="M20 4.5c0-.8-.7-1.5-1.5-1.5H12v18h6.5c.8 0 1.5-.7 1.5-1.5z" />
    </Base>
  )
}

export function IconGrammar(props) {
  return (
    <Base {...props}>
      <path d="M4 6h16" />
      <path d="M4 12h10" />
      <path d="M4 18h13" />
    </Base>
  )
}

export function IconTrophy(props) {
  return (
    <Base {...props}>
      <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
      <path d="M7 5.5H4a3 3 0 0 0 3 4" />
      <path d="M17 5.5h3a3 3 0 0 1-3 4" />
      <path d="M12 14v3.5" />
      <path d="M8.5 21.5h7" />
      <path d="M9.5 17.5h5l.8 4h-6.6z" />
    </Base>
  )
}

export function IconFlame(props) {
  return (
    <Base {...props}>
      <path d="M12 2.5c.6 2.3-.4 3.6-1.7 5C8.9 9 7.5 10.6 7.5 13.2a4.5 4.5 0 0 0 9 0c0-1.4-.5-2.3-1.2-3.2.2 1.6-.5 2.6-1.3 3-.5-2-2-2.9-1.6-5C12.6 6.4 13.3 4.4 12 2.5z" />
    </Base>
  )
}

export function IconWord(props) {
  return (
    <Base {...props}>
      <path d="M4 19V6a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8l-4 4z" />
      <path d="M8 9h7M8 12.5h4.5" />
    </Base>
  )
}

export function IconEssay(props) {
  return (
    <Base {...props}>
      <path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14.5 3v4.5H19" />
      <path d="M8 12.5h8M8 15.5h8M8 18.5h5" />
    </Base>
  )
}

export function IconLock(props) {
  return (
    <Base {...props}>
      <rect x="5" y="10.5" width="14" height="10" rx="2.2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </Base>
  )
}

export function IconSun(props) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.55 1.55M17.55 17.55l1.55 1.55M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.55-1.55M17.55 6.45l1.55-1.55" />
    </Base>
  )
}

export function IconMoon(props) {
  return (
    <Base {...props}>
      <path d="M20 14.2A8.5 8.5 0 1 1 9.8 4a6.8 6.8 0 0 0 10.2 10.2z" />
    </Base>
  )
}

export function IconBot(props) {
  return (
    <Base {...props}>
      <rect x="4" y="8.5" width="16" height="11" rx="3" />
      <path d="M12 8.5V5" />
      <circle cx="12" cy="3.5" r="1.3" />
      <circle cx="9" cy="14" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="14" r="1.3" fill="currentColor" stroke="none" />
      <path d="M2.5 12.5v3M21.5 12.5v3" />
    </Base>
  )
}

export function IconTelegram(props) {
  return (
    <Base {...props}>
      <path d="M21 4.5L3.5 11.3c-.9.36-.9 1 0 1.3l4.4 1.4 1.7 5.4c.2.6.9.7 1.3.2l2.4-2.7 4.5 3.3c.6.4 1.3.1 1.5-.7L21.5 5.4c.2-.8-.4-1.3-1-.9z" />
      <path d="M8 12.9l9-6" />
    </Base>
  )
}

export function IconCheck(props) {
  return (
    <Base {...props}>
      <path d="M4.5 12.5l5 5 10-11" />
    </Base>
  )
}

export function IconArrowRight(props) {
  return (
    <Base {...props}>
      <path d="M4 12h15.5" />
      <path d="M14 6l6 6-6 6" />
    </Base>
  )
}

export function IconGrid(props) {
  return (
    <Base {...props}>
      <rect x="4" y="4" width="7" height="7" rx="1.6" />
      <rect x="13" y="4" width="7" height="7" rx="1.6" />
      <rect x="4" y="13" width="7" height="7" rx="1.6" />
      <rect x="13" y="13" width="7" height="7" rx="1.6" />
    </Base>
  )
}

export function IconChevronDown(props) {
  return (
    <Base {...props}>
      <path d="M5 8.5l7 7 7-7" />
    </Base>
  )
}

export function IconRepeat(props) {
  return (
    <Base {...props}>
      <path d="M4 11a8 8 0 0 1 13.7-5.6L20 7.5" />
      <path d="M20 3.5v4h-4" />
      <path d="M20 13a8 8 0 0 1-13.7 5.6L4 16.5" />
      <path d="M4 20.5v-4h4" />
    </Base>
  )
}

export function IconChart(props) {
  return (
    <Base {...props}>
      <path d="M4 19.5h16" />
      <path d="M7 19.5v-6M12 19.5v-10M17 19.5v-3.5" />
    </Base>
  )
}

export function IconSearch(props) {
  return (
    <Base {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M19.5 19.5l-4.3-4.3" />
    </Base>
  )
}

export function IconX(props) {
  return (
    <Base {...props}>
      <path d="M5 5l14 14M19 5L5 19" />
    </Base>
  )
}

export function IconPlus(props) {
  return (
    <Base {...props}>
      <path d="M12 5v14M5 12h14" />
    </Base>
  )
}

export function IconClock(props) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Base>
  )
}

export function IconTarget(props) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </Base>
  )
}

export function IconLayers(props) {
  return (
    <Base {...props}>
      <path d="M12 3l8.5 4.5L12 12 3.5 7.5z" />
      <path d="M3.5 12L12 16.5 20.5 12" />
      <path d="M3.5 16.5L12 21l8.5-4.5" />
    </Base>
  )
}

export function IconSend(props) {
  return (
    <Base {...props}>
      <path d="M21 4.5L3.5 11.3c-.9.36-.9 1 0 1.3l4.4 1.4 1.7 5.4c.2.6.9.7 1.3.2l2.4-2.7 4.5 3.3c.6.4 1.3.1 1.5-.7L21.5 5.4c.2-.8-.4-1.3-1-.9z" />
    </Base>
  )
}

export function IconRefresh(props) {
  return (
    <Base {...props}>
      <path d="M4 11a8 8 0 0 1 13.7-5.6L20 7.5" />
      <path d="M20 3.5v4h-4" />
    </Base>
  )
}

export function IconStar(props) {
  return (
    <Base {...props}>
      <path d="M12 2.8l2.7 5.9 6.3.7-4.7 4.4 1.3 6.3L12 17l-5.6 3.1 1.3-6.3-4.7-4.4 6.3-.7z" />
    </Base>
  )
}

export function IconEye(props) {
  return (
    <Base {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </Base>
  )
}

export function IconSave(props) {
  return (
    <Base {...props}>
      <path d="M5 3.5h11.5L19 6v14.5H5z" />
      <path d="M8 3.5V9h7V3.5" />
      <path d="M8 14h8v6.5H8z" />
    </Base>
  )
}

export function IconFilter(props) {
  return (
    <Base {...props}>
      <path d="M4 5h16" />
      <path d="M7 12h10" />
      <path d="M10 19h4" />
    </Base>
  )
}
