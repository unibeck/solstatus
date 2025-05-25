"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import { Button } from "./ui/button";
import { DatePicker } from "./ui/datepicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ApplicationStatus, Contact } from "@prisma/client";
import { createApplication } from "../pages/applications/functions";
import { Icon } from "./Icon";
import { ContactForm } from "./ContactForm";
import { useState } from "react";
import { ContactCard } from "./ContactCard";

const ApplicationForm = ({
  statuses,
  contacts,
}: {
  statuses: ApplicationStatus[];
  contacts: Contact[];
}) => {
  const [isContactSheetOpen, setIsContactSheetOpen] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    formData.append("contacts", JSON.stringify(contacts));
    const result = await createApplication(formData);
    if (result.success) {
      window.location.href = `/applications`;
    } else {
      console.error(result.error);
    }
  };

  return (
    <form action={handleSubmit}>
      <div className="two-column-grid px-page-side">
        {/* left side */}
        <div>
          <div>
            <h2>Company Information</h2>
            <div className="field">
              <label htmlFor="company">Company Name</label>
              <p className="input-description">What company caught your eye?</p>
              <input type="text" id="company" name="company" />
            </div>
            <div className="field">
              <label htmlFor="jobTitle">Job Title</label>
              <p className="input-description">What's the job you're after?</p>
              <input type="text" id="jobTitle" name="jobTitle" />
            </div>
            <div className="field">
              <label htmlFor="jobDescription">
                Job Description / Requirements
              </label>
              <p className="input-description">What are they looking for?</p>
              <textarea id="jobDescription" name="jobDescription" />
            </div>
            <div className="field">
              <div className="label">Salary Range</div>
              <p className="input-description">What does the pay look like?</p>
              <div className="flex gap-4">
                <div className="flex-1 label-inside">
                  <label htmlFor="salaryMin">Min</label>
                  <input type="text" id="salaryMin" name="salaryMin" />
                </div>
                <div className="flex-1 label-inside">
                  <label htmlFor="salaryMax">Max</label>
                  <input type="text" id="salaryMax" name="salaryMax" />
                </div>
              </div>
            </div>
            <div className="field">
              <label htmlFor="url">Application URL</label>
              <p className="input-description">What does the pay look like?</p>
              <input type="text" id="url" name="url" />
            </div>
            <div className="field">
              <Button role="submit">Create</Button>
            </div>
          </div>
        </div>

        {/* right side */}
        <div>
          <div className="box">
            <label>Application submission date</label>
            <DatePicker name="dateApplied" />
          </div>

          <div className="box">
            <label htmlFor="application-status">Application Status</label>
            <Select name="status">
              <SelectTrigger>
                <SelectValue placeholder="Select a Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses &&
                  statuses.map((status) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      {status.status}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="box">
            <h3>Contacts</h3>
            <p className="input-description">
              Invite your team members to collaborate.
            </p>
            {contacts && (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <ContactCard contact={contact} />
                  </li>
                ))}
              </ul>
            )}
            <Sheet
              open={isContactSheetOpen}
              onOpenChange={setIsContactSheetOpen}
            >
              <SheetTrigger className="flex items-center gap-2 font-poppins text-sm font-bold bg-secondary py-3 px-6 rounded-md cursor-pointer">
                <Icon id="plus" size={16} />
                Add a Contact
              </SheetTrigger>
              <SheetContent className="pt-[100px] px-12">
                <SheetHeader>
                  <SheetTitle>Add a Contact</SheetTitle>
                  <SheetDescription>
                    Add a Contact to this application.
                  </SheetDescription>
                  <ContactForm callback={() => setIsContactSheetOpen(false)} />
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </form>
  );
};

export { ApplicationForm };
