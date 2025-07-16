import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { clsx } from 'clsx'
import { Plus, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx'
import {
  Form,
  FormControl,
  FormField,
  FormItem
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx'
import { addTable, useAppDispatch } from '@/store'

const ADDRESS_TYPES = ['City', 'Street', 'Home'] as const

const MAX_DYNAMIC_COLUMNS = 3

const formSchema = z.object({
  dynamicColumns: z
    .array(
      z.object({
        name: z.string().min(1)
      })
    )
    .max(MAX_DYNAMIC_COLUMNS),
  addressColumn: z.enum(ADDRESS_TYPES)
})

type CreateTableFormValues = z.infer<typeof formSchema>

export type CreateTableButtonProps = {
  onCreate?: (values: CreateTableFormValues) => void
}

export const CreateTableButton = ({ onCreate }: CreateTableButtonProps) => {
  const dispatch = useAppDispatch()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const form = useForm<CreateTableFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dynamicColumns: [{ name: '' }],
      addressColumn: undefined
    }
  })

  const { fields, prepend, remove } = useFieldArray({
    control: form.control,
    name: 'dynamicColumns'
  })
  const isDynamicColumnsLimitReached = fields.length >= MAX_DYNAMIC_COLUMNS

  const addDynamicColumn = () => {
    if (isDynamicColumnsLimitReached) {
      return
    }

    prepend({ name: '' })
  }

  function onSubmit(values: CreateTableFormValues) {
    dispatch(
      addTable([
        ...values.dynamicColumns.map(({ name }) => name),
        values.addressColumn
      ])
    )

    setIsDropdownOpen(false)
    toast.success('Table has been created', {
      duration: 2000,
      position: 'top-center',
      dismissible: true,
      richColors: true
    })

    onCreate?.(values)
    form.reset()
  }

  const openDropdown = () => {
    setIsDropdownOpen(true)
  }

  const closeDropdown = () => {
    setIsDropdownOpen(false)
    form.reset()
  }

  return (
    <DropdownMenu open={isDropdownOpen}>
      <DropdownMenuTrigger onClick={openDropdown}>
        <Button
          variant="outline"
          size="default"
          className="cursor-pointer capitalize"
        >
          create table
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="px-4 py-5"
        onCloseAutoFocus={(event) => event.preventDefault()}
        onInteractOutside={closeDropdown}
        onEscapeKeyDown={closeDropdown}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Button
              type="button"
              className={clsx('w-full cursor-pointer', {
                'cursor-not-allowed': isDynamicColumnsLimitReached
              })}
              variant="outline"
              onClick={addDynamicColumn}
            >
              <Plus className="size-4" />
            </Button>

            {fields.map((field, index, array) => {
              const canRemoveInput = array.length > 1
              const removeInput = () => {
                if (!canRemoveInput) {
                  return
                }

                remove(index)
              }

              return (
                <div
                  key={field.id}
                  className="flex items-center justify-between gap-2"
                >
                  <FormField
                    control={form.control}
                    name={`dynamicColumns.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Column name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    className={clsx('cursor-pointer', {
                      'cursor-not-allowed': !canRemoveInput
                    })}
                    onClick={removeInput}
                  >
                    <Trash className="size-4" />
                  </Button>
                </div>
              )
            })}

            <FormField
              control={form.control}
              name="addressColumn"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select column name" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ADDRESS_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full cursor-pointer uppercase">
              add
            </Button>
          </form>
        </Form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
