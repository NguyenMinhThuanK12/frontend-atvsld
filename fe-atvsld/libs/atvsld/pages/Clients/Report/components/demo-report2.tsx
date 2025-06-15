import React, { useEffect, useState } from "react";
import CostInput from "@/libs/core/components/Form-components/CostInput";
import MonthYearPicker from "@/libs/core/components/Form-components/MonthYearPickerProps";
import NumericInput from "@/libs/core/components/Form-components/NumericInput";
import TextInput from "@/libs/core/components/Form-components/TextInput";
import { ReportSanitationForm } from "@/libs/shared/atvsld/models/report-sanitation.model";
import { Divider, Grid } from "@mui/material";
import {
  useForm,
  SubmitHandler,
  UseFormHandleSubmit,
  Control,
  FieldErrors,
} from "react-hook-form";
import { formSections } from "./section";

interface FormField {
  name: keyof ReportSanitationForm;
  label: string;
  component: "NumericInput" | "CostInput" | "TextInput" | "MonthYearPicker";
  note?: string;
}

export interface SectionConfig {
  id: number;
  title: string;
  fields: FormField[];
  note?: string;
}

const sections: SectionConfig[] = formSections;

interface SectionProps {
  section: SectionConfig;
  control: Control<ReportSanitationForm>; // Use the correct type for your control
  errors: FieldErrors<ReportSanitationForm>; // Use the correct type for your errors
}

const Section = (props: SectionProps) => {
  const { section, control, errors } = props;
  return (
    <div className="flex flex-col space-y-6 items-start">
      <div className="w-full flex items-center justify-between">
        <span className="text-md text-gray-900 font-semibold">
          {section.id}. {section.title}
        </span>
        {section.note && (
          <span className="text-sm text-red-400 font-semibold">
            {section.note}
          </span>
        )}
      </div>
      <Grid container rowSpacing={4} columnSpacing={8} sx={{ width: "100%" }}>
        {section.fields.map((field, index) => {
          const commonProps = {
            name: field.name,
            label: field.label,
            control,
            errors,
          };
          switch (field.component) {
            case "NumericInput":
              return <NumericInput key={index} {...commonProps} />;
            case "CostInput":
              return <CostInput key={index} {...commonProps} />;
            case "TextInput":
              return <TextInput key={index} {...commonProps} />;
            case "MonthYearPicker":
              return <MonthYearPicker key={index} {...commonProps} />;
            default:
              return null;
          }
        })}
      </Grid>
    </div>
  );
};

interface ReportDemoProps {
  formData: ReportSanitationForm;
  setHandleSubmit?: (
    handleSubmit: UseFormHandleSubmit<ReportSanitationForm>
  ) => void;
}

export default function ReportDemo(props: ReportDemoProps) {
  const { formData, setHandleSubmit } = props;
  const [selectedReportSanitation, setSelectedReportSanitation] =
    useState<ReportSanitationForm>(formData);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportSanitationForm>({
    defaultValues: selectedReportSanitation,
    mode: "onChange",
  });

  // pass handleSubmit to parent
  useEffect(() => {
    if (setHandleSubmit) {
      setHandleSubmit(handleSubmit);
    }
  }, [setHandleSubmit, handleSubmit]);

  return (
    <div className="w-full h-auto flex-grow bg-white p-6 rounded-lg shadow-md overflow-auto">
      <form className="w-full flex flex-col gap-4">
        {sections.map((section) => (
          <React.Fragment key={section.id}>
            <Section section={section} control={control} errors={errors} />
            <Divider
              sx={{
                borderColor: "#e6e6e6",
                borderBottomWidth: 2,
                mx: "auto",
                mt: 2,
                width: "100%",
              }}
            />
          </React.Fragment>
        ))}
      </form>
    </div>
  );
}
