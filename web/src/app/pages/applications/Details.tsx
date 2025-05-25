import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import { InteriorLayout } from "@/app/layouts/InteriorLayout";
import { RequestInfo } from "rwsdk/worker";
import { db } from "@/db";
import { Button } from "@/app/components/ui/button";
import { Badge, badgeVariants } from "@/app/components/ui/badge";
import { VariantProps } from "class-variance-authority";
import { Icon } from "@/app/components/Icon";
import { ContactCard } from "@/app/components/ContactCard";
import { DeleteApplicationButton } from "@/app/components/DeleteApplicationButton";
import { link } from "@/app/shared/links";

const Details = async ({ params }: RequestInfo) => {
  const application = await db.application.findUnique({
    where: {
      id: params.id,
    },
    include: {
      status: true,
      company: {
        include: {
          contacts: true,
        },
      },
    },
  });

  return (
    <InteriorLayout>
      <div className="breadcrumbs">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/applications">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {application?.jobTitle} at {application?.company?.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="px-page-side">
        <header className="flex justify-between border-b-1 border-border pb-6 mb-12">
          <div>
            <div className="flex items-center gap-5 mb-1">
              <h1 className="page-title">{application?.jobTitle}</h1>
              <Badge
                variant={
                  application?.status?.status.toLowerCase() as VariantProps<
                    typeof badgeVariants
                  >["variant"]
                }
              >
                {application?.status?.status}
              </Badge>
            </div>
            <p>
              <span className="text-zinc-500">at</span>{" "}
              {application?.company?.name}
            </p>
          </div>
          <div>
            <Button>
              <a
                href={application?.postingUrl as string}
                target="_blank"
                className="flex items-center gap-2"
              >
                View Application <Icon id="external-link" size={16} />
              </a>
            </Button>
          </div>
        </header>
        <div className="two-column-grid">
          <div>
            <div className="mb-12">{application?.jobDescription}</div>
            <div className="flex items-center gap-5">
              <Button variant="secondary" asChild>
                <a
                  href={link("/applications/:id/edit", {
                    id: application?.id || "",
                  })}
                >
                  <Icon id="edit" size={16} /> Edit
                </a>
              </Button>
              <DeleteApplicationButton applicationId={application?.id || ""} />
            </div>
          </div>
          <aside>
            <div className="box">
              <h3 className="mb-4">Compensation</h3>
              <div className="flex items-center gap-6">
                <Icon id="salary" size={32} />
                <div className="text-sm">
                  <p className="text-zinc-500">Salary</p>
                  <p className="font-bold">
                    {application?.salaryMin} - {application?.salaryMax}
                  </p>
                </div>
              </div>
            </div>

            <div className="box">
              <h3>Contacts</h3>
              <p className="input-description">
                Invite your team members to collaborate.
              </p>
              {application?.company?.contacts && (
                <ul>
                  {application?.company?.contacts.map((contact) => (
                    <li key={contact.id}>
                      <ContactCard contact={contact} isEditable={false} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </div>
    </InteriorLayout>
  );
};

export { Details };
