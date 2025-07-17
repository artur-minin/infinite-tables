'use client'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx'
import { addTable, useAppDispatch } from '@/store'

const formSchema = z.object({
  firstColumnName: z.string().min(1),
  secondColumnName: z.string().min(1),
  thirdColumnName: z.string().min(1),
  fourthColumnName: z.enum(['City', 'Street', 'Home'])
})

export type ProfileFormValues = z.infer<typeof formSchema>

export function ProfileForm() {
  const dispatch = useAppDispatch()
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstColumnName: '',
      secondColumnName: '',
      thirdColumnName: '',
      fourthColumnName: undefined
    }
  })

  // 2. Define a submit handler.
  function onSubmit(values: ProfileFormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    dispatch(addTable({ id: Date.now(), ...values }))
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="firstColumnName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="First column" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="secondColumnName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Second column" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thirdColumnName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Third column" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fourthColumnName"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select fourth column" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="City">City</SelectItem>
                  <SelectItem value="Street">Street</SelectItem>
                  <SelectItem value="Home">Home</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full uppercase">
          add
        </Button>
      </form>
    </Form>
  )
}
