type DateTime = {
  seconds: number
  nanoseconds: number
}

export type Code = {
  id: string
  shortId: string
  scannedBy: Record<string, ScannedBy>
  name: string
  desc?: string
  location?: string
  value: number
}

type ScannedBy = {
  id: string
  firstName: string
  lastName: string
  date: DateTime
}

export type UserScannedCode = {
  id: string
  shortId: string
  name: string
  date: DateTime
  user: {
    id: string
    firstName: string
    lastName: string
  }
}

export type Leaderboard = {
  leaderboard: Record<string, LeaderboardEntry>
}

export type LeaderboardEntry = {
  id: string
  name: string
  score: number
  scanned: Record<
    string,
    {
      date: DateTime
      name: string
      id: string
    }
  >
}
