import Link from 'next/link'

export default function Header() {

  return (
    <header>
      <Link href="/">
        <a >
          <img src="./logo.png" alt="logo" />
        </a>
      </Link>
    </header>
  )
}
