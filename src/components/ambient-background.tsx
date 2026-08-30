"use client"

import React from 'react'

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute top-[-10%] left-[15%] h-[550px] w-[550px] rounded-full bg-indigo-600/20 blur-[130px] animate-pulse transition-opacity duration-500" />
      <div className="absolute top-[25%] right-[10%] h-[450px] w-[450px] rounded-full bg-pink-600/15 blur-[120px] transition-opacity duration-500" />
      <div className="absolute bottom-[10%] left-[25%] h-[500px] w-[500px] rounded-full bg-cyan-600/15 blur-[140px] transition-opacity duration-500" />
    </div>
  )
}
