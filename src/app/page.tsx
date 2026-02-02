import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <main className="flex flex-col items-center gap-8 max-w-4xl">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Welcome to Your App
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Built with Next.js, Supabase, shadcn/ui, and Tailwind CSS
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Next.js 15</CardTitle>
              <CardDescription>
                The React framework for production
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                App Router, Server Components, and more.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Supabase</CardTitle>
              <CardDescription>
                Open source Firebase alternative
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Database, Auth, Storage, and Realtime subscriptions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>shadcn/ui</CardTitle>
              <CardDescription>
                Beautiful UI components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Accessible and customizable components built with Radix UI.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
