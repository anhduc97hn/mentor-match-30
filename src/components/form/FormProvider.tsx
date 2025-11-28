"use client"

import { FormProvider as RHFormProvider, UseFormReturn } from "react-hook-form";
import { ReactNode, FormEventHandler } from "react";

interface FormProviderProps {
  children: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  methods: UseFormReturn<any>;
}

function FormProvider({ children, onSubmit, methods }: FormProviderProps) {
  return (
    <RHFormProvider {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </RHFormProvider>
  );
}

export default FormProvider;