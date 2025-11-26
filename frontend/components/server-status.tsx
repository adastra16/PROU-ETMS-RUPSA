"use client"

import React, { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

export default function ServerStatus() {
  const [status, setStatus] = useState<"loading" | "online" | "offline">("loading")
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api"

  useEffect(() => {
    let mounted = true

    const check = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/health`, { cache: "no-store" })
        if (!mounted) return
        if (res.ok) {
          setStatus("online")
        } else {
          setStatus("offline")
        }
      } catch (err) {
        if (!mounted) return
        setStatus("offline")
      }
    }

    void check()

    return () => {
      mounted = false
    }
  }, [apiBaseUrl])

  const label = status === "loading" ? "Checking..." : status === "online" ? "Connected" : "Disconnected"

  return (
    <Badge
      className={`flex items-center gap-2 ${status === "online" ? "bg-green-500/10 text-green-400" : status === "offline" ? "bg-red-500/10 text-red-400" : "bg-secondary text-secondary-foreground"}`}
    >
      <span
        aria-hidden
        className={`w-2 h-2 rounded-full ${status === "online" ? "bg-green-400" : status === "offline" ? "bg-red-400" : "bg-muted"}`}
      />
      <span className="text-xs font-medium">{label}</span>
    </Badge>
  )
}
