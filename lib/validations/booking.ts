import { z } from "zod";
/**
 * Shared booking form schema.
 * Used BOTH:
 *   - in the sidebar booking form (client, React Hook Form)
 *   - in the future checkout Server Action (server re-validation)
 * Keeping it in one place guarantees the same rules run everywhere.
 */
export const BookingSchema = z
  .object({
    name: z.string().min(1, "Name is required."),
    email: z.email("Please enter a valid email address."),
    confirmEmail: z.email("Please enter a valid email address."),
    phone: z.string().optional(),
    date: z.coerce.date({
      message: "Please choose a valid date.",
    }),
    tickets: z.coerce
      .number({ message: "Number of tickets must be a number." })
      .min(1, "At least 1 ticket is required."),
    message: z.string().optional(),

    // Defaults for server compatibility / full checkout step
    time: z.string().default("10:00"),
    adults: z.number().default(1),
    children: z.number().default(0),
    infants: z.number().default(0),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Emails do not match.",
    path: ["confirmEmail"],
  });

export type BookingFormData = z.infer<typeof BookingSchema>;
export type BookingFormInput = z.input<typeof BookingSchema>;
