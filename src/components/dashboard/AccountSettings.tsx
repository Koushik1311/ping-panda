"use client"

import { client } from "@/lib/client"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import Card from "../global/Card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import Link from "next/link"
import { Button } from "../ui/button"

export default function AccountSettings({
  discordId: initialDiscordId,
}: {
  discordId: string
}) {
  const [discordId, setDiscordId] = useState(initialDiscordId)

  const { mutate, isPending } = useMutation({
    mutationFn: async (discordId: string) => {
      const res = await client.project.setDiscordID.$post({ discordId })
      return await res.json()
    },
  })

  return (
    <Card className="max-w-xl w-full space-y-4">
      <div>
        <Label>Discord ID</Label>
        <Input
          value={discordId}
          onChange={(e) => setDiscordId(e.target.value)}
          placeholder="Enter your Discord ID"
          className="mt-1"
        />
      </div>

      <p className="mt-2 text-sm/6 text-gray-600">
        Don&apos;t know how to find your Discord ID?{" "}
        <Link
          href="https://www.androidpolice.com/how-to-find-discord-id/"
          target="_blank"
          className="text-brand-600 hover:text-brand-500"
        >
          Learn how to obtain it here
        </Link>
      </p>

      <div className="pt-4">
        <Button onClick={() => mutate(discordId)} disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Card>
  )
}
