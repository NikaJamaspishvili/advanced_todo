import Fetch from "./components/Fetch";

export default async function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Your Todos</h1>
          <p className="text-sm text-gray-500 mt-1">A simple list to keep you on track.</p>
        </header>

        <Fetch />
      </div>
    </div>
  );
}

