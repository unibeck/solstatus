import { link } from "@/app/shared/links"
import { Button } from "@/app/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/shared/components/ui/card"

export function Landing() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Fullstack CF Example</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Button asChild size="lg">
              <a href={link("/home")}>Go to Home Page</a>
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> The home page is protected and requires
              authentication. You will be redirected to login if you're not
              signed in.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
