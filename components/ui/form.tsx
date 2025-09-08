"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import { Controller, FormProvider, useFormContext, type FieldValues, type FieldPath, type ControllerProps, type ControllerRenderProps } from "react-hook-form"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const Form = FormProvider

interface FormItemContextValue {
  id: string;
  name: FieldPath<FieldValues>; // Added name to context
}

const FormItemContext = React.createContext<FormItemContextValue | undefined>(
  undefined
)

type FormItemProps = React.HTMLAttributes<HTMLDivElement> & {
  name?: FieldPath<FieldValues>; // Allow name to be passed to FormItem
};

const FormItem = React.forwardRef<
  HTMLDivElement,
  FormItemProps
>(({ className, name, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id, name: name || "" }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

interface FormFieldContextValue {
  name: FieldPath<FieldValues>
  formItemId: string
  formDescriptionId: string
  formMessageId: string
  error?: FieldError; // Add FieldError type
}

interface FieldError {
  type: string;
  message?: string;
  ref?: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
}

const FormFieldContext = React.createContext<FormFieldContextValue | undefined>(
  undefined
)

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  if (!itemContext) {
    throw new Error("useFormField should be used within <FormItem>")
  }

  const { id: formItemId, name } = itemContext;

  const fieldState = getFieldState(name, formState)

  return {
    name,
    formItemId,
    formDescriptionId: `${formItemId}-form-item-description`,
    formMessageId: `${formItemId}-form-item-message`,
    error: fieldState.error,
  }
}

type FormLabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  FormLabelProps
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

type FormControlProps = React.ComponentPropsWithoutRef<typeof Slot>

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  FormControlProps
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

type FormDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  FormDescriptionProps
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

type FormMessageProps = React.HTMLAttributes<HTMLParagraphElement>

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  FormMessageProps
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: ControllerProps<TFieldValues, TName>
) => {
  return (
    <FormFieldContext.Provider
      value={{
        name: props.name,
        formItemId: `${props.name}-form-item`,
        formDescriptionId: `${props.name}-form-item-description`,
        formMessageId: `${props.name}-form-item-message`,
        error: useFormContext<TFieldValues>().getFieldState(props.name, useFormContext<TFieldValues>().formState).error,
      }}
    >
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  type ControllerRenderProps, // Export ControllerRenderProps
}