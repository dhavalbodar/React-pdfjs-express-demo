import React from 'react'

const Child = ({ viewer }) => {

  return (
    <div className="MyComponent" style={{
        height:'100vh',
        width: '100%'
    }}>
      <div style={{
        height:'100vh',
        width: '100%'
    }} className="webviewer" ref={viewer}></div>
    </div>  
  )
}

export default Child