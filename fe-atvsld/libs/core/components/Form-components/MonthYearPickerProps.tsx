import { renderLabelWithAsterisk } from '@/libs/atvsld/utils/commonFunction';
import { ReportSanitationForm } from '@/libs/shared/atvsld/models/report-sanitation.model';
import { Grid } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { vi } from 'date-fns/locale';
import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form';

interface MonthYearPickerProps {
  name: keyof ReportSanitationForm;
  label: string;
  control: UseFormReturn<ReportSanitationForm>["control"];
  errors: UseFormReturn<ReportSanitationForm>["formState"]["errors"];
}

export default function MonthYearPicker(props : MonthYearPickerProps) {
  const { name, label, control, errors } = props;
  return (
    <Grid size={4}>
      <Controller
        name={name}
        control={control}
        rules={{ required: `${label} là bắt buộc` }}
        render={({ field }) => (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <DatePicker
              label={renderLabelWithAsterisk(label, true)}
              value={field.value ? new Date(field.value) : null}
              onChange={(date) =>
                field.onChange(date ? date.toISOString().slice(0, 7) : null)
              }
              views={["month", "year"]}
              format="MM/yyyy"
              slotProps={{
                textField: {
                  size: "small",
                  error: !!errors[name],
                  helperText: errors[name]?.message,
                  className: "w-full",
                },
              }}
            />
          </LocalizationProvider>
        )}
      />
    </Grid>
  );
}
