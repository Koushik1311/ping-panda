import DashboardPage from "@/components/dashboard/DashboardPage"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import DashboardPageContent from "./DashboardPageContent"
import CreateEventCategoryModel from "@/components/dashboard/CreateEventCategoryModel"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { createCheckoutSession } from "@/lib/stripe"
import PaymentSuccessModel from "@/components/dashboard/PaymentSuccessModel"

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function Page({ searchParams }: PageProps) {
  const auth = await currentUser()

  if (!auth) {
    redirect("/sign-in")
  }

  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  })

  if (!user) {
    redirect("/sign-in")
  }

  const intent = searchParams.intent

  if (intent === "upgrade") {
    const session = await createCheckoutSession({
      userEmail: user.email,
      userId: user.id,
    })

    if (session.url) redirect(session.url)
  }

  const success = searchParams.success

  return (
    <>
      {success ? <PaymentSuccessModel /> : null}

      <DashboardPage
        cta={
          <CreateEventCategoryModel>
            <Button className="w-full sm:w-fit">
              <PlusIcon className="size-4 mr-2" />
              Add Category
            </Button>
          </CreateEventCategoryModel>
        }
        title="Dashboard"
      >
        <DashboardPageContent />
      </DashboardPage>
    </>
  )
}
