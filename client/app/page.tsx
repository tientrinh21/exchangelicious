import HeroSection from '@/components/home/hero-section'
import ReadySection from '@/components/home/ready-section'
import WhereSection from '@/components/home/where-section'
import React from 'react'

export default function Homepage() {
  return (
    <div className="w-full">
      <HeroSection />
      <WhereSection />
      <ReadySection />
    </div>
  )
}
