import { LogoutButton } from "@/components/LogoutButton"
import { db } from "@/db/db"
import { UserTable } from "@/db/schema"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import type { AppContext } from "@/worker"

const Home = async ({ ctx }: { ctx: AppContext }) => {
  const allUsers = await db.select().from(UserTable).all()
  const { authUrl } = ctx

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Home Page</h1>
        <LogoutButton authUrl={authUrl} className="button" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users in Database</CardTitle>
          <p className="text-muted-foreground">
            {allUsers.length} user{allUsers.length !== 1 ? "s" : ""} registered
          </p>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-4">
            <pre className="text-sm overflow-auto max-h-96 whitespace-pre-wrap">
              {JSON.stringify(allUsers, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { Home }
