import Link from 'next/link'
import React from 'react'

const Page = () => {
  return (
    <><div>Hello World</div>
      <Link href="/analytics" key="analytics">
        Go to Analytics Page
      </Link ></>
  )
}

export default Page