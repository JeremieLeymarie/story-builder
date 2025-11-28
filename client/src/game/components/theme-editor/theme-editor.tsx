import { Toolbar } from "@/design-system/components/toolbar";
import {
  ThemeEditorForm,
  ThemeEditorSchema,
} from "../../hooks/use-theme-editor-form";
import { TitleSection } from "./title-section";

export const ThemeEditor = ({
  form,
  values,
}: {
  form: ThemeEditorForm;
  values: ThemeEditorSchema;
}) => {
  return (
    <div className="absolute top-16 right-5">
      <Toolbar>
        <form className="space-y-4">
          <TitleSection form={form} values={values} />
        </form>
      </Toolbar>
    </div>
  );
};
