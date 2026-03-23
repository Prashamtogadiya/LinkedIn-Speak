import { useMemo, useState } from "react";
import { ArrowRightLeft, Copy, LoaderCircle } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Textarea } from "./components/ui/textarea";
import LinkedinIcon from "./components/icons/linkedin-icon";
import SparklesIcon from "./components/icons/sparkles-icon";
import CopyIcon from "./components/icons/copy-icon";

const sampleInput =
  "I completed my first hackathon project with my friends and we built an AI study tool in 24 hours. I learned a lot and we won second place.";

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const canGenerate = input.trim().length > 0 && !isLoading;

  const stats = useMemo(
    () => [
      { label: "Tone", value: "Professional, warm" },
      { label: "Format", value: "LinkedIn-ready caption" },
      { label: "Powered by", value: "Groq + Llama" }
    ],
    []
  );

  async function generateCaption() {
    if (!canGenerate) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ input })
      });

      const data = (await response.json()) as { output?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to generate a LinkedIn caption right now.");
      }

      setOutput(data.output || "");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong while converting your text."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function copyOutput() {
    if (!output) {
      return;
    }

    await navigator.clipboard.writeText(output);
  }

  function swapPanels() {
    setInput(output);
    setOutput(input);
  }

  function useSample() {
    setInput(sampleInput);
    setOutput("");
    setError("");
  }

  function clearAll() {
    setInput("");
    setOutput("");
    setError("");
  }

  return (
    <main className="relative overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
      <div className="absolute inset-0 -z-10 bg-grain opacity-90" />
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center">
        <section className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm font-semibold text-muted-foreground shadow-sm backdrop-blur">
              <LinkedinIcon className="h-8 w-8 text-primary" />
              Plain thoughts in, LinkedIn polish out
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              LinkedIn Speak turns your simple achievement into a post people actually expect to
              read on LinkedIn.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
              Type what happened in normal English, then generate a polished caption with a strong
              hook, clear story, gratitude, and that unmistakable professional LinkedIn energy.
            </p>
          </div>

          <Card className="grid gap-3 p-5">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between rounded-2xl bg-slate-50/80 px-4 py-3">
                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                <span className="text-sm font-semibold text-foreground">{stat.value}</span>
              </div>
            ))}
          </Card>
        </section>

        <Card className="overflow-hidden">
          <div className="flex flex-col border-b border-border/70 bg-white/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 text-primary" >
                <SparklesIcon className="h-7 w-7"/>
              </div>
              <div>
                <p className="text-base font-bold">Translator</p>
                <p className="text-sm text-muted-foreground">
                  Inspired by the familiar Google Translate split layout
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 sm:mt-0">
              <Button variant="secondary" size="sm" onClick={useSample}>
                Use sample
              </Button>
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear
              </Button>
              <Button variant="secondary" size="icon" onClick={swapPanels} aria-label="Swap panels">
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_auto_1fr]">
            <section className="border-b border-border/70 p-5 lg:border-b-0 lg:border-r">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    English
                  </p>
                  <p className="text-sm text-muted-foreground">What actually happened</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {input.trim().length} chars
                </span>
              </div>

              <Textarea
                placeholder="Example: I finished my internship today and learned a lot about frontend development..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
            </section>

            <div className="hidden items-center justify-center border-r border-border/70 bg-slate-50/60 px-3 lg:flex">
              <div className="rounded-full border border-white/80 bg-white p-3 shadow-sm">
                <ArrowRightLeft className="h-5 w-5 text-primary" />
              </div>
            </div>

            <section className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    LinkedIn Speak
                  </p>
                  <p className="text-sm text-muted-foreground">Ready to post</p>
                </div>
                <Button variant="ghost" size="sm" onClick={copyOutput} disabled={!output}>
                  <CopyIcon className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              </div>

              <div className="min-h-[300px] rounded-[1.5rem] bg-slate-50/75 p-1">
                <div className="flex min-h-[292px] rounded-[1.2rem] bg-white/90 p-5">
                  {output ? (
                    <p className="whitespace-pre-wrap text-base leading-7 text-foreground">{output}</p>
                  ) : (
                    <p className="max-w-md text-base leading-7 text-muted-foreground">
                      Your rewritten caption will appear here with a punchy opening, clean spacing,
                      and a professional tone that still sounds human.
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-4 border-t border-border/70 bg-white/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {error ? (
                <span className="font-medium text-destructive">{error}</span>
              ) : (
                "Tip: include what happened, your impact, and what you learned for stronger posts."
              )}
            </div>

            <Button onClick={generateCaption} disabled={!canGenerate}>
              {isLoading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? "Generating..." : "Translate to LinkedIn Speak"}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default App;
