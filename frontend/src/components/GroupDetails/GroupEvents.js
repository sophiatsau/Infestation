import React from 'react'

export default function GroupEvents({numberEvents}) {
    console.log(numberEvents, 'NUMBER EVENTS')
  return (
    <>
    <h2>Events ({numberEvents || 0})</h2>
    </>
  )
}
