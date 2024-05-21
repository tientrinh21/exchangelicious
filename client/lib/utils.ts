import { type University } from '@/types/university'
import axios from 'axios'
import { clsx, type ClassValue } from 'clsx'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

export async function fetcher(...args: Parameters<typeof fetch>) {
  const res = await fetch(...args)

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error: Error = new Error('An error occurred while fetching the data.')
    // Attach extra info to the error object.
    error.message = (await res.json()).message
    throw error
  }

  return res.json()
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export function toRomanNumerals(decimalNumber: number): string {
  const romanNums = [
    '',
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX',
    'X',
    'XI',
    'XII',
    'XIII',
    'XIV',
    'XV',
  ]

  return romanNums[decimalNumber]
}

export function objKeyToText(key: string) {
  return `${key[0].toUpperCase()}${key.substring(1).replaceAll('_', ' ')}`
}
