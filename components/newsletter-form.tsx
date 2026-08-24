"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [signedUp, setSignedUp] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.includes("@")) return;
    setSignedUp(true);
  };

  if (signedUp) {
    return (
      <p className="kire-label text-blue-400">
        On the list. We will write when the fabric allows.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex max-w-[420px] items-end gap-4">
      <label className="flex flex-1 flex-col gap-2">
        <span className="kire-label text-ink-300">Email</span>
        {/* Fields never gain a box — the bottom rule does the work. */}
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="h-[42px] border-0 border-b border-ink-300 bg-transparent text-cream-100 placeholder:text-ink-500 focus:border-b-2 focus:border-blue-400 focus:outline-none"
        />
      </label>
      <Button type="submit" variant="primary" size="md">
        Notify me
      </Button>
    </form>
  );
}
