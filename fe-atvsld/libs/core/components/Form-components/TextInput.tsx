import { ReportSanitationForm } from '@/libs/shared/atvsld/models/report-sanitation.model';
import { Grid } from '@mui/material';
import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form';
import PrimaryTextField from '../FormFields/primaryTextInput';
import { renderLabelWithAsterisk } from '@/libs/atvsld/utils/commonFunction';

interface TextInputProps {
  name: keyof ReportSanitationForm;
  label: string;
  control: UseFormReturn<ReportSanitationForm>["control"];
  errors: UseFormReturn<ReportSanitationForm>["formState"]["errors"];
}

export default function TextInput(props: TextInputProps) {
  const { name, label, control, errors } = props;
  return (
    <Grid size={4}>
      <Controller
        name={name}
        control={control}
        rules={{ required: `${label} là bắt buộc` }}
        render={({ field }) => (
          <PrimaryTextField
            label={renderLabelWithAsterisk(label, true)}
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
