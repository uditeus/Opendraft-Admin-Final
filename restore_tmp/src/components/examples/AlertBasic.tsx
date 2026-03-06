import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AppIcon } from "@/components/icons/AppIcon";

export function AlertBasic() {
  return (
    <Alert className="max-w-md">
      <AppIcon name="CheckCircle2Icon" />
      <AlertTitle>Account updated successfully</AlertTitle>
      <AlertDescription>
        Your profile information has been saved. Changes will be reflected immediately.
      </AlertDescription>
    </Alert>
  );
}
