import { BackdropLoader, ErrorMessage } from "@/design-system/components";
import { useMigrations } from "@/hooks/use-migrations";
import { ReactNode } from "react";

export const MigrationProvider = ({ children }: { children: ReactNode }) => {
  const { isError, isLoading, isSuccess } = useMigrations();

  if (isLoading) return <BackdropLoader text="Updating local database..." />;

  if (isError)
    return (
      <div className="p-6">
        <ErrorMessage>
          <p>
            There was an error while trying to update your local database. The
            app cannot work until the changes are migrated. You can try :
          </p>
          <ul>
            <li>- Reloading to page to try to apply changes</li>
            <li>
              - File an issue{" "}
              <a
                className="underline"
                href="https://github.com/JeremieLeymarie/story-builder/issues/new"
              >
                here
              </a>
            </li>
            <li>
              Delete your local database (IndexedDB) ⚠️ Your changes will be
              lost.
            </li>
          </ul>
        </ErrorMessage>
      </div>
    );

  if (isSuccess) return children;
};
