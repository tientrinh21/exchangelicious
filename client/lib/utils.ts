import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import countries from '@/lib/countries.json'
import { MoodScore } from '@/types/review-section'

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

export function getCountryName(code: string) {
  for (let country of countries) if (country.code == code) return country.name
  return 'N/A'
}

function simpleHash(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

// Hash the id to a number from 1 to 99
export function hashIDToNumber(id: string) {
  const hashInt = simpleHash(id)
  const result = Math.abs(hashInt % 99) + 1

  return result
}

const moodIcons = ['😡', '☹️', '😐', '😁', '🥰']
export const moods = Object.values(MoodScore)
export const displayMood = (mood: MoodScore) => {
  const index = moods.findIndex((m) => m === mood)
  return `${moodIcons[index]} ${moods[index]}`
}
