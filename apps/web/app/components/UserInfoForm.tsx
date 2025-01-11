import { Form } from "@remix-run/react";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from "./ui/modal";

interface UserInfoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserInfoForm({ open, onOpenChange }: UserInfoFormProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle className="text-text dark:text-darkText">
            Complete Your Profile
          </ModalTitle>
          <ModalDescription>
            Please provide your information to continue.
          </ModalDescription>
        </ModalHeader>
        <Form method="post" action="/user-info" className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="text-text dark:text-darkText text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              className="text-text dark:text-darkText flex h-10 w-full rounded-md border-2 border-border dark:border-darkBorder bg-white dark:bg-secondaryBlack px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="text-text dark:text-darkText text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              className="text-text dark:text-darkText flex h-10 w-full rounded-md border-2 border-border dark:border-darkBorder bg-white dark:bg-secondaryBlack px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="timezone"
              className="text-text dark:text-darkText text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Timezone
            </label>
            <select
              id="timezone"
              name="timezone"
              className="text-text dark:text-darkText flex h-10 w-full rounded-md border-2 border-border dark:border-darkBorder bg-white dark:bg-secondaryBlack px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              {Intl.supportedValuesOf("timeZone").map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="bio"
              className="text-text dark:text-darkText text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              className="text-text dark:text-darkText flex min-h-[80px] w-full rounded-md border-2 border-border dark:border-darkBorder bg-white dark:bg-secondaryBlack px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            >
              Save Profile
            </button>
          </div>
        </Form>
      </ModalContent>
    </Modal>
  );
}
