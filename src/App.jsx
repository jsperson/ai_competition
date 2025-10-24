import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center text-3xl">
            ✓ Deployment Working
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            shadcn/ui components loaded successfully
          </p>
          <Button className="w-full" size="lg">
            Building app now...
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
