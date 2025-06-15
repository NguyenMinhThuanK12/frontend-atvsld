
import { ReportSanitationForm } from '@/libs/shared/atvsld/models/report-sanitation.model';
import { Grid } from '@mui/material';
import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form';
import PrimaryTextField from '../FormFields/primaryTextInput';
import { renderLabelWithAsterisk } from '@/libs/atvsld/utils/commonFunction';

interface NumericInputProps {
  name: keyof ReportSanitationForm;
  label: string;
  control: UseFormReturn<ReportSanitationForm>["control"];
  errors: UseFormReturn<ReportSanitationForm>["formState"]["errors"];
    rules?: Record<string, any>;
    required?: boolean;
}

export default function NumericInput(props: NumericInputProps) {
    const { name, label, control, errors, rules, required = false } = props;
    
  return (
    <Grid size={4}>
      <Controller
        name={name}
        control={control}
        rules={{
          required: `${label} là bắt buộc`,
          pattern: {
            value: /^\d+$/,
            message: `${label} phải là số nguyên dương`,
          },
          ...rules,
        }}
        render={({ field }) => (
          <PrimaryTextField
            label={renderLabelWithAsterisk(label, required)}
            value={field.value}
            onChange={field.onChange}
            size="small"
            error={!!errors[name]}
            helperText={errors[name]?.message}
            className="w-full"
          />
        )}
      />
    </Grid>
  );
}
