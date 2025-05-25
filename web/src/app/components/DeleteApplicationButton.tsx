"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Button } from "./ui/button";
import { Icon } from "./Icon";
import { toast } from "sonner";
import { deleteApplication } from "@/app/pages/applications/functions";
import { useState } from "react";

const DeleteApplicationButton = ({
  applicationId,
}: {
  applicationId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const result = await deleteApplication(applicationId);
    if (result.success) {
      toast.success("Application deleted successfully");
      window.location.href = "/applications";
    } else {
      console.error(result.error);
      toast.error("Failed to delete application");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-destructive fill-current">
          <Icon id="trash" size={16} /> Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="py-12 px-14">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-destructive text-3xl font-bold mb-2">
            Are you absolutely sure?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Nevermind
          </Button>
          <Button
            variant="destructive"
            className="fill-current"
            onClick={(e) => handleDelete(e)}
          >
            <Icon id="check" />
            Yes, Delete It
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { DeleteApplicationButton };
